import { getUserInfo } from "actions/userInfoAction";
import Header from "components/header";
import Mypage from "components/home";
import { createServerSupabaseClient } from "utils/supabase/server";

export const metadata = {
  title: "Instagram",
  description: "instagram clone",
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.email?.split("@")?.[0];

  const userInfo = await getUserInfo(user.id);

  console.log(".>", userInfo);

  return (
    <main className="w-full h-screen flex flex-col items-center">
      <Header userName={userName} profileImg={userInfo.imgurl} />
      {/* Welcome ! {session?.user?.email?.split("@")?.[0]} */}
      <Mypage userInfo={userInfo} />
    </main>
  );
}
