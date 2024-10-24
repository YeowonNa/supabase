"use client";

import { AccountCircle } from "@mui/icons-material";

export default function Header({ userName, profileImg }) {
  return (
    <header className="w-full bg-white border-b border-solid border-gray-100 justify-start p-4">
      <div className="flex items-center justify-end gap-1 pr-4">
        {profileImg ? (
          <img src={profileImg} className="w-10 h-10 rounded-full" />
        ) : (
          <AccountCircle />
        )}
        <strong className="font-bold text-lg">{userName}</strong>님
      </div>
    </header>
  );
}
