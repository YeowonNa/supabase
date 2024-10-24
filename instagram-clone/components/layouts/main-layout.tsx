import SiderBar from "components/sideBar";

export default async function MainLayout({ children }) {
  return (
    <>
      <main className="w-full h-screen flex items-center justify-center">
        <SiderBar />
        {children}
      </main>
    </>
  );
}
