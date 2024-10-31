"use client";

import { useRecoilValue } from "recoil";
import { userState } from "utils/supabase/recoil/atoms";

export default function Header({ isKakao, userInfo }) {
  const user = useRecoilValue(userState);
  const email = user?.email?.split("@")?.[0];
  const kakaoImg = isKakao && userInfo?.user_metadata?.avatar_url;
  const profileImg = user?.imgurl || kakaoImg || "/images/defaultProfile.png";
  const userName = isKakao
    ? userInfo?.user_metadata?.full_name
    : user?.username || email;

  return (
    <header
      // className="w-full bg-white border-b border-solid border-gray-100 justify-start p-4"
      className="pl-[72px] w-full flex-wrap bg-white z-0 border border-t-gray-300 justify-start p-3"
    >
      <div className="flex items-center justify-end gap-1 pr-4">
        <img src={profileImg} className="w-10 h-10 rounded-full object-cover" />
        <strong className="font-bold text-lg">{userName}</strong>님
      </div>
    </header>
  );
}
