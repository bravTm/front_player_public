import { useTypedSelector } from "./useTypedSelector";

export const usePlaySettings = () => useTypedSelector((state) => state.playSettings)