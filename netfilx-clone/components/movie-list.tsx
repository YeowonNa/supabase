"use client";

import { useQuery } from "@tanstack/react-query";
import Movie from "./movie";
import { searchMovies } from "actions/movieActions";
import { Spinner } from "@material-tailwind/react";
import { useRecoilValue } from "recoil";
import { searchState } from "utils/supabase/recoil/atoms";

export default function MovieList() {
  const search = useRecoilValue(searchState);

  const getAllMovieQuery = useQuery({
    queryKey: ["movie", search],
    queryFn: () => searchMovies(search),
  });

  return (
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full cursor-pointer">
      {getAllMovieQuery.isLoading && <Spinner />}
      {getAllMovieQuery.data &&
        getAllMovieQuery.data.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
    </div>
  );
}
