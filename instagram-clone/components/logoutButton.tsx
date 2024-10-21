"use client";

import { Button } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function LogoutButton() {
  const supabase = createBrowserSupabaseClient();
  const onClickHandle = async () => {
    supabase.auth.signOut();
  };

  return (
    <Button color="red" onClick={onClickHandle}>
      로그아웃
    </Button>
  );
}
