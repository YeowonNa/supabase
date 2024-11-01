"use client";

import { RecoilRoot } from "recoil";
import { userState } from "utils/supabase/recoil/atoms";

export default function RecoilProvider({ children, initialUserInfo }) {
  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set(userState, initialUserInfo); // 초기화 상태 설정
      }}
    >
      {children}
    </RecoilRoot>
  );
}
