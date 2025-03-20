import { FC, memo, useState } from 'react'
import React from 'react'
import { Alert, Text, View } from 'react-native'
import { useTypedRoute } from 'app/hooks/useTypedRoute'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'
import { useLang } from 'app/hooks/useLang'
import { usePlaybackAndAudioPlay } from 'app/hooks/usePlaybackAndAudioPlay'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useTopSongs } from 'app/hooks/useTopSongs'

import AudioList from 'app/components/ui/AudioList/AudioList'
import Layout from 'app/components/ui/Layout'
import Line from 'app/components/ui/Line/Line'
import ChangeTitleForm from './ChangeTitleForm'
import PlaylistButton from './PlaylistButton'

import { width } from 'app/utils/constants'
import { shuffleArray } from 'app/utils/shuffle'
import { playNext } from 'app/components/ui/AudioList/audio.methods'
import { setAsyncStorage } from 'app/utils/storage'
import { formatDuration } from 'app/utils/formatDuration'

// import * as FileSystem from 'expo-file-system'
// import * as Sharing from 'expo-sharing'
// import JSZip from 'jszip'
// import * as Updates from 'expo-updates';



const SinglePlaylist: FC = memo(() => {
    //------ START ECTION: CHECK FOR HAVING A PLAYLIST -----------------------------------
    const title = useTypedRoute()?.params?.title
    // if(!title) return null
    
    const { playlists, setActivePlstAndIsShuffle, setPlaylists } = usePlaylists()
    // if(playlists?.length == 0) return null
    
    let plst = playlists?.map((item) => {
        if(title == item.title) return item
    }).sort()
    
    
    // if(plst.length == 0) return null
    
    const playlist = plst[0]
    // if(!playlist) return null
    //------ END SECTION: CHECK FOR HAVING A PLAYLIST -----------------------------------
    
    
    // @ts-ignore
    const [isShow, setIsShow] = useState(false)
    const [isChange, setIsChange] = useState(false)
    const [value, setValue] = useState(title || "") as any
    const { i18n } = useLang()
    const { navigate } = useTypedNavigation()
    const { playbackObj, setPlaybackPosition, setPlaybackDuration, changeState } = usePlaybackAndAudioPlay()
    const { topSongs, setTopSongs } = useTopSongs()

    let time = formatDuration(0)

    if(!!playlist) {
        time = formatDuration(playlist?.playlistDuration * 1000)
    }

    const deletePlaylist = () => {
        if(!playlist) return
        const newPlaylists = playlists?.filter((item) => item.title != playlist?.title)

        navigate("Playlists")
        setTimeout(() => {
            setPlaylists(newPlaylists)
            setAsyncStorage("playlists", JSON.stringify(newPlaylists))
        }, 250)
    }


    const permissionDeletePlaylist = () => {
        Alert.alert(i18n.t("permissionDeletePlaylist"), "", [
            { text: i18n.t('cancel') },
            { text: "OK", onPress: deletePlaylist }
        ])
    }

    const playPlaylist = (type: "line" | "shuffle") => {
        if(!playlist) return

        let indexes = []
        for(let i = 0; i < playlist?.songs.length; i++) indexes.push(i)
        let shuffledIndexes: number[] =  shuffleArray(indexes)

        let order = []
        for(let i = 0; i < playlist?.songs.length; i++) {
            order.push(playlist?.songs[shuffledIndexes[i]])
        }
        
        setActivePlstAndIsShuffle(
            playlist,
            type == 'shuffle',
            type == 'line' ? playlist?.songs : order
        )


        if(order.length > 0) {
            if(type == 'line') {
                playNext(playbackObj, playlist?.songs[0], changeState, playlist?.songs, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
            }
            else {
                playNext(playbackObj,  order[0], changeState, playlist?.songs, setPlaybackPosition, setPlaybackDuration, null, null, null, topSongs, setTopSongs)
            }
        }
    }

    const onChangeTitle = () => {
        if(!playlist || !title) return 

        if(value?.length == 0) {
            setIsChange(false)
        }
            
        const newPlaylists = playlists?.map((item) => {
            if(item.title == title) {
                return {
                    date: item.date,
                    title: value?.length > 0 ? value : item.title, //
                    songs: item.songs,
                    playlistDuration: item.playlistDuration,
                    image: item.image
                }
            }
            return item
        })
        
        setPlaylists(newPlaylists as any)
        setAsyncStorage("playlists", JSON.stringify(newPlaylists as any))
        navigate("Playlists")
        setIsChange(false)
    }




    // const archivePlaylist = async () => {
    //     const zip = new JSZip();

    //     const listUri = playlist?.songs?.map((item) => item.uri) as any

    //     console.log("TYT1")

    //     for (const uri of listUri) {
    //         const fileName = uri.split('/').pop(); 
    //         const fileData = await FileSystem.readAsStringAsync(uri, {
    //           encoding: FileSystem.EncodingType.Base64,
    //         });
    //         zip.file(fileName as string, fileData, { base64: true });
    //     }

    //     if(playlist?.image) {
    //         const fileData = await FileSystem.readAsStringAsync(playlist?.image, {
    //           encoding: FileSystem.EncodingType.Base64,
    //         });
    //         zip.file('thumbnail' as string, fileData, { base64: true });
    //     }

    //     console.log("TYT2")
        
    //     const content = await zip.generateAsync({ type: 'base64' });
    //     const zipUri = `${FileSystem.documentDirectory}${playlist?.title}.zip`;

    //     console.log("TYT3", zipUri)
        
    //     await FileSystem.writeAsStringAsync(zipUri, content, {
    //         encoding: FileSystem.EncodingType.Base64,
    //     });

    //     await Sharing.shareAsync(zipUri);

    //     // setTimeout(() => {
    //     //     Updates.reloadAsync()
    //     // }, 500)
    // }

    return (
     <Layout>
        <View>
            {isChange ? (
                <ChangeTitleForm title={playlist?.title || ""} onChangeTitle={onChangeTitle} value={value} setValue={setValue} />
            ) : (
                <Text 
                    className='dark:text-light text-dark text-center'
                    style={{ fontSize: 0.05 * width }}
                    onLongPress={() => setIsChange(true)}
                >
                    {playlist?.title}
                </Text>
            )}
        </View>

        <View className='flex-row justify-center items-center mt-[3%]'>
            <Text 
                className='dark:text-light text-dark opacity-65 mr-[5%]'
                style={{ fontSize: 0.035 * width }}
            >
                {time}
            </Text>
            <PlaylistButton 
                name='play-arrow' 
                onPress={() => playPlaylist("line")} 
                text={i18n.t("singlePlaylistButtonsAndTitles.playLine")}
            />
            <PlaylistButton 
                name='shuffle' 
                onPress={() => playPlaylist("shuffle")} 
                text={i18n.t("singlePlaylistButtonsAndTitles.playShuffle")}
            />
        </View>

        <Text 
            className='dark:text-light text-dark text-center mt-[5%] mb-[3%] opacity-70 underline' 
            style={{ fontSize: 0.035 * width }}
            onPress={() => setIsShow(!isShow)}
        >
            {isShow ? i18n.t("singlePlaylistButtonsAndTitles.hideSettings") : i18n.t("singlePlaylistButtonsAndTitles.showSettings")}
        </Text>

        {isShow && !!playlist ? (
            <View className='justify-around items-center  animate-fade'>
                <View className='flex-row justify-around items-center'>
                    <PlaylistButton 
                        name='add' 
                        onPress={() => navigate("AddSongsToPlaylist", { title: playlist?.title })}
                        text={i18n.t("singlePlaylistButtonsAndTitles.addSongs")}
                        bg='#248a2e'
                    />

                    <PlaylistButton 
                        name='delete' 
                        onPress={permissionDeletePlaylist}
                        text={i18n.t("singlePlaylistButtonsAndTitles.deletePlaylist")}
                        bg='#821b24'
                    />


                </View>
                
                {/* <PlaylistButton 
                    name='archive' 
                    onPress={archivePlaylist}
                    text={i18n.t("singlePlaylistButtonsAndTitles.archive")}
                    bg='#ef433333'
                /> */}
            </View>
        ) : <></>}

        <Line />

        <AudioList songs={playlist?.songs || []} type='playlist' />
     </Layout>
    )
})

export default SinglePlaylist