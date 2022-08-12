import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const IdState = atom<string>({
  key: "localMovieId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
