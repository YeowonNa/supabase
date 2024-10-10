"use client";

import Movie from "./movie";

export default function MovieList() {
  return (
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full cursor-pointer">
      <Movie />
      <Movie />
      <Movie />
      <Movie />
      <Movie />
      <Movie />
    </div>
  );
}
