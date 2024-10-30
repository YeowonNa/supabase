"use client";

import { AccountCircle } from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import { userState } from "utils/supabase/recoil/atoms";

export default function Header({ isKakao }) {
  const user = useRecoilValue(userState);
  const email = user?.email?.split("@")?.[0];
  const kakao = user?.email?.includes("@kakao");
  const profileImg = user?.imgurl;
  const userName = isKakao ? kakao : user?.username || email;

  return (
    <header className="w-full bg-white border-b border-solid border-gray-100 justify-start p-4">
      <div className="flex items-center justify-end gap-1 pr-4">
        {isKakao ? (
          profileImg ? (
            <img src={profileImg} className="w-10 h-10 rounded-full" />
          ) : (
            <AccountCircle className="text-gray-200 w-10 h-10" />
          )
        ) : profileImg ? (
          <img src={profileImg} className="w-10 h-10 rounded-full" />
        ) : (
          <AccountCircle className="text-gray-200 w-10 h-10" />
        )}
        <strong className="font-bold text-lg">{userName}</strong>님
      </div>
    </header>
  );
}
