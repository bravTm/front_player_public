import { FC } from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useLang } from 'app/hooks/useLang';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library"

import { MaterialIcons } from '@expo/vector-icons'

import { width } from 'app/utils/constants'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import cn from 'clsx'

interface IDeleteAudioFromDevice {
    icon: TypeMaterialIconNames
    title: string
    uri: string
    last?: boolean
}

const DeleteAudioFromDevice: FC<IDeleteAudioFromDevice> = ({ icon, title, uri, last = false }) => {
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()

    async function deleteFileAsync() {
        try {
            await FileSystem.deleteAsync(uri);
            console.log('File deleted successfully');
        } catch (error) {
            console.error('Error while deleting file:', error);
        }
    }

    const permissionDeleteSong = () => {
        Alert.alert(i18n.t("permissionDeleteSongFromDevice"), "", [
            { text: i18n.t('cancel') },
            { text: "OK", onPress: deleteFileAsync }
        ])
    }

    return (
     <TouchableOpacity 
        className={cn('bg-[#800612] rounded-sm flex-row justify-start items-center py-[3%]', {
            "border-b border-b-gray-600 border-opacity-5": !last
        })}
        onPress={permissionDeleteSong} 
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
export default DeleteAudioFromDevice