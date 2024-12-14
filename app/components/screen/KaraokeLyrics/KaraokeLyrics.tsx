import { FC, memo, useCallback, useEffect, useState  } from 'react'
import { ScrollView, Text } from 'react-native'
import { useAudioPlay } from 'app/hooks/useAudioPlay';
import { useLang } from 'app/hooks/useLang';

import Layout from 'app/components/ui/Layout';

import { getLyrics } from 'app/utils/getLyrics';
// import { removeSitesFromTitle } from 'app/utils/removeSitesFromTitle';
// import getArtistTitle from 'get-artist-title';
import { bottomMargin } from 'app/utils/constants';
import { getArtistAndTitle } from 'app/utils/getArtistAndTitle';


const KaraokeLyrics: FC = memo(() => {
    const [lyrics, setLyrics] = useState("")
    const [isBad, setIsBad] = useState(false)
    const { currentAudio } = useAudioPlay()
    const { i18n } = useLang()

    // @ts-ignore
    const filename = currentAudio?.filename.slice(0, currentAudio.filename.lastIndexOf("."))
    let { artist, title } = getArtistAndTitle(filename, i18n.t("music.unknownArtist"))
    // let [ artist, title ] = getArtistTitle(filename, {
    //     defaultArtist: i18n.t("music.unknownArtist"),
    // })

    // console.log(filename, artist, title )

    // title = removeSitesFromTitle(title)
    

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