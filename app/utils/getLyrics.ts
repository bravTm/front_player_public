export const getLyrics = async (artist: string, songName: string) => {
    artist = artist.replace(" ", "%20")
    songName = songName.replace(" ", "%20")
    const lyrics = await (await fetch(`https://api.lyrics.ovh/v1/${artist}/${songName}`)).json()

    return lyrics?.lyrics
}