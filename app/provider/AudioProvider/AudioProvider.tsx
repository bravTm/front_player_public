import { FC, PropsWithChildren, useCallback, useEffect } from 'react'
import React from 'react'
import { useLang } from 'app/hooks/useLang'
import { useSongsAndPlaySettings } from 'app/hooks/useSongsAndPlaySettings'
import { usePlaybackAndAudioPlay } from 'app/hooks/usePlaybackAndAudioPlay'
import { usePlaylists } from 'app/hooks/usePlaylists'


import { Audio, InterruptionModeAndroid } from 'expo-av'
import { pause, playNext } from 'app/components/ui/AudioList/audio.methods'
import { getPermission } from './permissions-functions'
import { getTopSongs, loadPlaylists, loadPlaySettings, loadPreviousSong } from './loading-functions'
import { useTopSongs } from 'app/hooks/useTopSongs'

import * as MediaLibrary from "expo-media-library"
import { useSocket } from 'app/hooks/useSocket'


const AudioProvider: FC<PropsWithChildren> = ({ children }) => {
    const { activePlaylist, orderToPlay, setPlaylists } = usePlaylists() 
    const { topSongs, setTopSongs } = useTopSongs()
    const { socket } = useSocket()


    const { i18n } = useLang()
    const { songs, totalCount, setSongs, setTotalCount, setIsRepeatQueue, setIsRepeatSong, isRepeatQueue, isRepeatSong } = useSongsAndPlaySettings()
    const { setPlaybackDuration, setPlaybackPosition, playbackObj, isPlaying, currentIndex, currentAudio,
        changeState
    } = usePlaybackAndAudioPlay()

    const updatePlaybackStatus = useCallback(async () => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false,
        });

        if (playbackObj) {
            const status = await playbackObj.getStatusAsync();

            if (status.isLoaded) {
                setPlaybackPosition(status?.positionMillis)
                setPlaybackDuration(status?.durationMillis as any)
                
                const isSongEnded = (status.didJustFinish || status.positionMillis == status.durationMillis)

                if(activePlaylist &&  isRepeatSong && isSongEnded){
                    return playNext(playbackObj, currentAudio as any, changeState, activePlaylist?.songs as any, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
                }
                else if(isRepeatSong && isSongEnded){
                    return playNext(playbackObj, currentAudio as any, changeState, songs as any, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
                }

                if(!isRepeatQueue && (currentIndex + 1 == orderToPlay?.length || currentIndex + 1 == songs?.length) && isSongEnded) {
                    // @ts-ignore
                    return pause(playbackObj, changeSoundObj, changeIsPlaying)
                }

                if((status.didJustFinish || isSongEnded) && !socket) {
                    if(!activePlaylist || !orderToPlay) {
                        let nextIndex = 0
                        if(currentIndex + 1 == totalCount) nextIndex = 0
                        else nextIndex = currentIndex + 1
    
                        return playNext(playbackObj, songs[nextIndex] as any, changeState, songs as any, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
                    }else {
                        let nextIndex = 0
                        if(currentIndex + 1 == orderToPlay.length) nextIndex = 0
                        else nextIndex = currentIndex + 1
    
                        return playNext(playbackObj, orderToPlay[nextIndex] as any, changeState, orderToPlay as any, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
                    }
                }
            } else if (status.error) {
                console.error(`Playback error: ${status.error}`);
            }
        }
    }, [playbackObj, setPlaybackDuration, setPlaybackPosition]);
    
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(updatePlaybackStatus, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, updatePlaybackStatus]);


    

    useEffect(() => {
        // load songs from device
        getPermission(i18n, setSongs, setTotalCount)
        loadPreviousSong(songs as any, changeState)
        loadPlaylists(setPlaylists)
        getTopSongs(setTopSongs)

        loadPlaySettings(setIsRepeatQueue, setIsRepeatSong)
    }, []) 



    return (
     <>
        {children}
     </>
    )
}

export default AudioProvider