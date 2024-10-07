'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type TodoRow = Database['public']['Tables']['todo']['Row'];
export type TodoRowInsert = Database['public']['Tables']['todo']['Insert'];
export type TodoRowUpdate = Database['public']['Tables']['todo']['Update'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

/**
 * @param searchInput
 * @desc Todo 데이터를 가져오는 함수
 */
export async function getTodos({ searchInput = '' }): Promise<TodoRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .like('title', `%${searchInput}%`)
    .order('created_at', { ascending: true });

  if (error) {
    handleError(error);
  }

  return data;
}

/**
 * @param todo
 * @desc Todo 데이터를 생성하는 함수
 */
export async function createTodo(todo: TodoRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('todo').insert({
    ...todo,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }

  return data;
}

/**
 * @param todo
 * @desc Todo 데이터를 업데이트 하는 함수
 */
export async function updateTodo(todo: TodoRowUpdate) {
  const supabase = await createServerSupabaseClient();
  console.log(todo);

  const { data, error } = await supabase
    .from('todo')
    .update({
      ...todo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', todo.id); // 업데이트 대상

  if (error) {
    handleError(error);
  }

  return data;
}

/**
 * @param id
 * @desc Todo 데이터를 삭제하는 하는 함수
 */
export async function deleteTodo(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('todo').delete().eq('id', id);

  if (error) {
    handleError(error);
  }

  return data;
}
