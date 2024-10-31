import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 이메일 로그인 시 유저테이블에 유저정보 업데이트
export async function getUserUpsert(user, imgurl, username) {
  console.log("Updating user profile:", user); // 로그 추가
  const { error: insertError } = await supabase.from("userProfile").upsert({
    id: user.id, // 유저의 고유 id를 사용
    email: user.email, // 유저의 이메일
    username: user.user_metadata.full_name || username, // full_name은 선택 사항
    imgurl: imgurl || null, // avatar_url은 선택 사항
  });

  if (insertError) {
    console.error("Error updating user profile:", insertError.message);
    alert(insertError.message); // 삽입 중 에러 발생 시 출력
  } else {
    console.log("User profile updated successfully!", user);
  }
}

// 유저프로필 데이터 가져오기
export async function getUserInfo(id: string) {
  const { data, error } = await supabase
    .from("userProfile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.log("error > ", error);
  }

  return data;
}

/**
 * @param formData
 * @desc userProfile 테이블에 imgurl 업데이트
 */
export async function updateUserProfile(user) {
  try {
    const { error: updateError } = await supabase
      .from("userProfile")
      .update({ ...user, created_at: new Date().toISOString() }) // imgurl 필드에 URL 저장
      .eq("id", user.id); // 현재 로그인된 유저의 id로 업데이트

    if (updateError) {
      console.error("Error updating user profile:", updateError.message);
      throw new Error("Failed to update user profile.");
    }

    console.log("Profile updated successfully with new image URL!");
  } catch (err) {
    console.error(
      "An unexpected error occurred during profile update:",
      err.message
    );
    throw err; // 클라이언트로 에러 전달
  }
}
