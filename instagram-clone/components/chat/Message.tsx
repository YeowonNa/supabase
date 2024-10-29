"use client";

export default function Message({ isFromMe, message, onLineAt }) {
  return (
    <div>
      <div
        className={`w-fit p-2 rounded-md text-sm ${
          isFromMe
            ? "ml-auto bg-light-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <p>{message}</p>
      </div>
      <p
        className={`w-fit rounded-md text-xs text-gray-400 pt-1 ${
          isFromMe && "ml-auto"
        }`}
      >
        {onLineAt}
      </p>
    </div>
  );
}
