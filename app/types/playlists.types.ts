import { ISong } from "./song.types";

export interface IPlaylist {
    date: Date,
    title: string,
    playlistDuration: number,
    songs: ISong[],
    image: string
}