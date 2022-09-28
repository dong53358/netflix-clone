import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const mainMuteState = atom<boolean>({
  key: "mainmute",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const muteState = atom<boolean>({
  key: "mute",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const movieMainState = atom<string>({
  key: "movie",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
export const tvMainState = atom<string>({
  key: "tv",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
export const scrollState = atom<boolean>({
  key: "scroll",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
