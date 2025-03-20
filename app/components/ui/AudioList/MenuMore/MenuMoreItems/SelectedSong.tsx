import { FC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSocket } from 'app/hooks/useSocket'
import { ISong } from 'app/types/song.types'
import { MaterialIcons } from '@expo/vector-icons'
import { width } from 'app/utils/constants'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import { useColorScheme } from 'nativewind'
import { showToast } from 'app/utils/toastShow'
import cn from 'clsx'
import { useLang } from 'app/hooks/useLang'

interface ISelectedSong {
    item: ISong
    icon: TypeMaterialIconNames
    title: string
    last?: boolean
}

const SelectedSong: FC<ISelectedSong> = ({ item, icon, title, last=false }) => {
    const { setSelectedSong } = useSocket()
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()

    const selectSong = () => {
        setSelectedSong(item?.uri as any)
        showToast(i18n.t("menuMore.listerTogetherNotification"))
    }

    return (
    <TouchableOpacity 
        className={cn('bg-[#788a16] rounded-sm flex-row justify-start items-center py-[3%]', {
            "border-b border-b-gray-600 border-opacity-5": !last
        })}
        onPress={selectSong} 
        activeOpacity={0.8}
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
}
export default SelectedSong