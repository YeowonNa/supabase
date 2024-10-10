"use client";

import Link from "next/link";

export default function Movie() {
  return (
    <div className="col-span-1 relative">
      <img
        src="https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
        className="w-full"
      />

      {/* Title Dim */}
      <Link href={"/movies/1"}>
        <div className="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300">
          <p className="font-bold text-white">Kung Fu Panda 4</p>
        </div>
      </Link>
    </div>
  );
}
