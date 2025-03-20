import { FC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface IButton {
    onPress: () => void
    className: string
    title: string
    width?: number
}

const Button: FC<IButton> = ({ className, onPress, title, width=80 }) => {
    return (
     <TouchableOpacity onPress={onPress} className={`w-[${width}%]`}>
        <View className={className}>
            <Text className='p-5 text-xl text-center'>
                {title}
            </Text>
        </View>
    </TouchableOpacity>
    )
}
export default Button