"use client";

import { Home, Logout, People, Search, Send } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SiderBar() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const onClickHandle = async () => {
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="relative h-screen bg-white p-6 border-r border-gray-300 flex flex-col justify-between z-10">
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
        <button onClick={onClickHandle}>
          <Logout className="text-2xl text-deep-purple-900" />
        </button>
      </div>
    </aside>
  );
}
