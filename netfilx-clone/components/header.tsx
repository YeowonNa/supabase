"use client";

import { useRecoilState } from "recoil";
import Logo from "./logo";
import { searchState } from "utils/supabase/recoil/atoms";
import { useState } from "react";

export default function Header() {
  const [, setSearch] = useRecoilState(searchState);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchClick = () => {
    setSearch(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 px-4 py-2 bg-gray-900 flex items-center justify-between z-50">
      <nav className="flex gap-4">
        <Logo />
        <ul className="flex gap-2 text-white">
          <li>Movies</li>
          <li>Drama</li>
        </ul>
      </nav>

      <div className="flex w-full max-w-72 gap-2 items-center border border-white text-white bg-transparent rounded-md p-2">
        <i className="fas fa-search" onClick={handleSearchClick} />
        <input
          className="bg-transparent"
          placeholder="Search Movies"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </header>
  );
}
