import { atom } from "recoil";

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const selectedIndexState = atom({
  key: "selectedIndexState",
  default: null,
});

export const profileImgState = atom({
  key: "profileImgState",
  default: "/images/defaultProfile.png",
});
