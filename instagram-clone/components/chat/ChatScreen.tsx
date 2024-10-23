"use client";

import { useRecoilValue } from "recoil";
import Message from "./Message";
import Person from "./Person";
import { selectedIndexState } from "utils/supabase/recoil/atoms";

export default function ChatScreen() {
  const selectedIndex = useRecoilValue(selectedIndexState);

  return selectedIndex !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* Active user area */}
      <Person
        index={selectedIndex}
        isActive={false}
        name={"dsds"}
        onChatScreen={true}
        onClick={false}
        onLineAt={new Date().toISOString()}
        userId={"dsdas"}
      />

      {/* 채팅 영역 */}
      <div className="w-full flex-1 flex flex-col p-4 gap-3">
        <Message isFromMe={true} message={"안녕하세용"} />
        <Message isFromMe={false} message={"하이하이용"} />
      </div>

      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          className="p-3 w-full border-2 border-light-blue-600 rounded-md"
          placeholder="메시지를 입력해주세요."
        />
        <button className="min-w-20 p-1 rounded-md bg-light-blue-600 text-white">
          <span>전송</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full text-center text-gray-500">
      대화하실 상대를 선택해주세요.
    </div>
  );
}
