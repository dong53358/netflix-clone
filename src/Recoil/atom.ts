import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface IMovie {
  id: number;
}

export const movidIdState = atom<IMovie[]>({
  key: "localId",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
