import { FC, memo } from 'react'

import Layout from 'app/components/ui/Layout'
import AudioList from 'app/components/ui/AudioList/AudioList'
import { useSongsAndPlaySettings } from 'app/hooks/useSongsAndPlaySettings'


const Main: FC = memo(() => {
  const { songs } = useSongsAndPlaySettings()

  return (
    <Layout>
      <AudioList songs={songs as any} />
    </Layout>
  )
})

export default Main