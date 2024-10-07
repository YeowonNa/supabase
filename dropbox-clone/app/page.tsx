import { Metadata } from "next";
import Ui from "./ui";

export const metadata: Metadata = {
  title: "Minibox",
  description: "Dropbox clone",
};

export default function Home() {
  return (
    <main className="w-full p-2">
      <Ui />
    </main>
  );
}
