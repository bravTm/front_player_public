import { FC } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { IMenuItem } from './menu.interface'
import { useLang } from 'app/hooks/useLang'
import { MaterialIcons } from '@expo/vector-icons'
import { TypeRootStackParamList } from 'app/navigate/navigation.types'
import cn from 'clsx'
import { width } from 'app/utils/constants'


interface IMenuItemProps {
    item: IMenuItem
    nav:  (screenName: keyof TypeRootStackParamList) => void
    currentRoute?: string
}


const MenuItem: FC<IMenuItemProps> = ({ item, nav, currentRoute }) => {
    const { i18n } = useLang()
    const { colorScheme } = useColorScheme()
    const isActive = currentRoute == item.path

    return (
    <Pressable 
        onPress={() => nav(item.path)} 
        className={cn('w-[25%] flex justify-center items-center', {
        "text-red": isActive
    })}> 
        <View className={cn('flex justify-center items-center')}>
            <MaterialIcons 
                name={item.iconName}
                size={0.055 * width}
                color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
                className='font-bold'
                style={{
                    color: colorScheme == 'dark' && isActive ? "white" : 
                    colorScheme == 'dark' && !isActive ? "gray" : 
                    colorScheme == 'light' && isActive ? "blue" : "gray"
                }}
            />

            <Text className='dark:color-white ml-2'
                style={{fontSize: 0.03 * width,
                    color: colorScheme == 'dark' && isActive ? "white" : 
                    colorScheme == 'dark' && !isActive ? "gray" : 
                    colorScheme == 'light' && isActive ? "blue" : "gray"
                }}
            >
                {i18n.t(`bottomMenu.${item.path}`)}
            </Text>
        </View>
    </Pressable>
    )
}
export default MenuItem