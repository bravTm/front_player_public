import React, { FC } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'

import { width } from 'app/utils/constants'
import { TypeMaterialIconNames } from 'app/types/icon.types'

interface IPlaylistButton {
    onPress: () => void
    bg?: string
    name: TypeMaterialIconNames
    text: string
}

const PlaylistButton: FC<IPlaylistButton> = ({ name, onPress, text, bg="#2b3052" }) => {
    return (
        <TouchableOpacity 
            className='flex-row justify-center items-center py-[1.5%] px-[3%] mx-[2%] my-[1%] rounded-md'
            style={{ backgroundColor: bg }}
            activeOpacity={0.75}
            onPress={onPress}
        >
            <MaterialIcons 
                name={name}
                size={0.07 * width}
                color={"#edebe6"}
            />
            <Text className='text-light ml-[1%]' style={{ fontSize: 0.033 * width }}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}
export default PlaylistButton