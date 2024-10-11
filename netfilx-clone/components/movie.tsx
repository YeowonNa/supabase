"use client";

import Link from "next/link";

export default function Movie({ movie }) {
  return (
    <div className="col-span-1 relative">
      <img src={movie.image_url} className="w-full" />

      {/* Title Dim */}
      <Link href={`/movies/${movie.id}`}>
        <div className="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300">
          <p className="font-bold text-white text-center">{movie.title}</p>
        </div>
      </Link>
    </div>
  );
}
