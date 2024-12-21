import { FC, memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'

import { Image } from 'expo-image'
import { MaterialIcons } from '@expo/vector-icons'

import { IPlaylist } from 'app/types/playlists.types'
import { width } from 'app/utils/constants'
import { pickImage } from 'app/utils/pickImage'
import { setAsyncStorage } from 'app/utils/storage'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { formatDuration } from 'app/utils/formatDuration'

interface IPlaylistItem {
    playlist: IPlaylist
    disabled?: boolean
}

const PlaylistItem: FC<IPlaylistItem> = memo(({ playlist, disabled = false }) => {
    const { colorScheme } = useColorScheme()
    const { navigate } = useTypedNavigation()
    const { playlists, setPlaylists } = usePlaylists()

    let title = playlist?.title
    if(playlist?.title.length > 15) title = playlist.title.slice(0, 15) + "..."

    const time = formatDuration(playlist?.playlistDuration * 1000 || 0)

    const pickImageAsync = async () => {
        const result = await pickImage()

        if(!!result.assets) {
            if(result.assets.length > 0) {
                const newPlaylists = playlists.map((item) => {
                    if(item.title == title) {
                        return {
                            date: item.date,
                            title: item.title,
                            playlistDuration: item.playlistDuration,
                            songs: item.songs,
                            image: result.assets[0].uri
                        }
                    }
                    return item
                })

                setPlaylists(newPlaylists as any)
                setAsyncStorage("playlists", JSON.stringify(newPlaylists))
            }
        }
    }
    

    return (
     <TouchableOpacity 
        activeOpacity={0.7} 
        className='my-[2%] mx-[3%]'
        onPress={() => navigate("SinglePlaylist", { title: playlist.title })}
        onLongPress={pickImageAsync}
        disabled={disabled}
    >
        {!!playlist?.image ? (
            <Image
                style={{ width: 0.45 * width, height: 0.45 * width, borderRadius: 24 }}
                source={playlist.image}
                contentFit="cover"
                transition={700}
                className='rounded-3xl'
            />
        ) : (
            <View 
                style={{ width: 0.45 * width, height: 0.45 * width }}
                className='dark:bg-[#38664a] bg-gray-400 justify-center items-center rounded-3xl' 
            >
                <MaterialIcons 
                    name='queue-music'
                    size={0.15 * width}
                    color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
                />
            </View>
        )}

        <View className='justify-center items-center' style={{ width: 0.45 * width }}>
            <Text 
                className='dark:text-light text-dark'
                style={{ fontSize: 0.04* width }}
            >
                {title}
            </Text>

            <Text 
                className='dark:text-light text-dark opacity-50'
                style={{ fontSize: 0.03* width }}
            >
                {`${playlist?.songs?.length} songs [${time}]`}
            </Text>
        </View>
     </TouchableOpacity>
    )
})

export default PlaylistItem