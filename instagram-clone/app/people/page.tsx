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
  console.log(">>>", user?.id);

  const onClickHandler = (userId) => {
    router.push(`/chat?userId=${userId}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2">
        {filteredUsers?.map((user, index) => (
          <div className="border border-solid border-gray-500 rounded-sm p-5">
            <Person
              key={user.id}
              isActive={false}
              name={user.username || user.email.split("@")[0]}
              onChatScreen={false}
              onClick={() => onClickHandler(user.id)}
              onLineAt={presence?.[user.id]?.[0]?.onLineAt}
              profileImg={user.imgurl || "/images/defaultProfile.png"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
