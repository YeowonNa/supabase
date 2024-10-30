"use client";

import { Button, Input } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { getUserInfo, getUserUpsert } from "actions/userInfoAction";
import { useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignUp({ setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const supabase = createBrowserSupabaseClient();

  // sign up mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_API_HOST}/signup/confirm`,
        },
      });

      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

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
        />
        <Button
          onClick={() => {
            signupMutation.mutate();
          }}
          loading={signupMutation.isPending}
          disabled={confirmationRequired}
          color="light-blue"
          className="w-full text-md py-1"
        >
          {confirmationRequired ? "메일함을 확인해 주세요." : "가입하기"}
        </Button>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        이미 계정이 있으신가요?
        <button
          className="text-light-blue-600 font-bold pl-1"
          onClick={() => setView("SIGNIN")}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
