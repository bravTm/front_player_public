import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaylist } from "app/types/playlists.types";
import { ISong } from "app/types/song.types";

interface IReduxPlaylists {
    songsToAdd: ISong[],
    playlists: IPlaylist[],
    activePlaylist: IPlaylist | null,
    isShuffle: boolean,
    orderToPlay: ISong[]
}

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState: { songsToAdd: [], playlists: [], activePlaylist: null, isShuffle: false, orderToPlay: [] } as IReduxPlaylists,
    reducers: {
        setPlaylists(state: IReduxPlaylists, action: PayloadAction<IPlaylist[]>) {
            state.playlists = action.payload
            return state
        },

        setSongsToAdd(state: IReduxPlaylists, action: PayloadAction<ISong[]>){
            state.songsToAdd = action.payload
            return state
        },

        setActivePlstAndIsShuffle(state: IReduxPlaylists, action: PayloadAction<{ activePlaylist: IPlaylist | null, isShuffle: boolean, orderToPlay: ISong[] }>) {
            state.activePlaylist = action.payload.activePlaylist
            state.isShuffle = action.payload.isShuffle
            state.orderToPlay = action.payload.orderToPlay
            return state
        }
    }
})


export const playlistsReducer = playlistsSlice.reducer