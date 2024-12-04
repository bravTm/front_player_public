import { FC } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useColorScheme } from 'nativewind'
import * as Sharing from 'expo-sharing';

import { width } from 'app/utils/constants'
import { MaterialIcons } from '@expo/vector-icons'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import cn from 'clsx'

interface IShareMusicItem {
    icon: TypeMaterialIconNames
    title: string
    uri: string
    last?: boolean
}

const ShareMusicItem: FC<IShareMusicItem> = ({ icon, title, uri, last = false }) => {
    const { colorScheme } = useColorScheme()

    const onShare = () => {
        Sharing.shareAsync(uri)
    }

    return (
     <TouchableOpacity 
        className={cn('dark:bg-[#2a2b2b] bg-[#bfbdb6] rounded-sm flex-row justify-start items-center py-[3%]', {
            "border-b border-b-gray-600 border-opacity-5": !last
        })}
        onPress={onShare} 
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
export default ShareMusicItem