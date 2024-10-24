import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 이메일 로그인 시 유저테이블에 유저정보 업데이트
export async function getUserUpsert(user) {
  const { error: insertError } = await supabase.from("userProfile").upsert({
    id: user.id, // 유저의 고유 id를 사용
    email: user.email, // 유저의 이메일
    username: user.user_metadata.full_name || null, // full_name은 선택 사항
    imgurl: user.user_metadata.avatar_url || null, // avatar_url은 선택 사항
  });

  if (insertError) {
    alert(insertError.message); // 삽입 중 에러 발생 시 출력
  } else {
    console.log("User profile updated successfully!", user);
  }
}

// 유저프로필 데이터 가져오기
export async function getUserInfo(id) {
  const { data, error } = await supabase
    .from("userProfile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  return data;
}
