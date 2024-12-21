import { PlaybackAndAudioPlayContext } from "app/provider/PlaybackAndAudioPlayProvider";
import { useContext } from "react";

export const usePlaybackAndAudioPlay = () => useContext(PlaybackAndAudioPlayContext)