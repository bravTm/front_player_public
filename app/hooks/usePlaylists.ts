import { useTypedSelector } from "./useTypedSelector";

export const usePlaylists = () => useTypedSelector((state) => state.playlists)