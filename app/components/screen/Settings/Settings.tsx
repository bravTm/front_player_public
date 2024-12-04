import { setStorage } from 'app/utils/storage'
import { FC } from 'react'
import { View } from 'react-native'
import { useLang } from 'app/hooks/useLang'
import LangItem from './LangItem'
import ThemeItem from './ThemeItem'
import Layout from 'app/components/ui/Layout'
import Footer from 'app/components/ui/Footer/Footer'


const Settings: FC = () => {
    const { setLanguage } = useLang()

    const changeLang = (lang: string) => {
        setStorage('lang', lang)
        setLanguage(lang)
    }

    return (
     <Layout>
        <View className='h-[100vh] w-[100wh]'>
            <Footer />
            <LangItem onPress={changeLang} />
            <ThemeItem />
        </View>

     </Layout>
    )
}
export default Settings