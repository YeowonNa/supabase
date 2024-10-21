import LogoutButton from "components/logoutButton";
import { createServerSupabaseClient } from "utils/supabase/server";

export const metadata = {
  title: "Instagram",
  description: "instagram clone",
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <h1 className="font-bold text-xl">
        Welcome ! {session?.user?.email?.split("@")?.[0]}
      </h1>
      <LogoutButton />
    </main>
  );
}
