import { useLang } from 'app/hooks/useLang'
import { width } from 'app/utils/constants'
import { FC } from 'react'
import { Text, View } from 'react-native'

const Footer: FC = () => {
    const { i18n } = useLang()

    const version = "0.0.1"

    return (
     <View className='bottom-0 mb-[3%]'>
        <Text 
            className='dark:text-light text-dark opacity-40 text-center' 
            style={{ fontSize: 0.033 * width }}
        >
            {i18n.t("footerText") + version}
        </Text>
     </View>
    )
}

export default Footer