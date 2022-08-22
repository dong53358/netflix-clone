import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const muteState = atom<boolean>({
  key: "mute",
  default: true,
  effects_UNSTABLE: [persistAtom],
});
