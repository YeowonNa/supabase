import { atom } from "recoil";
import { UserProfile } from "type/userInfo";

export const selectedUserIdState = atom({
  key: "selectedUserIdState",
  default: null,
});

export const profileImgState = atom({
  key: "profileImgState",
  default: "/images/defaultProfile.png",
});

export const selectedUserIndexState = atom({
  key: "selectedUserIndexState",
  default: 0,
});

export const presenceState = atom({
  key: "presenceState",
  default: null,
});

export const userState = atom<UserProfile | undefined>({
  key: "userState",
  default: undefined,
});
