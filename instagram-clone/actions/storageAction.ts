"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}
/**
 * @param formData
 * @desc 파일 upload 함수
 */
export async function upLoadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const files = Array.from(formData.entries()).map(
    ([name, file]) => file as File
  );

  const results = await Promise.all(
    files.map((file) =>
      supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
        .upload(file.name, file, { upsert: true })
    )
  );

  return results;
}

/**
 * @param formData
 * @desc userProfile 테이블에 imgurl 업데이트
 */
export async function uploadToTable(url: string, userId: string) {
  const supabase = await createServerSupabaseClient();
  const { error: updateError } = await supabase
    .from("userProfile")
    .update({ imgurl: url }) // imgurl 필드에 URL 저장
    .eq("id", userId); // 현재 로그인된 유저의 id로 업데이트

  if (updateError) {
    alert("Error updating user profile: " + updateError.message);
  } else {
    alert("Profile updated successfully with new image URL!");
  }
}

/**
 * @param formData
 * @desc 파일 search 함수
 */
export async function searchFiles(search: string = "") {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .list(null, {
      search,
    });

  handleError(error);

  return data;
}

/**
 * @param formData
 * @desc 파일 delete 함수
 */
export async function deleteFiles(fileName: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove([fileName]);

  handleError(error);
  return data;
}
