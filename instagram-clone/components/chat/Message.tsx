"use client";

export default function Message({ isFromMe, message }) {
  return (
    <div
      className={`w-fit p-2 rounded-md text-sm ${
        isFromMe
          ? "ml-auto bg-light-blue-600 text-white"
          : "bg-gray-200 text-black"
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
