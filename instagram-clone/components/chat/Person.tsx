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
  isList?: boolean;
  statusMsg?: string;
}
export default function Person({
  name,
  onLineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
  profileImg,
  isList,
  statusMsg,
}: Props) {
  return (
    <div
      className={`flex w-full ${
        onClick && "cursor-pointer"
      } gap-2 items-center ${!onChatScreen && isActive && "bg-light-blue-50"} ${
        !onChatScreen && !isActive && !isList && "bg-gray-50"
      }
       ${onChatScreen ? "bg-gray-50" : ""} ${
        isList ? "flex-col" : "flex-row p-3"
      }`}
      onClick={onClick}
    >
      <img
        src={profileImg}
        alt={name}
        className={`rounded-full object-cover ${
          isList ? "w-16 h-16" : "w-10 h-10"
        }`}
      />
      <div className="flex flex-col items-center justify-center h-12">
        <p className="text-black font-bold text-lg">{name}</p>
        {isList && statusMsg ? (
          <p className="text-gray-500 text-xs mt-1 h-8 text-center">
            {statusMsg}
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            {onLineAt && timeAgo.format(Date.parse(onLineAt))}
          </p>
        )}
      </div>
    </div>
  );
}
