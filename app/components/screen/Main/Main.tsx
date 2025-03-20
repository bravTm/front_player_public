import { FC, memo, useState } from 'react'

import Layout from 'app/components/ui/Layout'
import AudioList from 'app/components/ui/AudioList/AudioList'
import { useSongsAndPlaySettings } from 'app/hooks/useSongsAndPlaySettings'
import TopSongs from './TopSongs'
import { height } from 'app/utils/constants'
import { ISong } from 'app/types/song.types'


const Main: FC = memo(() => {
  const [isTopShow, setIsTopShow] = useState(false)
  const { songs } = useSongsAndPlaySettings()


  // const songs = [
  //   {
  //     filename: "Автор 1 - Песня 1.mp3",
  //     id: 100,
  //     duration: 248
  //   },
  //   {
  //     filename: "Автор 2 - Песня 2.mp3",
  //     id: 101,
  //     duration: 221
  //   },
  //   {
  //     filename: "Автор 3 - Песня 3.mp3",
  //     id: 103,
  //     duration: 175
  //   },
  //   {
  //     filename: "Автор 4 - Песня 4.mp3",
  //     id: 104,
  //     duration: 237
  //   },
  //   {
  //     filename: "Автор 5 - Песня 5.mp3",
  //     id: 105,
  //     duration: 122
  //   },
  //   {
  //     filename: "Автор 6 - Песня 6.mp3",
  //     id: 106,
  //     duration: 106
  //   },
  //   {
  //     filename: "Автор 7 - Песня 7.mp3",
  //     id: 107,
  //     duration: 298
  //   },
  //   {
  //     filename: "Автор 8 - Песня 8.mp3",
  //     id: 108,
  //     duration: 245
  //   },
  //   {
  //     filename: "Автор 9 - Песня 9.mp3",
  //     id: 109,
  //     duration: 240
  //   },
  //   {
  //     filename: "Автор 10 - Песня 10.mp3",
  //     id: 110,
  //     duration: 139
  //   }
  // ]

  return (
    <Layout>
      {/* <TopSongs setIsTopShow={setIsTopShow}/> */}
      <AudioList songs={songs as any} manualHeight={isTopShow ? 0.46 * height : undefined} />
    </Layout>
  )
})

export default Main