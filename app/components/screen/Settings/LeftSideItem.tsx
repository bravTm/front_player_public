import { FC } from 'react'
import { Text, View } from 'react-native'
import { I18n } from 'i18n-js'
import { MaterialIcons } from '@expo/vector-icons'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import { width } from 'app/utils/constants'

interface ILeftSideItem {
    i18n: I18n
    icon: TypeMaterialIconNames
    colorScheme: 'dark' | 'light' | undefined
    title: string
}

const LeftSideItem: FC<ILeftSideItem> = ({ colorScheme, i18n, icon, title }) => {
    return (
    <View className='flex justify-center items-center flex-row'>
        <MaterialIcons 
            name={icon}
            size={0.06 * width}
            color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
            className='p-[3%] dark:bg-dark-gray-light bg-light-gray-light rounded-lg'
        />

        <Text 
            className='dark:text-light text-dark mx-3'
            style={{fontSize: 0.04 * width}}
        >
            {i18n.t(`settings.${title}`)}
        </Text>
    </View>
    )
}
export default LeftSideItem