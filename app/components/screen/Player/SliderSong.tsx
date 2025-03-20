import { FC } from 'react'
import { Text, View } from 'react-native'
import Slider from '@react-native-community/slider'
import { useColorScheme } from 'nativewind'
import { formatDuration } from 'app/utils/formatDuration'
import { width } from 'app/utils/constants'

interface ISliderSong {
    playbackPosition: number
    playbackDuration: number
    onSlidingComplete: (value: number) => void
}

const SliderSong: FC<ISliderSong> = ({ playbackDuration, playbackPosition, onSlidingComplete }) => {
    const { colorScheme } = useColorScheme()
    const calculateSeekBar = () => {
        if(playbackDuration != 0 && playbackPosition != 0) {
            if(playbackDuration == undefined ||playbackPosition == undefined ) return 0
            return playbackPosition / playbackDuration
        }
        return 0
    }

    const timePosition = formatDuration(playbackPosition as any)
    const timeDuration = formatDuration(playbackDuration as any)


    return (
      <View className='my-[5%]'>
        <Slider
            style={{width: width, height: 0.07 * width}}
            value={calculateSeekBar()}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={colorScheme == 'dark' ? "#ffe600" : "#4287f5"}
            maximumTrackTintColor={colorScheme == 'dark' ?  "#FFFFFF" : "#000000"}
            thumbTintColor={colorScheme == 'dark' ? "#ffe600" : "#4287f5"}
            onSlidingComplete={onSlidingComplete}
        />

        <View className='justify-between items-center flex-row mx-[2%] opacity-60'>
            <Text className='dark:text-light text-dark' 
                style={{ fontSize: 0.03 * width }}    
            >
                {timePosition}
            </Text>

            <Text className='dark:text-light text-dark' 
                style={{ fontSize: 0.03 * width }}    
            >
                {timeDuration}
            </Text>
        </View>
    </View>
    )
}
export default SliderSong