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

  const isKakao = user?.app_metadata.provider === "kakao" ? true : false;
  // const userInfo = isKakao ? user : await getUserInfo(user?.id);

  return (
    <main className="w-full h-full flex flex-col items-center">
      <Mypage isKakao={isKakao} />
    </main>
  );
}
