"use client";

import { Spinner } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";
import { useRecoilValue } from "recoil";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import {
  presenceState,
  selectedUserIdState,
} from "utils/supabase/recoil/atoms";
import { formatDateTime } from "utils/formattedDateTime";
import { getUserInfo } from "actions/userInfoAction";

export async function sendMessage({ message, chatUserId }) {
  const supabase = createBrowserSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User is not authenticated");
  }

  const { data, error: sendMessageError } = await supabase
    .from("message")
    .insert({
      message,
      receiver: chatUserId,
      sender: user.id,
    });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }

  return data;
}

export async function getAllMessages({ chatUserId }) {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error("User is not authenticated");
  }

  const { data, error: getMessagesError } = await supabase
    .from("message")
    .select("*")
    .or(`receiver.eq.${chatUserId},receiver.eq.${session.user.id}`)
    .or(`sender.eq.${chatUserId},sender.eq.${session.user.id}`)
    .order("created_at", { ascending: true });

  if (getMessagesError) {
    console.log(getMessagesError);
  }

  return data;
}

export default function ChatScreen({}) {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();
  const presence = useRecoilValue(presenceState);
  const chatContainerRef = useRef(null);

  let lastOnLineAt = null; // 마지막 onLineAt을 저장할 변수
  let lastIsFromMe = null; // 마지막 isFromMe 상태를 저장할 변수

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: async () => {
      if (selectedUserId) {
        return await getUserInfo(selectedUserId);
      }
      return null;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({
        message,
        chatUserId: selectedUserId,
      });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () =>
      selectedUserId !== null && getAllMessages({ chatUserId: selectedUserId }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && !payload.errors) {
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [getAllMessagesQuery.data]);

  const handleClick = () => {
    if (message.trim() !== "") {
      sendMessageMutation.mutate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const data = selectedUserQuery.data;
  return data !== null ? (
    <div className="w-full h-full flex flex-col">
      {/* Active 유저 영역 */}
      <Person
        isActive={false}
        name={data?.username ? data.username : data?.email?.split("@")?.[0]}
        onChatScreen={true}
        onLineAt={presence?.[selectedUserId]?.[0]?.onLineAt}
        profileImg={data?.imgurl ? data.imgurl : "/images/defaultProfile.png"}
      />

      {/* 채팅 영역 */}
      <div
        className="w-full overflow-y-scroll flex-1 flex flex-col p-4 gap-4"
        ref={chatContainerRef}
      >
        {getAllMessagesQuery.data?.length === 0 && (
          <div className="flex items-center justify-center text-sm text-gray-400">
            채팅을 시작해주세요.
          </div>
        )}
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId}
            onLineAt={formatDateTime(message.created_at)}
          />
        ))}
      </div>

      {/* 채팅창 영역 */}
      <div className="flex pb-14 px-5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="py-2 px-3 w-full bg-gray-200 rounded-lg border border-solid border-transparent focus:border-gray-600 shadow-lg text-sm"
          placeholder="메시지를 입력하세요."
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <button
          onClick={handleClick}
          className="min-w-max py-2 px-4 ml-2 flex-grow-0 rounded-lg bg-light-blue-600 text-white shadow-lg hover:bg-light-blue-800 transition-all"
        >
          {sendMessageMutation.isPending ? (
            <Spinner />
          ) : (
            <span className="inline-block text-sm ">전송</span>
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full flex items-center justify-center text-sm text-gray-400">
      대화방을 선택해주세요.
    </div>
  );
}
