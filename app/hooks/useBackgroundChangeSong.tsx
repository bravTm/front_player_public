import { playNext } from "app/components/ui/AudioList/audio.methods"
import { useActions } from "./useActions"
import { useAudioPlay } from "./useAudioPlay"
import { usePlaylists } from "./usePlaylists"
import { usePlaySettings } from "./usePlaySettings"
import { useSongs } from "./useSongs"
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';


export const BACKGROUND_FETCH_TASK = 'change-song';


export const useBackgroundChangeSong = async () => {
    const { playbackObj, currentIndex, currentAudio } = useAudioPlay()
    const { changeState, setPlayback, changeSoundObj, changeIsPlaying } = useActions()
    const { activePlaylist, orderToPlay } = usePlaylists() 
    const { songs, totalCount } = useSongs()
    const { isRepeatQueue, isRepeatSong } = usePlaySettings()


    const changeSong = async () => {
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
    }






    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        console.log("HERE")
        await changeSong()
        return BackgroundFetch.BackgroundFetchResult.NewData;
    });


    async function registerBackgroundFetchAsync() {
        return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 2, // 10 seconds
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }

    async function unregisterBackgroundFetchAsync() {
        return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }

    return {
        registerBackgroundFetchAsync,
        unregisterBackgroundFetchAsync
    }
}