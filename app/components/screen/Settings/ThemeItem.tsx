import { FC } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import LeftSideItem from './LeftSideItem'
import { useLang } from 'app/hooks/useLang'
import { MaterialIcons } from '@expo/vector-icons'
import { setStorage } from 'app/utils/storage'
import { width } from 'app/utils/constants'


const ThemeItem: FC = () => {
    const { i18n } = useLang()
    const { colorScheme, setColorScheme } = useColorScheme()

    const toggleTheme = async () => {
        setStorage('theme', colorScheme == 'dark' ? 'light' : 'dark')
        setColorScheme(colorScheme == 'dark' ? 'light' : 'dark')
    }

    return (
     <View className='flex justify-between items-center flex-row p-[4%] px-[5%]'>
        <LeftSideItem colorScheme={colorScheme} i18n={i18n} icon='palette' title='theme.main'/>

        <Pressable onPress={toggleTheme}>
            <View className='flex justify-between items-center flex-row'>
                <Text
                    className='dark:text-light text-dark'
                    style={{fontSize: 0.04 * width}}
                >
                    {i18n.t(`settings.theme.${colorScheme}`)}
                </Text>

                <MaterialIcons 
                    name='arrow-forward-ios'
                    size={0.03 * width}
                    color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
                    className='ml-[1%]'
                />
            </View>
        </Pressable>
     </View>
    )
}
export default ThemeItem