import React, { FC } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { useLang } from 'app/hooks/useLang'

import AddToPlaylistItem from './MenuMoreItems/AddToPlaylistItem'
import ShareMusicItem from './MenuMoreItems/ShareMusicItem'
import { MaterialIcons } from '@expo/vector-icons'

import { ISong } from 'app/types/song.types'
import { width } from 'app/utils/constants'
import { useColorScheme } from 'nativewind'
import Line from '../../Line/Line'
import RemoveFromPlaylist from './MenuMoreItems/RemoveFromPlaylist'
import DeleteAudioFromDevice from './MenuMoreItems/DeleteAudioFromDevice'
import { useSocket } from 'app/hooks/useSocket'
import SelectedSong from './MenuMoreItems/SelectedSong'

interface IMenuMore {
    type: "simple" | "playlist"
    item: ISong
    setIsShow: React.Dispatch<React.SetStateAction<{
        state: boolean;
        songItem: ISong;
    }>>
}


const MenuMore: FC<IMenuMore> = ({ type, item, setIsShow }) => {
    const { i18n } = useLang()
    const { colorScheme } = useColorScheme()
    const { socket } = useSocket()

    return (
     <Modal>
        <View className='dark:bg-[#3b3a38] bg-[#dedbd5] h-full w-full right-0'>
            <Text 
                className='dark:text-green-600 text-green-800 text-center font-semibold mx-[2%] mt-[1%] -mb-[2%]'
                style={{fontSize: 0.035 * width}}
            >
                {item.filename}
            </Text>

            <Line />

            {type == 'playlist' ? (
                <RemoveFromPlaylist icon='delete-outline' title={i18n.t("menuMore.removeFromPlaylist")} song={item} setIsShow={setIsShow} />
            ) : (
                <AddToPlaylistItem icon='playlist-add' title={i18n.t("menuMore.addToPlaylist")} song={item} />
            )}
            <ShareMusicItem icon='share' title={i18n.t("menuMore.shareMusic")} uri={item.uri} last/>
            {/* <DeleteAudioFromDevice icon='delete-forever' title={i18n.t("menuMore.deleteSong")} uri={item.uri} last /> */}

            {socket ? (
                <SelectedSong item={item} icon='check' title={i18n.t("menuMore.listenTogether")} />
            ) : <></>}


            <Pressable className='flex-row justify-start items-center mt-[5%]' onPress={() => setIsShow({ state: false, songItem: {} as any })}>
                <MaterialIcons 
                    name={'arrow-back'}
                    size={0.07 * width}
                    color={colorScheme == 'dark' ? "#afe01b" : "#8a6501"}
                    className='mr-[2%]'
                />
                <Text 
                    className='dark:text-[#afe01b] text-[#8a6501] font-semibold '
                    style={{fontSize: 0.035 * width}}
                >
                    {i18n.t("menuMore.back")}
                </Text>
            </Pressable>
        </View>
     </Modal>
    )
}
export default MenuMore