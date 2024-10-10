import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TMDBFLEX",
  description: "Netfilx clone useing TMDB API",
};

export default function Home() {
  return <main className="w-full p-2">netfilx</main>;
}
