import { FC, memo, useCallback, useEffect, useState  } from 'react'
import { ScrollView, Text } from 'react-native'
import { useLang } from 'app/hooks/useLang';

import Layout from 'app/components/ui/Layout';

import { getLyrics } from 'app/utils/getLyrics';
import { bottomMargin } from 'app/utils/constants';
import { getArtistAndTitle } from 'app/utils/getArtistAndTitle';
import { usePlaybackAndAudioPlay } from 'app/hooks/usePlaybackAndAudioPlay';


const KaraokeLyrics: FC = memo(() => {
    const [lyrics, setLyrics] = useState("")
    const [isBad, setIsBad] = useState(false)
    const { currentAudio } = usePlaybackAndAudioPlay()
    const { i18n } = useLang()

    // @ts-ignore
    const filename = currentAudio?.filename.slice(0, currentAudio.filename.lastIndexOf("."))
    let { artist, title } = getArtistAndTitle(filename, i18n.t("music.unknownArtist"))
    

    useEffect(() => {
        const get = async () => {
            if(artist == "Unknown") {
                setIsBad(true)
                return
            }

            const lyr = await getLyrics(artist, title)

            if(lyr == undefined) {
                setIsBad(true)
            }
            else {
                setLyrics(lyr)
            }
        }

        get()
    }, [currentAudio])



    return (
     <Layout>
        <ScrollView contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: bottomMargin
        }}>
            <Text className='text-white text-lg'>
                {!isBad ? lyrics : i18n.t("karaokeLyrics.notFoundLyrics")}
            </Text>
        </ScrollView>
     </Layout>
    )
})

export default KaraokeLyrics