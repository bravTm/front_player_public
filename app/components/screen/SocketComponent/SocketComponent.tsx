import React, { FC, memo, useEffect, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useSocket } from 'app/hooks/useSocket'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useUploadAudio } from './useUploadAudio'
import { usePlaybackAndAudioPlay } from 'app/hooks/usePlaybackAndAudioPlay'
import { useLang } from 'app/hooks/useLang'

import Layout from 'app/components/ui/Layout'
import AudioItemSocket from 'app/components/ui/AudioItemSocket/AudioItemSocket'
import TextField from 'app/components/ui/TextField/TextField'
import Button from 'app/components/ui/Button/Button'
import QRCode from 'react-native-qrcode-svg';

import { io } from 'socket.io-client'
import { pause, play, playFromPosition, playNext, resume, unloadMusic } from 'app/components/screen/SocketComponent/socket-audio-methods'
import { Audio, InterruptionModeAndroid } from 'expo-av'
import cn from 'clsx'
import { SERVER_URL } from 'app/config/api.config'
import { ISocketStatusData } from 'app/types/socket-client.types'
import * as Clipboard from 'expo-clipboard';
import { bottomMargin, width } from 'app/utils/constants'

import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'


const SocketComponent: FC = memo(() => {
    const [isConnected, setIsConnected] = useState(false) 
    const [lastUserId, setLastUserId] = useState("")
    const [textField, setTextField] = useState("")
    const [processDownloading, setProcessDownloading] = useState(null)

    const [statusData, setStatusData] = useState<ISocketStatusData>({} as any)

    const { i18n } = useLang()

    const { isPlaying, playbackPosition, playbackDuration, soundObj, playbackObj, changeState,
        setPlaybackDuration, setPlaybackPosition, setIsPlaying, setSoundObj
     } = usePlaybackAndAudioPlay()

    const { setActivePlstAndIsShuffle } = usePlaylists()

    const { socket, setSocket, selectedSong, file, setFile, setRoomName, roomName, listenersCount,
    setListenersCount } = useSocket()
    const { uploadFile, isLoading } = useUploadAudio(setFile) 

    const isOwner = roomName?.startsWith(socket?.id || "room")


    /// USEEFFECTS ----------------------------------------------------
    useEffect(() => {
        if(socket != null) {
            setIsConnected(socket.connected)
        }
    }, [])

    useEffect(() => {
        if(socket != null) {
            socket.on("connect", () => {
                setIsConnected(true)

                console.log("connected")
            })

            socket.on("disconnect", () => {
                setIsConnected(false)
            })
    
            socket.on("onJoined", (data) => {
                setLastUserId(data?.id)
                setListenersCount(data?.allCount)
            })

            socket.on("onStatus", (data) => {
                if(data.receiver == socket.id) {
                    setStatusData(data)
                }
            })

            socket.on("onChangePlaying", (data) => {
                setFile(data.url)
                setIsPlaying(data.isPlaying)
                setPlaybackPosition(data.playbackPosition)
                return
            })
            
            // socket.on("onChangePlayback", (data) => {
            //     setPlaybackPosition(data.playbackPosition)
            //     setIsValidChangePlayback(true)
            //     return
            // })

            return () => {
                socket.off("connect")
                socket.off("disconnect")
                socket.off("onJoined")
                socket.off("onStatus")
                socket.off("onChangePlaying")
                // socket.off("onChangePlayback")
                return
            }
        }
    }, [socket])


    useEffect(() => {
        if(socket != null) {
            if(roomName?.startsWith(socket.id as any)) {
                sendStatusToNew()
            }
        }
    }, [listenersCount])


    useEffect(() => {
        if(socket != null) {
            if(!roomName?.startsWith(socket.id as any)) {
                if(isPlaying) {
                    // @ts-ignore
                    if(soundObj?.uri != file && !roomName?.startsWith(socket.id as any) && !!playbackObj) {
                        // @ts-ignore
                        playNext(playbackObj, SERVER_URL + file.slice(1, file.length), changeState,
                            [], setPlaybackPosition, setPlaybackDuration)
                        return
                    }
                    // @ts-ignore
                    onAudioPress("PLAY", SERVER_URL + file.slice(1, file.length), playbackPosition)
                }
                else onAudioPress("PAUSE")
            }
        }
    }, [isPlaying])


    useEffect(() => {
        if(statusData && socket != null) {
            if(statusData.receiver == socket.id) {
                const unload = async () => {
                    await unloadMusic(playbackObj, changeState, setSoundObj, setIsPlaying)
                }
                unload()
            }
        }
    }, [statusData])

    useEffect(() => {
        if(statusData && socket != null) {
            // проверка на то, что это именно последний сокет
            if(statusData.receiver == socket.id) {
                setFile(statusData.url)
                setPlaybackDuration(statusData.playbackDuration)
                setPlaybackPosition(statusData.playbackPosition)

                setIsPlaying(statusData.isPlaying)
            }
        }
    }, [statusData])

    /// --------------------------------------------------------------------------------


    
    /// BASIC FUNCTIONS -------------------------------------------------------------------------------
    const connectToServer = () => {
        setSocket(io(SERVER_URL))
    }

    const disconnect = () => {
        if(socket != null) {
            socket.emit('join', {
                name: "",
                roomName,
                action: "quit"
            })
            socket?.disconnect()
            setSocket(null)
            setRoomName("")
            setFile("")
            // setStatusData(null as any)
            unloadMusic(playbackObj, changeState, setSoundObj, setIsPlaying)
        } 
    }

    const createRoom = () => {
        if(socket != null) {
            socket.emit("join", {
                name: socket.id,
                roomName: socket.id + "room",
                action: "join"
            })

            setRoomName(socket.id + "room")
        }
    }

    const joinRoom = () => {
        if(socket != null) {
            socket.emit("join", {
                name: socket.id,
                roomName: textField,
                action: "join"
            })

            setRoomName(textField)
        }
    }

    const sendStatusToNew = () => {
        if(socket != null) {
            socket.emit("status", {
                playbackDuration,
                playbackPosition,
                isPlaying,
                url: file,
                receiver: lastUserId
            })
        }
    }


    const uploadAnotherAudio = () => {
        if(file?.includes(selectedSong as any)) {
            Alert.alert("Choose another song, you've used this recently")
        }
        else {
            if(socket != null && roomName?.startsWith(socket?.id || "")) {
                socket.emit("changePlaying", {
                    isPlaying: false,
                    url: file,
                    roomName: socket.id + "room",
                    playbackPosition
                })
            }
            unloadMusic(playbackObj, changeState, setSoundObj, setIsPlaying)
            setPlaybackDuration(0)
            setPlaybackDuration(0)
            uploadFile(selectedSong as any, socket?.id as any)
        }
    }

    const copyRoomName = async () => {
        await Clipboard.setStringAsync(roomName || "")
    }


    const downloadSong = async () => {
        if (file) {
            const fileUri = FileSystem.documentDirectory + file.slice(file.lastIndexOf("/") + 1, file.length)

            const downloadResumable = FileSystem.createDownloadResumable(
                SERVER_URL + file.slice(1, file.length), fileUri, {},
                (process) => setProcessDownloading(process as any)
            );
              
            try {
                const res = await downloadResumable.downloadAsync();
                // console.log('Finished downloading to ', res);
            } catch (e) {
                console.error(e);
            }

            setProcessDownloading(null)
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Download", asset, false)
        }
    }


    // const onSliding = (value: number) => {
    //     if(playbackDuration == undefined) return 0
    //     const newPlayback = Math.floor(value * playbackDuration) // in millis

    //     if(socket != null && isOwner) {
    //         socket.emit("changePlayback", {
    //             playbackDuration,
    //             playbackPosition: newPlayback,
    //             isPlaying,
    //             url: file,
    //             roomName
    //         })
    //         // setIsPlaying(true) // from state
    //     }
    // }
    // ----------------------------------------------------------------------------------------------





    const onAudioPress = async (type: "PLAY" | "PAUSE" | "FROM_POSITION", url?: string, position?: number) => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false
        });

        // @ts-ignore
        const fileUrl = url ? url : SERVER_URL + file.slice(1, file.length)

        
        if(type == "PLAY" && (position || 0) > 0 && !playbackObj) {
            return await playFromPosition(fileUrl, position as any, playbackDuration as any, changeState, setPlaybackPosition, setPlaybackDuration);
        }

        // if(type == "FROM_POSITION" && (position || 0) > 0 && !!playbackObj && !isPlaying) {
        if(type == "FROM_POSITION" && (position || 0) > 0) {
            return await playFromPosition(fileUrl, position as any, playbackDuration as any, changeState, setPlaybackPosition, setPlaybackDuration);
        }


        if(type == 'PLAY' && !playbackObj) {
            if(socket != null && roomName?.startsWith(socket?.id || "")) {
                socket.emit("changePlaying", {
                    isPlaying: true,
                    url: file,
                    roomName: socket.id + "room",
                    playbackPosition
                })
            }
            return await play(fileUrl, changeState, [], setPlaybackPosition, setPlaybackDuration) 
        }

        if(type == 'PAUSE') {
            if(socket != null && roomName?.startsWith(socket?.id || "")) {
                socket.emit("changePlaying", {
                    isPlaying: false,
                    url: file,
                    roomName: socket.id + "room",
                    playbackPosition
                })
            }
            return await pause(playbackObj, setSoundObj, setIsPlaying)
        }
        
        if(type == 'PLAY' && !!playbackObj){      // resume
            if(socket != null && roomName?.startsWith(socket?.id || "")) {
                socket.emit("changePlaying", {
                    isPlaying: true,
                    url: file,
                    roomName: socket.id + "room",
                    playbackPosition
                })
            }
            return await resume(playbackObj, setSoundObj, setIsPlaying)
        }

        // // @ts-ignore
        // if(soundObj.isLoaded && currentAudio !== audio.id) {
        //     return await playNext(file as any, changeState, [], setPlaybackPosition, setPlaybackDuration, setActivePlstAndIsShuffle, [], null)
        // }
    }

    // [x] ПОФИКСИТЬ: если человек что-то до этого слушал, после чего подключился к серверу, песня не изменяется, а должна
    // [x] ЛОАДЕР ДЛЯ ФАЙЛА СДЕЛАТЬ
    // [x] ОПЯТЬ НАСЛАИВАЮТСЯ ПЕСНИ

    // ПРОБЛЕМА В ТОМ, ЧТО ПЕРЕМОТКА РАБОТАЕТ ДЛЯ ДРУГОГО ЧЕЛОВЕКА, НО НЕ ДЛЯ ГЛАВНОГО

    // новый красивый компонент для аудио + кнопка ПАУЗА/ПЛЭЙ
    // 3) перемотка
    // 4) Помечать все песни серым, чтобы нельзя было слушать что-то кроме совместного, пока подключен к серверу
    // 5) OPTIMIZATION

    // ОБЯЗАТЕЛЬНО ДОБАВИТЬ: убрать возможность у неглавных ставить на паузу/включать или решить проблему с playbackщм при таких действиях


    // все текст с width

    return (
     <Layout isHasPadding>
        <ScrollView contentContainerStyle={{ paddingBottom: bottomMargin }}>
            <Button width={100} title={isConnected ? i18n.t("socket.disconnect") : i18n.t("socket.connect")} onPress={socket ? disconnect : connectToServer} 
                className={cn('bg-green-400 rounded-md', {
                    "bg-red": isConnected
                })}
            />


            {isConnected ? (
                <>
                {!roomName ? (
                    <View className='mt-[15%] justify-center items-center h-[75%]'>
                        <TextField placeholder={i18n.t("socket.roomPlaceholder")} setText={setTextField} text={textField} />

                        <Button title={i18n.t("socket.joinRoom")} onPress={joinRoom} className='bg-yellow-200 rounded-md' />

                        <Text className='text-white text-center text-xl my-[10%]'>
                            {i18n.t("socket.or")}
                        </Text>

                        <Button title={i18n.t("socket.createRoom")} onPress={createRoom} className='bg-gray-400 rounded-md' />
                    </View>

                ) : (
                    <View className='h-[100%] items-center mt-[15%]'>
                        <Text className='text-white'>
                            {`${i18n.t("socket.allUsers")} ${listenersCount}`}
                        </Text> 

                        <View className='justify-center items-center mb-[10%] mt-[2%] w-full'>
                            <Text className='text-white text-xl text-bold mb-[4%]' onPress={copyRoomName}>
                                {`${i18n.t("socket.room")}: ${roomName}`}
                            </Text>

                            <QRCode 
                                value={roomName}
                                size={200}
                                backgroundColor='white'
                                color='#6a6e75'
                                quietZone={5}
                                logo={require("./ShortTitlePlayerBlack.png")}
                            />
                        </View>

                        {!file && isOwner ? (
                            <Button title={i18n.t("socket.transferToTheServer")} className='text-white rounded-md bg-purple-300' onPress={uploadAnotherAudio}/>
                        ) : <></>}

                        {/* {file && !isLoading ? ( */}
                        {file ? (
                            <>
                                <AudioItemSocket 
                                    isPlaying={isPlaying}
                                    plDur={playbackDuration as any}
                                    plPos={playbackPosition as any}
                                    url={file}
                                    onAudioPress={onAudioPress}
                                />


                                {isOwner ? (
                                    <Button title={i18n.t("socket.transferAnotherToTheServer")} className='text-white rounded-md bg-purple-300' onPress={uploadAnotherAudio}/>
                                ) : <></>}


                                <Text className='dark:text-light text-dark bg-green-600 p-[2%] rounded-lg mt-[5%]' 
                                    onPress={downloadSong} style={{ fontSize: 0.04 * width }}
                                >
                                    {i18n.t("socket.downloadSong")}
                                </Text>

                                {processDownloading && (
                                    <Text className='dark:text-light text-dark' style={{ fontSize: 0.045 * width }}>
                                        {/* @ts-ignore */}
                                        {`${processDownloading?.totalBytesWritten}/${processDownloading?.totalBytesExpectedToWrite}`}
                                    </Text>
                                )}

                                {/* <SliderSong 
                                    onSlidingComplete={onSliding}
                                    playbackDuration={playbackDuration as any}
                                    playbackPosition={playbackPosition as any}
                                /> */}
                            </>
                        ) : isLoading && (
                            <>
                                <Text className='text-white' style={{ fontSize: width * 0.035 }}>
                                    {i18n.t("loading")}
                                </Text>
                            </>
                        )}


                    </View>
                )}

                </>
            ) : <></>}

        </ScrollView>

     </Layout>
    )
})

export default SocketComponent