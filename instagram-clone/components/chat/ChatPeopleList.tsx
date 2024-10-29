"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import { useRecoilState } from "recoil";
import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/supabase/recoil/atoms";
import { getAllUserTable } from "actions/chatAction";

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );

  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUserTable();

      return allUsers.filter(
        (user) => user.id.toString() !== loggedInUser.id.toString()
      );
    },
  });

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
        <Person
          key={user.id}
          index={index}
          isActive={selectedUserId === user.id}
          name={user.username ? user.username : user.email.split("@")[0]}
          onChatScreen={false}
          onClick={() => {
            setSelectedUserId(user.id);
            setSelectedUserIndex(selectedUserIndex);
          }}
          onLineAt={new Date().toISOString()}
          profileImg={user.imgurl ? user.imgurl : "/images/defaultProfile.png"}
        />
      ))}
    </div>
  );
}
