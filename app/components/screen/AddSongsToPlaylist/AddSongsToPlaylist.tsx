import { FC, useState } from 'react'
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native'
import { usePlaylists } from 'app/hooks/usePlaylists'
import { useSongs } from 'app/hooks/useSongs'
import { useTypedNavigation } from 'app/hooks/useTypedNavigation'
import { useTypedRoute } from 'app/hooks/useTypedRoute'
import { useLang } from 'app/hooks/useLang'
import { useActions } from 'app/hooks/useActions'

import Layout from 'app/components/ui/Layout'
import AddPlaylistAudioItem from 'app/components/ui/AddPlaylistAudioItem/AddPlaylistAudioItem'

import { setAsyncStorage } from 'app/utils/storage'
import { ISong } from 'app/types/song.types'
import { bottomMargin, width } from 'app/utils/constants'
import { MaterialIcons } from '@expo/vector-icons'


const AddSongsToPlaylist: FC = () => {
    // ------- START SECTION: CHECK FOR HAVING A PLAYLIST TO ADD SONGS ---------------------------
    const title = useTypedRoute()?.params?.title
    if(!title) return null

    let { playlists, songsToAdd } = usePlaylists()
    
    const plst = playlists?.map((item) => {
        if(item.title == title) return item
    })
    if(!plst) return null
    
    // START SECTION: CHECK FOR HAVING A PLAYLIST TO ADD SONGS -------------------
    
    
    const { i18n } = useLang()
    const { songs } = useSongs()
    const { navigate } = useTypedNavigation()
    const { setPlaylists, setSongsToAdd } = useActions()
    const [searchText, setSearchText] = useState("")
    const playlist = plst[0]
    
    // удаление тех, которые уже есть в плейлисте
    const filteredSongs = songs.filter(item => !playlist?.songs.filter(y => y.id === item.id).length)

    //@ts-ignore
    const searchSongs = filteredSongs.filter((item: ISong) => item.filename.toLowerCase().includes(searchText.toLowerCase()))


    const addToPlaylist = (addSong: ISong) => {
        if(!songsToAdd.includes(addSong)) setSongsToAdd([...songsToAdd, addSong])
        else setSongsToAdd(songsToAdd.filter((item: any) => item.id != addSong?.id))
    }

    const saveNewPlaylist = () => {
        playlists = playlists.map((item) => {
            if(item.title == playlist?.title) {
                item = {
                    title: item.title,
                    date: item.date,
                    playlistDuration: item.playlistDuration + songsToAdd.reduce((acc, item) => acc + item.duration, 0),
                    songs: [...item.songs, ...songsToAdd],
                    image: playlist?.image
                }
            }
            return item
        })

        setPlaylists(playlists)
        setAsyncStorage("playlists", JSON.stringify(playlists))
        setSongsToAdd([])
        setTimeout(() => {
            navigate("SinglePlaylist", { title: playlist?.title as any })
        }, 500)
    }

    return (
     <Layout>
        <View className='justify-center items-center flex-row h-[10%]'>
            <TextInput 
                placeholder={i18n.t("music.placeholderSearch")} 
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                className='dark:bg-[#3b3a38] dark:border-gray-500 dark:placeholder:text-gray-200 dark:text-gray-100
                bg-[#e8e6df] border-gray-500 placeholder:text-gray-700 placeholder:text-opacity-50
                border border-opacity-10 p-[2.5%] w-[80%] rounded-full '
            /> 

            <TouchableOpacity className='justify-center items-center ml-[2%]' onPress={saveNewPlaylist}>
                <MaterialIcons 
                    name='add'
                    size={0.08 * width}
                    color={"#edebe6"}
                />
            </TouchableOpacity>
        </View>

        <FlatList 
            removeClippedSubviews
            // @ts-ignore
            // data={searchText.length > 2 && searchSongs}
            data={searchSongs}
            initialNumToRender={10}
            windowSize={1}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}: {item: ISong}) => (
                <AddPlaylistAudioItem 
                    addToPlaylist={() => addToPlaylist(item)}
                    item={item} activeId={""} isPlaying={false} key={item.id} 
                />
            )}
            contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: 2 * bottomMargin
            }}
        />
     </Layout>
    )
}

export default AddSongsToPlaylist