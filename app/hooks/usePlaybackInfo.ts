import { useTypedSelector } from "./useTypedSelector";

export const usePlaybackInfo = () => useTypedSelector((state) => state.playback)