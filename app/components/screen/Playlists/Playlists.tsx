import { FC, useState, memo } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useLang } from 'app/hooks/useLang'

import Layout from 'app/components/ui/Layout'
import ModalCreatePlaylist from './ModalCreatePlaylist'
import PlaylistItem from './PlaylistItem'
import { MaterialIcons } from '@expo/vector-icons'

import { IPlaylist } from 'app/types/playlists.types'
import EmptyPlaylistComponent from './EmptyPlaylistComponent'
import { height, width } from 'app/utils/constants'
import { usePlaylists } from 'app/hooks/usePlaylists'

const Playlists: FC = () => {
    const { i18n } = useLang()
    const [isVisible, setIsVisible] = useState(false)

    const { playlists } = usePlaylists()

    return (
     <Layout>
        <View className='justify-end items-end'>
            <TouchableOpacity 
                className='flex-row bg-[#948b8d] bg-opacity-40 p-[1.5%] rounded-lg mr-[2%]'
                onPress={() => setIsVisible(true)}
                activeOpacity={0.8}
            >
                <Text 
                    className='text-white mr-[1%]' 
                    style={{ fontSize: 0.04 * width }}
                >
                    {i18n.t("addPlaylist.openModalTitle")}
                </Text>

                <MaterialIcons 
                    name={"add-circle"}
                    size={0.06 * width}
                    color={"#edebe6"}
                />
            </TouchableOpacity>
        </View>


        <FlatList 
            ListEmptyComponent={EmptyPlaylistComponent}
            data={playlists?.reverse()}
            numColumns={2}
            className='mt-[5%]'
            style={{ height: 0.76 * height }}
            renderItem={(item: IPlaylist | any) => (
                <PlaylistItem playlist={item?.item} key={item.title}/>
            )}
        />


        <ModalCreatePlaylist isVisible={isVisible} setIsVisible={setIsVisible} />
     </Layout>
    )
}
export default memo(Playlists)