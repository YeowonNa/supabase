import Ui from "./ui";

export default function MovieDetail({ params }) {
  return (
    <main className="pt-16 flex items-center bg-gray-200 w-full absolute top-0 bottom-0 left-0 right-0">
      <Ui id={params.id} />
    </main>
  );
}
