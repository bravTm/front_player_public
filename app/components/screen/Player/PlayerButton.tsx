import { FC } from 'react'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { width } from 'app/utils/constants'
import { useColorScheme } from 'nativewind'
import { TypeMaterialIconNames } from 'app/types/icon.types'
import cn from 'clsx'

interface IPlayerButton {
    icon: TypeMaterialIconNames
    onPress: () => void
    isBlur: boolean
}

const PlayerButton: FC<IPlayerButton> = ({ icon, onPress, isBlur }) => {
    const { colorScheme } = useColorScheme()

    return (
     <TouchableOpacity className='mx-[2.5%]' onPress={onPress} disabled={isBlur} >
        <MaterialIcons 
            name={icon}
            size={0.075 * width}
            color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
            className={cn('dark:bg-gray-600 bg-gray-400 p-[3%] rounded-full', {
                "opacity-35" : isBlur,
            })}
        />
     </TouchableOpacity>
    )
}
export default PlayerButton