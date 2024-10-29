import ChatPeopleList from "components/chat/ChatPeopleList";
import ChatScreen from "components/chat/ChatScreen";
import { createServerSupabaseClient } from "utils/supabase/server";

export default async function ChatPate() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ChatPeopleList loggedInUser={user} />
      <ChatScreen />
    </div>
  );
}
