import LogoutButton from "components/logoutButton";

export const metadata = {
  title: "Insta",
  description: "instagram clone",
};

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <h1 className="font-bold text-xl">Welcome {"username"}!</h1>
      <LogoutButton />
    </main>
  );
}
