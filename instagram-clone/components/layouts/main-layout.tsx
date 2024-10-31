import Footer from "components/footer";
import Header from "components/header";
import SiderBar from "components/sideBar";

export default async function MainLayout({ children, userInfo }) {
  const isKakao = userInfo?.app_metadata.provider === "kakao" ? true : false;
  return (
    <>
      <div className="w-full flex h-screen">
        <SiderBar />
        <div className="flex flex-col flex-1">
          <Header userInfo={userInfo} isKakao={isKakao} />
          <main className="flex-1 w-full h-full">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
