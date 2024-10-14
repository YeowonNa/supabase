"use client";

export default function Ui({ movie }) {
  return (
    <div className="flex flex-col md:flex-row items-center max-w-full">
      <img src={movie.image_url} alt="movie Image" className="w-1/3" />
      <div className="w-full md:w-2/3 items-center md:items-start flex flex-col p-6 gap-4">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="text-lg font-medium">{movie.overview}</p>
        <div className="font-bold text-lg">
          <i className="fas fa-star mr-1 text" />
          Vote Average: {movie.vote_average}
        </div>
        <div className="font-bold text-lg">Popularity: {movie.popularity}</div>
        <div className="font-bold text-lg">
          Release Date: {movie.release_date}
        </div>
      </div>
    </div>
  );
}
