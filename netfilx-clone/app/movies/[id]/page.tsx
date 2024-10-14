import { getMovies } from "actions/movieActions";
import Ui from "./ui";

export default async function MovieDetail({ params }) {
  const movie = await getMovies(params.id);
  return (
    <main className="pt-16 flex items-center bg-gray-200 w-full absolute top-0 bottom-0 left-0 right-0">
      {movie ? <Ui movie={movie} /> : <div>Movie does no exists</div>}
    </main>
  );
}
