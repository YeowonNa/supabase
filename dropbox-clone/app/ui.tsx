"use client";

import DropboxImageList from "components/dropbox-image-list";
import FileInput from "components/file-input";
import Logo from "components/logo";
import SearchComponent from "components/search-component";
import { useState } from "react";

export default function Ui() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <main className="w-full p-2 flex flex-col gap-4">
      {/* 로고영역 */}
      <Logo />

      {/* 검색창 */}
      <SearchComponent
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      {/* 파일 드래그 & 드롭 */}
      <FileInput />

      {/* 이미지 리스트 */}
      <DropboxImageList searchInput={searchInput} />
    </main>
  );
}
