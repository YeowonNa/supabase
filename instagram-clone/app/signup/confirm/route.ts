import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";
import { getUserUpsert } from "actions/userInfoAction";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // "code" 파라미터가 존재하는 경우
  if (code) {
    const supabase = await createServerSupabaseClient();

    // 인증 코드로 세션을 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 세션이 설정되었으므로, 사용자 정보를 가져옴
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (user) {
        // 사용자 정보 업데이트
        const imgurl = user.user_metadata?.avatar_url || null;
        const username =
          user.user_metadata?.full_name || user.email.split("@")[0];

        // userProfile 테이블에 유저 정보 삽입
        await getUserUpsert(user, imgurl, username);
      }
    }
  }

  // 기본적으로 원래의 URL로 리다이렉트
  return NextResponse.redirect(requestUrl.origin);
}
