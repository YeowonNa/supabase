"use client";

import Person from "./Person";

import { ChatItemProps } from "components/service/chat/ChatService";

export default function ChatPeopleList({ ...props }: ChatItemProps) {
  const { fetchChatList, selectedUserId, presence } = props;
  const { chatUsersError, filteredUsers, onClickHandler } =
    fetchChatList(props);

  return (
    <div className="min-w-60 flex flex-col bg-gray-50 border-r border-solid">
      {chatUsersError && (
        <div>채팅 사용자 정보를 불러오는 중 오류가 발생했습니다.</div>
      )}
      {filteredUsers &&
        filteredUsers.map((user) => (
          <Person
            key={user.id}
            isActive={selectedUserId === user.id}
            name={user?.username || user?.email.split("@")[0]}
            onChatScreen={false}
            onClick={() => onClickHandler(user.id)}
            onLineAt={presence?.[user.id]?.[0]?.onLineAt}
            profileImg={user.imgurl || "/images/defaultProfile.png"}
          />
        ))}
    </div>
  );
}
