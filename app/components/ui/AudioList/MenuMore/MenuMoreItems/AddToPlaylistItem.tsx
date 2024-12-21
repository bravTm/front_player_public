import { FC, memo, useState } from 'react'
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from 'nativewind'

import EmptyList from '../../EmptyList'
import PlaylistItem from 'app/components/screen/Playlists/PlaylistItem'
import { MaterialIcons } from '@expo/vector-icons'
import PlaylistButton from 'app/components/screen/SinglePlaylist/PlaylistButton'

import { width } from 'app/utils/constants'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import { ISong } from 'app/types/song.types'
import { setAsyncStorage } from 'app/utils/storage'
import cn from 'clsx'
import { usePlaylists } from 'app/hooks/usePlaylists'

interface IAddToPlaylistItem {
    icon: TypeMaterialIconNames
    title: string
    song: ISong
}

const AddToPlaylistItem: FC<IAddToPlaylistItem> = memo(({ icon, title, song}) => {
    const [isShow, setIsShow] = useState(false)
    const [arrayOfPlaylists, setArrayOfPlaylists] = useState<any[]>([])
    const { colorScheme } = useColorScheme()
    const { playlists, setPlaylists } = usePlaylists()


    const toggleArrayOfPlaylists = (title: string) => {
        if(arrayOfPlaylists.includes(title)) {
            setArrayOfPlaylists(arrayOfPlaylists.filter((item) => item != title))
        }
        else setArrayOfPlaylists([...arrayOfPlaylists, title])
    }

    const addSongToPlaylists = () => {
        const newPlaylists = playlists.map((item) => {
            if(arrayOfPlaylists.includes(item.title)) {
                const isExist = item.songs?.some((item) => item.id == song?.id)
                if(isExist) return item
                return {
                    title: item.title,
                    image: item.image,
                    playlistDuration: item.playlistDuration + song.duration,
                    songs: [...item.songs, song],
                    date: item.date
                }
            }
            return item
        })
        
        setPlaylists(newPlaylists)
        setAsyncStorage("playlists", JSON.stringify(newPlaylists))
        setArrayOfPlaylists([])
        setIsShow(false)
    }


    return (
     <TouchableOpacity
        className='dark:bg-[#2a2b2b] bg-[#bfbdb6] rounded-sm flex-row justify-start items-center py-[3%] border-b border-b-gray-600 border-opacity-5'
        activeOpacity={0.8}
        onPress={() => setIsShow(!isShow)}
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

        {isShow ? (
            <Modal>
                <View className='h-full w-full dark:bg-dark bg-gray-400'>
                    <PlaylistButton name='playlist-add' onPress={addSongToPlaylists} text='Add to Playlists'/>

                    <FlatList 
                        ListEmptyComponent={EmptyList}
                        data={playlists}
                        numColumns={2}
                        className='mt-[5%]'
                        // style={{ height: 0.76 * height }}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                className={cn({
                                    "opacity-55": !arrayOfPlaylists.includes(item.title)
                                })}
                                onPress={() => toggleArrayOfPlaylists(item.title)}
                                key={item.title} 
                            >
                                <PlaylistItem playlist={item} disabled />
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </Modal>
        ) : <></>}
     </TouchableOpacity>
    )
})

export default AddToPlaylistItem