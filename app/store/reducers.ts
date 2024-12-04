import { audioPlayReducer } from "./audioPlay/audioPlay.slice";
import { playbackReducer } from "./playback/playback.slice";
import { playlistsReducer } from "./playlists/playlists.slice";
import { playSettingsReducer } from "./playSettings/play-settings.slice";
import { songsReducer } from "./songs/songs.slice";

export const reducers = {
    songs: songsReducer,
    audioPlay: audioPlayReducer,
    playback: playbackReducer,
    playlists: playlistsReducer,
    playSettings: playSettingsReducer
}