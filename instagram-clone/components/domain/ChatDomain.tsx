"use client";

import ChatPeopleList from "components/chat/ChatPeopleList";
import ChatScreen from "components/chat/ChatScreen";
import ChatService from "components/service/chat/ChatService";

export default function ChatDomain() {
  const itemProps = ChatService();

  return (
    <>
      <ChatPeopleList {...itemProps} />
      <ChatScreen {...itemProps} />
    </>
  );
}
