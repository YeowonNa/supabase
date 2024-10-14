"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @returns data
 * @desc 전체 영화 목록을 가져오는 함수
 */
export async function getAllMovies() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("movie").select("*");

  handleError(error);

  return data;
}

/**
 * @returns data
 * @desc 영화 검색 함수
 */
export async function searchMovies(search = "") {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .like("title", `%${search}%`);

  handleError(error);

  return data;
}

/**
 * @returns data
 * @desc id를 받아서 영화를 가져오는 함수
 */
export async function getMovies(id) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}
