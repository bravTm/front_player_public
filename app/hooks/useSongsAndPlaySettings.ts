import { SongsAndPlaySettingsContext } from "app/provider/SongsAndPlaySettingsProvider";
import { useContext } from "react";

export const useSongsAndPlaySettings = () => useContext(SongsAndPlaySettingsContext)