"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useSetRecoilState } from "recoil";
import { userState } from "utils/supabase/recoil/atoms";
import { getUserInfo } from "actions/userInfoAction";

export default function AuthProvider({ accessToken, children }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    // Local Storage에서 사용자 정보 가져오기
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user)); // Local Storage에서 사용자 정보 설정
    }

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }

      // 로그인 시 사용자 정보 설정
      if (session) {
        const { user } = session;
        localStorage.setItem("user", JSON.stringify(user)); // Local Storage에 사용자 정보 저장

        // userProfile 테이블에서 최신 사용자 정보 가져오기
        const userProfileData = await getUserInfo(user.id);
        setUser(userProfileData || user);
      } else {
        localStorage.removeItem("user"); // 로그아웃 시 Local Storage에서 사용자 정보 제거
        setUser(null);
      }

      // 액세스 토큰이 변경되었을 때 페이지 새로고침
      if (session?.access_token) {
        router.refresh();
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [accessToken, supabase, router, setUser]);

  return children;
}
