import ChatPeopleList from "components/chat/ChatPeopleList";
import ChatScreen from "components/chat/ChatScreen";

export default function ChatPate() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ChatPeopleList />
      <ChatScreen />
    </div>
  );
}
