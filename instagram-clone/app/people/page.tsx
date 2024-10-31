"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUserTable } from "actions/chatAction";
import Person from "components/chat/Person";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { presenceState, userState } from "utils/supabase/recoil/atoms";

export default function PeoplePage() {
  const user = useRecoilValue(userState);
  const presence = useRecoilValue(presenceState);
  const router = useRouter();

  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUserTable();

      return allUsers;
    },
    enabled: !!user, // user가 존재할때만 쿼리 실행
  });

  const filteredUsers = getAllUsersQuery.data?.filter(
    (data) => data.id.toString() !== user?.id.toString()
  );

  const onClickHandler = (userId: string) => {
    router.push(`/chat?userId=${userId}`);
  };

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
