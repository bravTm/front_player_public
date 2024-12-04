import { FC, memo } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useActions } from 'app/hooks/useActions'
import { useColorScheme } from 'nativewind'

import { MaterialIcons } from '@expo/vector-icons'

import { width } from 'app/utils/constants'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import { ISong } from 'app/types/song.types'
import { setAsyncStorage } from 'app/utils/storage'
import { useTypedRoute } from 'app/hooks/useTypedRoute'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'
import { useLang } from 'app/hooks/useLang'

interface IRemoveFromPlaylist {
    icon: TypeMaterialIconNames
    title: string
    song: ISong
    setIsShow: React.Dispatch<React.SetStateAction<{
        state: boolean;
        songItem: ISong;
    }>>
}

const RemoveFromPlaylist: FC<IRemoveFromPlaylist> = memo(({ icon, title, song, setIsShow }) => {
    const playlistTitle = useTypedRoute()?.params?.title
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()
    const { playlists } = usePlaylists()
    const { setPlaylists } = useActions()

    const removeFromPlaylist = () => {
        const newPlaylists = playlists.map((item) => {
            if(item.title == playlistTitle) {
                return {
                    title: item.title,
                    image: item.image,
                    playlistDuration: item.playlistDuration - song.duration,
                    songs: item?.songs?.filter((item) => item?.id != song?.id),
                    date: item.date
                }
            }
            return item
        })

        setPlaylists(newPlaylists)
        setAsyncStorage("playlists", JSON.stringify(newPlaylists))
        setTimeout(() => {
            setIsShow({ state: false, songItem: {} as any })
        }, 350)
    }

    const permissionRemoveSong = () => {
        Alert.alert(i18n.t("permissionRemoveSongFromPlaylist"), "", [
            { text: i18n.t('cancel') },
            { text: "OK", onPress: removeFromPlaylist }
        ])
    }


    return (
     <TouchableOpacity
        className='dark:bg-[#800612] bg-[#eb3f4e] rounded-sm flex-row justify-start items-center py-[3%] border-b border-b-gray-600 border-opacity-5'
        activeOpacity={0.8}
        onPress={permissionRemoveSong}
    >
        <MaterialIcons 
            name={icon}
            size={0.048 * width}
            color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
            className='ml-[2%] mr-[4%]'
        />

        <Text
            className='dark:text-light text-dark'
            style={{fontSize: 0.04 * width}}
        >
            {title}
        </Text>
     </TouchableOpacity>
    )
})

export default RemoveFromPlaylist