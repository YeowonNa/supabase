import { Metadata } from "next";
import Ui from "./ui";

export const metadata: Metadata = {
  title: "TMDBFLEX",
  description: "Netfilx clone useing TMDB API",
};

export default function Home() {
  return (
    <div className="w-full">
      <Ui />
    </div>
  );
}
