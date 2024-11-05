"use client";

import Person from "components/chat/Person";
import { PeopleItemProps } from "components/service/people/PeopleService";

export default function AllPeopleList({ ...props }: PeopleItemProps) {
  const { fetchAllPeopleList, presence } = props;
  const { filteredUsers, onClickHandler } = fetchAllPeopleList(props);

  return (
    <div className="w-full h-full flex flex-col px-4 py-2">
      <div className="mb-7 text-center">
        <h2 className="text-md font-semibold">전체 유저 목록</h2>
        <p className="text-gray-500 text-sm">
          아래 목록에서 사용자를 선택해 대화할 수 있습니다.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {filteredUsers?.map((user, index) => (
          <div
            key={user.id}
            className="border border-solid border-gray-500 rounded-xl overflow-hidden p-2 shadow-lg"
          >
            <Person
              isActive={false}
              name={user.username || user.email.split("@")[0]}
              onChatScreen={false}
              onLineAt={presence?.[user.id]?.[0]?.onLineAt}
              profileImg={user.imgurl || "/images/defaultProfile.png"}
              isList={true}
              statusMsg={user?.statemessage}
            />
            <button
              className="w-full py-2 bg-blue-gray-700 text-white rounded-lg mt-3 text-sm focus:outline-none shadow-md hover:bg-blue-gray-600 hover:text-blue-gray-800 transition-all ease-out font-semibold"
              onClick={() => onClickHandler(user.id)}
            >
              채팅하기 &gt;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
