import { FC } from 'react'
import { View } from 'react-native'
import { width } from 'app/utils/constants'

const Line: FC = () => {
    return (
     <View className='w-full dark:bg-light bg-dark  opacity-50 my-[5%]' style={{ height: 0.0015 * width }}>

     </View>
    )
}
export default Line