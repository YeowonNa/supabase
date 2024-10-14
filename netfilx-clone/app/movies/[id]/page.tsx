import { getMovies } from "actions/movieActions";
import Ui from "./ui";

export async function generateMetadata({ params, searchParams }) {
  const movie = await getMovies(params.id);

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      images: [movie.image_url],
    },
  };
}

export default async function MovieDetail({ params }) {
  const movie = await getMovies(params.id);
  return (
    <main className="pt-16 flex items-center bg-gray-200 w-full absolute top-0 bottom-0 left-0 right-0">
      {movie ? <Ui movie={movie} /> : <div>Movie does no exists</div>}
    </main>
  );
}
