import { useSearchParams } from "next/navigation";
import { ChatItemProps } from "../chat/ChatService";
import { useRecoilState } from "recoil";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { selectedUserIndexState } from "utils/supabase/recoil/atoms";
import { useEffect } from "react";
import { Message, User } from "type";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "config/ReactQueryClientProvider";

// 로그인 한 유저와 채팅 기록이 있는 사람만 가져오기
async function getChatUsers(loggedInUserId: string) {
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

export default function ChatImpl(param: ChatItemProps) {
  const {
    router,
    user,
    presence,
    selectedUserId,
    setPresence,
    setSelectedUserId,
  } = param;
  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );

  const supabase = createBrowserSupabaseClient();
  const searchParams = useSearchParams();

  const { data: chatUsers = [], error: chatUsersError } = useQuery({
    queryKey: ["chatUsers", user?.id],
    queryFn: async () => await getChatUsers(user?.id),
    enabled: !!user?.id, // 로그인한 사용자 ID가 있을 때만 실행
  });

  const allUserData: User[] = queryClient.getQueryData(["users"]);

  // 쿼리 파라미터에서 userId 가져오기
  const userIdFromQuery = searchParams.get("userId");

  // 필터링된 유저목록
  const filteredUsers = allUserData?.filter((users) => {
    const isNotLoggedInUser = user?.id.toString() !== users?.id.toString();
    const isChattingUser = chatUsers.some(
      (chatUser: Message) =>
        (chatUser.receiver === users.id && chatUser.sender === user?.id) ||
        (chatUser.sender === users.id && chatUser.receiver === user?.id)
    );

    const isSelectedUser = user?.id.toString() === userIdFromQuery; // 쿼리 파라미터에서 가져온 유저 ID와 비교
    return isNotLoggedInUser && (isChattingUser || isSelectedUser); // 나와 채팅 기록이 있는 유저만 반환
  });

  useEffect(() => {
    if (userIdFromQuery) {
      setSelectedUserId(userIdFromQuery);
    }
  }, [userIdFromQuery]);

  // 클릭한 유저의 핸들러
  const onClickHandler = (userId: string) => {
    setSelectedUserId(userId); // 클릭한 유저의 ID 저장
    setSelectedUserIndex(selectedUserIndex);
    router.push(`/chat?userId=${userId}`); // 해당 유저와의 채팅창으로 이동
  };

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: user?.id,
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
  }, [user?.id]);

  return {
    chatUsersError,
    filteredUsers,
    selectedUserId,
    onClickHandler,
    presence,
  };
}
