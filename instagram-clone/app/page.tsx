import { getUserInfo } from "actions/userInfoAction";
import Header from "components/header";
import Mypage from "components/mypage";
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

  const email = user?.email?.split("@")?.[0];
  const kakao = user?.user_metadata.full_name;
  const isKakao = user?.app_metadata.provider === "kakao" ? true : false;
  const userName = isKakao ? kakao : email;

  const userInfo = isKakao ? user : await getUserInfo(user.id);

  return (
    <main className="w-full h-screen flex flex-col items-center">
      <Header userName={userName} isKakao={isKakao} />
      <Mypage userInfo={userInfo} isKakao={isKakao} />
    </main>
  );
}
