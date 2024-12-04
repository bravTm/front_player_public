import { FC, memo } from 'react'
import { useSongs } from 'app/hooks/useSongs'

import Layout from 'app/components/ui/Layout'
import AudioList from 'app/components/ui/AudioList/AudioList'


const Main: FC = memo(() => {
  const { songs } = useSongs()

  return (
    <Layout>
      <AudioList songs={songs as any} />
    </Layout>
  )
})

export default Main