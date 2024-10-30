"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import { useRecoilState } from "recoil";
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/supabase/recoil/atoms";
import { getAllUserTable } from "actions/chatAction";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 로그인 한 유저와 채팅 기록이 있는 사람만 가져오기
async function getChatUsers(loggedInUserId) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("message")
    .select("sender, receiver")
    .or(`sender.eq.${loggedInUserId},receiver.eq.${loggedInUserId}`); // 로그인한 사용자의 ID가 sender 또는 receiver인 메시지 조회

  if (error) {
    console.error("Error fetching chat users:", error);
    throw new Error("채팅 사용자 정보를 불러오는 중 오류가 발생했습니다."); // 에러 처리
  }

  return data || [];
}

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );
  const [presence, setPresence] = useRecoilState(presenceState);
  const supabase = createBrowserSupabaseClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: chatUsers = [], error: chatUsersError } = useQuery({
    queryKey: ["chatUsers", loggedInUser.id],
    queryFn: async () => await getChatUsers(loggedInUser.id),
    enabled: !!loggedInUser.id, // 로그인한 사용자 ID가 있을 때만 실행
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getAllUserTable();
      return users;
    },
  });

  // 쿼리 파라미터에서 userId 가져오기
  const userIdFromQuery = searchParams.get("userId");

  // 필터링된 유저목록
  const filteredUsers = allUsers.filter((user) => {
    const isNotLoggedInUser = user.id.toString() !== loggedInUser.id.toString();
    const isChattingUser = chatUsers.some(
      (chatUser) => chatUser.receiver === user.id || chatUser.sender === user.id
    );
    const isSelectedUser = user.id.toString() === userIdFromQuery; // 쿼리 파라미터에서 가져온 유저 ID와 비교
    return isNotLoggedInUser && (isChattingUser || isSelectedUser); // 나와 채팅 기록이 있는 유저만 반환
  });

  useEffect(() => {
    if (userIdFromQuery) {
      setSelectedUserId(userIdFromQuery);
    }
  }, [userIdFromQuery]);

  // 클릭한 유저의 핸들러
  const onClickHandler = (userId) => {
    setSelectedUserId(userId); // 클릭한 유저의 ID 저장
    setSelectedUserIndex(selectedUserIndex);
    router.push(`/chat?userId=${userId}`); // 해당 유저와의 채팅창으로 이동
  };

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: loggedInUser.id,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      const newStateObj = JSON.parse(JSON.stringify(newState));
      setPresence(newStateObj);
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      await channel.track({
        onLineAt: new Date().toISOString(),
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [loggedInUser.id]);

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {chatUsersError && (
        <div>채팅 사용자 정보를 불러오는 중 오류가 발생했습니다.</div>
      )}
      {filteredUsers.map((user) => (
        <Person
          key={user.id}
          isActive={selectedUserId === user.id}
          name={user.username || user.email.split("@")[0]}
          onChatScreen={false}
          onClick={() => onClickHandler(user.id)}
          onLineAt={presence?.[user.id]?.[0]?.onLineAt}
          profileImg={user.imgurl || "/images/defaultProfile.png"}
        />
      ))}
    </div>
  );
}
