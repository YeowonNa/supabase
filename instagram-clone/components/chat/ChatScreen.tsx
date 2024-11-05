"use client";

import { Spinner } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";

import { formatDateTime } from "utils/formattedDateTime";
import { ChatItemProps } from "components/service/chat/ChatService";
import { KeyboardEvent } from "react";

export default function ChatScreen({ ...props }: ChatItemProps) {
  const { fetchChatScreen, presence, selectedUserId } = props;
  const {
    chatContainerRef,
    getAllMessagesQuery,
    handleClick,
    handleKeyDown,
    message,
    selectedUserQuery,
    sendMessageMutation,
    setMessage,
  } = fetchChatScreen(props);

  const data = selectedUserQuery.data;
  return data !== null ? (
    <div className="w-full h-full flex flex-col">
      {/* Active 유저 영역 */}
      <Person
        isActive={false}
        name={data?.username || data?.email?.split("@")?.[0]}
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
          onKeyDown={(e: KeyboardEvent) => handleKeyDown(e)}
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
