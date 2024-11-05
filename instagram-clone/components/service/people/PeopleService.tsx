"use client";

import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { presenceState, userState } from "utils/supabase/recoil/atoms";
import AllPeopleImpl from "../impl/AllPeopleImpl";
import { User } from "type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface PeopleItemProps {
  user: User | undefined;
  router: AppRouterInstance;
  presence: string | null;
  fetchAllPeopleList: (params: PeopleItemProps) => {
    filteredUsers: User[];
    onClickHandler: (userId: string) => void;
  };
}

export default function PeopleService() {
  const user = useRecoilValue(userState);
  const router = useRouter();
  const presence = useRecoilValue(presenceState);

  const fetchAllPeopleList = (param: PeopleItemProps) => AllPeopleImpl(param);

  return {
    user,
    router,
    presence,
    fetchAllPeopleList,
  };
}
