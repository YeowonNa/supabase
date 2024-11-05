import { createBrowserSupabaseClient } from "utils/supabase/client";
import { ChatItemProps } from "../chat/ChatService";
import {
  EventHandler,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export default function ChatScreenImpl(param: ChatItemProps) {
  const { selectedUserId } = param;

  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return {
    selectedUserQuery,
    chatContainerRef,
    getAllMessagesQuery,
    message,
    setMessage,
    handleClick,
    sendMessageMutation,
    handleKeyDown,
  };
}
