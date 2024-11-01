import { atom, selector } from "recoil";

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

export const userState = atom({
  key: "userState",
  default: null,
});

export const userStateWithLocalStorage = selector({
  key: "userStateWithLocalStorage",
  get: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
});
