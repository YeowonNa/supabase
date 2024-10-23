"use client";

import { getRandomImage } from "utils/supabase/randomImage";
import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo("ko-RK");

export default function Person({
  index,
  userId,
  name,
  onLineAt,
  onChatScreen = false,
  onClick = null,
  isActive = false,
}) {
  return (
    <div
      className={`flex w-full min-w-60 ${
        onClick && "cursor-pointer"
      } gap-4 items-center p-4 ${
        !onChatScreen && isActive && "bg-light-blue-50"
      } ${!onChatScreen && !isActive && "bg-gray-50"} ${
        onChatScreen && "bg-gray-50"
      }`}
      onClick={onClick}
    >
      <img
        src={getRandomImage(index)}
        alt={name}
        className="w-12 h-12 rounded-full"
      />

      <div>
        <p className="text-black font-bold text-lg">{name}</p>
        <p className="text-gray-500 text-sm">
          {timeAgo.format(Date.parse(onLineAt))}
        </p>
      </div>
    </div>
  );
}
