import { FC } from 'react'
import { Pressable, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useLang } from 'app/hooks/useLang'
import { useColorScheme } from 'nativewind'
import LeftSideItem from './LeftSideItem'
import { width } from 'app/utils/constants'

interface ILangItem {
    onPress: (lang: string) => void
}

const LangItem: FC<ILangItem> = ({ onPress }) => {
    const { i18n, language } = useLang()
    const { colorScheme } = useColorScheme()

    return (
     <View className='flex justify-between items-center flex-row p-[4%] px-[5%]'>
        <LeftSideItem colorScheme={colorScheme} i18n={i18n} icon="translate" title="lang" />

        <Pressable onPress={() => onPress(language == 'ru' ? 'en' : 'ru')}>
            <View className='flex justify-between items-center flex-row'>
                <Text
                    className='dark:text-light text-dark'
                    style={{fontSize: 0.04 * width}}
                >
                    {language == 'ru' ? "Русский" : "English"}
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
export default LangItem