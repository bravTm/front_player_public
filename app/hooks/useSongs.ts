import { useTypedSelector } from "./useTypedSelector";

export const useSongs = () => useTypedSelector((state) => state.songs)