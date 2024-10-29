import { getUserInfo, getUserUpsert } from "actions/userInfoAction";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  console.log("code", code);

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 세션이 성공적으로 교환되면 유저 정보 가져오기
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (user) {
        //userProfile 테이블에 유저 정보 업데이트
        const currentUserInfo = await getUserInfo(user.id);
        const imgurl =
          user.user_metadata?.avatar_url || currentUserInfo?.imgurl || null;
        const username =
          user.user_metadata?.full_name || user.email.split("@")[0];
        await getUserUpsert(user, imgurl, username);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
