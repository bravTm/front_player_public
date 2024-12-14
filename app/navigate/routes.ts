import AddSongsToPlaylist from "app/components/screen/AddSongsToPlaylist/AddSongsToPlaylist";
import KaraokeLyrics from "app/components/screen/KaraokeLyrics/KaraokeLyrics";
import Main from "app/components/screen/Main/Main";
import Player from "app/components/screen/Player/Player";
import Playlists from "app/components/screen/Playlists/Playlists";
import Settings from "app/components/screen/Settings/Settings";
import SinglePlaylist from "app/components/screen/SinglePlaylist/SinglePlaylist";

export const routes = [
    {
		name: 'Main',
		component: Main,
	},
	{
		name: 'Playlists',
		component: Playlists,
	},
	{
		name: 'Settings',
		component: Settings,
	},
	{
		name: 'Player',
		component: Player,
	},
	{
		name: 'SinglePlaylist',
		component: SinglePlaylist,
	},
	{
		name: 'AddSongsToPlaylist',
		component: AddSongsToPlaylist,
	},
	{
		name: 'KaraokeLyrics',
		component: KaraokeLyrics,
	},
]