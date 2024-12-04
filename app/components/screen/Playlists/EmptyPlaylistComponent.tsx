import { FC } from 'react'
import { Text, View } from 'react-native'
import { useLang } from 'app/hooks/useLang'
import { width } from 'app/utils/constants'
import { MaterialIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'

const EmptyPlaylistComponent: FC = () => {
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()

    return (
     <View className='justify-center items-center' style={{ height: 0.4 * width }}>
        <MaterialIcons 
            name='north-east'
            size={0.1 * width}
            color={colorScheme == "dark" ? "#fcba03" : "#030bfc"}
            className='mb-[5%] font-bold'
        />

        <Text 
            className='dark:text-light text-dark font-semibold'
            style={{ fontSize: 0.04 * width }}
        >
            {i18n.t("playlists.emptyPlaylistList")}
        </Text>
     </View>
    )
}
export default EmptyPlaylistComponent