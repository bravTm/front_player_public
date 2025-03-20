import { useContext } from "react";
import { TopSongsContext } from "app/provider/TopSongsProvider";

export const useTopSongs = () => useContext(TopSongsContext)