"use server";

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "utils/supabase/server";

/**
 * @desc 전체 유저 테이블 데이터를 가져오는 함수
 */
export async function getAllUserTable() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("userProfile").select("*");

  if (error) {
    console.log(error);
    return;
  }
  return data;
}

export async function getAllUsers() {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return [];
  }

  return data.users;
}

export async function getUserById(userId) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  return data.user;
}
