import { useLang } from 'app/hooks/useLang'
import { width } from 'app/utils/constants'
import { FC } from 'react'
import { Text, View } from 'react-native'

const EmptyList: FC = () => {
    const { i18n } = useLang()

    return (
     <View>
        <View className='flex-row justify-center items-center opacity-40 mb-[5%]'>
            <Text className='dark:text-white text-[#2b2b29] m-[2.5%] font-semibold text-center'>
                {i18n.t("loading")}
                </Text>
            <View className='rounded-full animate-spin' style={{width: 0.12 * width, height: 0.12 * width}}>
                <Text className='dark:text-white text-[#2b2b29] m-[2.5%] font-semibold text-center'>
                    ...
                </Text>
            </View>
        </View>
        <Text className='dark:text-white text-[#2b2b29] m-[2.5%] font-semibold text-center'>
            {i18n.t("music.emptyMusicList")}
        </Text>
     </View>
    )
}
export default EmptyList