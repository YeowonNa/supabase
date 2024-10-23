"use client";

import Person from "./Person";
import { useRecoilState } from "recoil";
import { selectedIndexState } from "utils/supabase/recoil/atoms";

export default function ChatPeopleList() {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState);
  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      <Person
        index={0}
        isActive={selectedIndex === 0}
        name={"dsds"}
        onChatScreen={false}
        onClick={() => setSelectedIndex(0)}
        onLineAt={new Date().toISOString()}
        userId={"dsdas"}
      />
      <Person
        index={1}
        isActive={selectedIndex === 1}
        name={"dsds"}
        onChatScreen={false}
        onClick={() => setSelectedIndex(1)}
        onLineAt={new Date().toISOString()}
        userId={"dsdas"}
      />
    </div>
  );
}
