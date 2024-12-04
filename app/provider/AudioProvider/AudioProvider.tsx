import { FC, memo, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { useActions } from 'app/hooks/useActions'
import { useAudioPlay } from 'app/hooks/useAudioPlay'
import { useSongs } from 'app/hooks/useSongs'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { usePlaySettings } from 'app/hooks/usePlaySettings'
import { useLang } from 'app/hooks/useLang'

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
// import MusicControl from 'react-native-music-control';

import { Audio, InterruptionModeAndroid } from 'expo-av'
import { pause, playNext } from 'app/components/ui/AudioList/audio.methods'
import { getPermission } from './permissions-functions'
import { loadPlaylists, loadPlaySettings, loadPreviousSong } from './loading-functions'
import { BACKGROUND_FETCH_TASK, useBackgroundChangeSong } from 'app/hooks/useBackgroundChangeSong'


async function registerBackgroundFetchAsync() {
    return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 2, // 10 seconds
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}


const AudioProvider: FC<PropsWithChildren> = ({ children }) => {
    const { playbackObj, isPlaying, currentIndex, currentAudio } = useAudioPlay()
    const { changeState, setPlayback, changeSoundObj, changeIsPlaying, initialize, setPlaylists, setPlaySettings } = useActions()
    const { activePlaylist, orderToPlay } = usePlaylists() 
    const { songs, totalCount } = useSongs()
    const { isRepeatQueue, isRepeatSong } = usePlaySettings()
    const { i18n } = useLang()

    useBackgroundChangeSong()

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
                setPlayback({ playbackPosition: status.positionMillis, playbackDuration: status.durationMillis })
                
                const isSongEnded = (status.didJustFinish || status.positionMillis == status.durationMillis)

                if(activePlaylist &&  isRepeatSong && isSongEnded){
                    return playNext(playbackObj, currentAudio as any, changeState, activePlaylist?.songs as any, setPlayback)
                }
                else if(isRepeatSong && isSongEnded){
                    return playNext(playbackObj, currentAudio as any, changeState, songs as any, setPlayback)
                }

                if(!isRepeatQueue && (currentIndex + 1 == orderToPlay?.length || currentIndex + 1 == songs?.length) && isSongEnded) {
                    // @ts-ignore
                    return pause(playbackObj, changeSoundObj, changeIsPlaying)
                }

                if(status.didJustFinish || isSongEnded) {
                    if(!activePlaylist || !orderToPlay) {
                        let nextIndex = 0
                        if(currentIndex + 1 == totalCount) nextIndex = 0
                        else nextIndex = currentIndex + 1
    
                        return playNext(playbackObj, songs[nextIndex] as any, changeState, songs as any, setPlayback)
                    }else {
                        let nextIndex = 0
                        if(currentIndex + 1 == orderToPlay.length) nextIndex = 0
                        else nextIndex = currentIndex + 1
    
                        return playNext(playbackObj, orderToPlay[nextIndex] as any, changeState, orderToPlay as any, setPlayback)
                    }
                }
            } else if (status.error) {
                console.error(`Playback error: ${status.error}`);
            }
        }
    }, [playbackObj, setPlayback]);
    
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(updatePlaybackStatus, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, updatePlaybackStatus]);




    useEffect(() => {
        const register = async () => {
            await registerBackgroundFetchAsync();
            await BackgroundFetch.setMinimumIntervalAsync(600);
        }
        
        register()
    }, [isPlaying, playbackObj]);



    

    useEffect(() => {
        // load songs from device
        getPermission(i18n, initialize)
        loadPreviousSong(songs as any, changeState)
        loadPlaylists(setPlaylists)
        loadPlaySettings(setPlaySettings)
    }, []) 



    return (
     <>
        {children}
     </>
    )
}

export default AudioProvider