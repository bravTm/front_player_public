import React, { memo, useEffect } from 'react'
import { FC } from 'react'
import { Text, View } from 'react-native'
import { useTopSongs } from 'app/hooks/useTopSongs'
import AudioList from 'app/components/ui/AudioList/AudioList'
import { useSongsAndPlaySettings } from 'app/hooks/useSongsAndPlaySettings'
import { height, width } from 'app/utils/constants'
import { useLang } from 'app/hooks/useLang'


interface ITopSongs {
    setIsTopShow: React.Dispatch<React.SetStateAction<boolean>>
}

const TopSongs: FC<ITopSongs> = memo(({ setIsTopShow }) => {
    const { i18n } = useLang()
    const { topSongs } = useTopSongs()
    const { songs } = useSongsAndPlaySettings()
  
    const sortTopSongs = topSongs.sort((a, b) => a.listenCount > b.listenCount ? -1 : 1).slice(0, 3)
    // let listTopSongs = [] as any

    // if(!!sortTopSongs) {
    //     listTopSongs = sortTopSongs.map(item => songs.find(song => item.id == song.id))
    // }

    const listTopSongs = [
        {
            albumId: 34599943,
            creationTime: new Date(),
            duration: 189,
            filename: "Автор 5 - Песня 5.mp3",
            height: 100,
            id: 10136450, 
            mediaType: "mp3", 
            modificationTime: '1010',
            uri: "hfghfghgf",
            width: 100
          },
          {
            albumId: 3454453,
            creationTime: new Date(),
            duration: 95,
            filename: "Автор 6 - Песня 6.mp3",
            height: 100,
            id: 101034, 
            mediaType: "mp3", 
            modificationTime: '1010',
            uri: "hfghfghgf",
            width: 100
          },
          {
            albumId: 3455657864434,
            creationTime: new Date(),
            duration: 154,
            filename: "Автор 7 - Песня 7.mp3",
            height: 100,
            id: 10132437820, 
            mediaType: "mp3", 
            modificationTime: '1010',
            uri: "hfghfghgf",
            width: 100
          },
    ]

    useEffect(() => {
        if(listTopSongs?.length > 2) setIsTopShow(true)
        else setIsTopShow(false)
    }, [listTopSongs])

    return listTopSongs.length > 0 ? (
     <View className='mb-[4%] dark:bg-[#524f47] bg-[#5bf083] mx-[1.5%] rounded-xl' style={{height: 0.28 * height}}>
        <Text 
            className='dark:text-[#e3b32d] text-[#785505] text-center mb-[2%] font-bold'
            style={{ fontSize: 0.05 * width }}
        >
            {i18n.t("topSongs.title")}
        </Text>

        {sortTopSongs ? (
            <AudioList songs={listTopSongs} manualHeight={0.1 * height} isSearch={false}/>
        ): <></>}
     </View>
    ) : <></>
})

export default TopSongs