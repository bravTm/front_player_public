import { PlaylistsContext } from "app/provider/PlaylistsProvider";
import { useContext } from "react";

export const usePlaylists = () => useContext(PlaylistsContext)