"use client";

import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo("ko-KR");

interface Props {
  name: string;
  onLineAt: string;
  isActive: boolean;
  onChatScreen: boolean;
  onClick?: () => void;
  profileImg?: string;
}
export default function Person({
  name,
  onLineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
  profileImg,
}: Props) {
  return (
    <div
      className={`flex w-full min-w-60  ${
        onClick && "cursor-pointer"
      } gap-4 items-center p-4 ${
        !onChatScreen && isActive && "bg-light-blue-50"
      } ${!onChatScreen && !isActive && "bg-gray-50"} ${
        onChatScreen && "bg-gray-50"
      }`}
      onClick={onClick}
    >
      <img src={profileImg} alt={name} className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-black font-bold text-lg">{name}</p>
        <p className="text-gray-500 text-sm">
          {onLineAt && timeAgo.format(Date.parse(onLineAt))}
        </p>
      </div>
    </div>
  );
}
