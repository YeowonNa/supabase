"use client";

import { Home, Logout, People, Search, Send } from "@mui/icons-material";
import Link from "next/link";

export default function SiderBar() {
  return (
    <aside className="h-screen p-6 border-r border-gray-300 flex flex-col justify-between">
      {/* home button + perple page ~ chat page */}
      <div className="flex flex-col gap-4">
        <Link href="/">
          <Home className="text-2xl mb-10" />
        </Link>
        <Link href="/people">
          <People className="text-2xl" />
        </Link>
        <Link href="/discover">
          <Search className="text-2xl" />
        </Link>
        <Link href="/chat">
          <Send className="text-2xl" />
        </Link>
      </div>

      {/* logout button */}
      <div>
        <button onClick={() => console.log("로그아웃")}>
          <Logout className="text-2xl text-deep-purple-900" />
        </button>
      </div>
    </aside>
  );
}
