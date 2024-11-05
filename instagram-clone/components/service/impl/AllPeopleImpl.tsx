import { useQuery } from "@tanstack/react-query";
import { getAllUserTable } from "actions/chatAction";
import { PeopleItemProps } from "../people/PeopleService";

export default function AllPeopleImpl(param: PeopleItemProps) {
  const { user, router } = param;

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

  return {
    filteredUsers,
    onClickHandler,
  };
}
