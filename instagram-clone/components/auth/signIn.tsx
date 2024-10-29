import { Button, Input } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { getUserInfo, getUserUpsert } from "actions/userInfoAction";
import { useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignIn({ setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createBrowserSupabaseClient();

  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
          : "http://localhost:3000/auth/callback",
      },
    });
    if (error) {
      alert(error);
      return;
    }
  };

  const signInMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error);
        return;
      }

      if (data) {
        const { user } = data;

        // // 현재 유저의 정보를 가져오기 위해 getUserInfo 호출
        // const currentUserInfo = await getUserInfo(user.id);
        // console.log("user", user);

        // const imgurl = currentUserInfo?.imgurl || null;
        // await getUserUpsert(user, imgurl, currentUserInfo.username);
      }
    },
  });

  const handleClick = () => {
    signInMutation.mutate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
        <img src={`/images/inflearngram.png`} className="w-60 mb-6" />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="email"
          type="email"
          className="2-full rounded-sm"
        />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="password"
          type="password"
          className="2-full rounded-sm"
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <Button
          onClick={handleClick}
          loading={signInMutation.isPending}
          disabled={signInMutation.isPending}
          color="light-blue"
          className="w-full text-md py-1 rounded-md"
        >
          로그인
        </Button>

        <div onClick={() => signInWithKakao()} className="cursor-pointer">
          <img
            src={`/images/kakao_login_medium_wide.png`}
            className="w-full h-9"
          />
        </div>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        아직 계정이 없으신가요?
        <button
          className="text-light-blue-600 font-bold pl-1"
          onClick={() => setView("SIGNUP")}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
