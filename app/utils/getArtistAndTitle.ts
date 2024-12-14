import { removeSitesFromTitle } from "./removeSitesFromTitle"

export const getArtistAndTitle = (filename: string, defaultArtist: string) => {
    const artist = filename.slice(0, filename.indexOf("-"))
    const title = filename.slice(filename.indexOf("-") + 1, filename.length)

    if(filename.indexOf("-") == -1) {
        return {
            artist: defaultArtist,
            title: removeSitesFromTitle(title)
        }
    }

    return {
        artist: removeSitesFromTitle(artist),
        title: removeSitesFromTitle(title)
    }
}