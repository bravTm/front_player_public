import { audioPlay } from "./audioPlay/audioPlay.slice";
import { playbackSlice } from "./playback/playback.slice";
import { playlistsSlice } from "./playlists/playlists.slice";
import { playSettingsSlice } from "./playSettings/play-settings.slice";
import { songsSlice } from "./songs/songs.slice";

export const allActions = {
    ...songsSlice.actions,
    ...audioPlay.actions,
    ...playbackSlice.actions,
    ...playlistsSlice.actions,
    ...playSettingsSlice.actions
}