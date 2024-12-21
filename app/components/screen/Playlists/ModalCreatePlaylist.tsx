import { FC, memo, useState } from 'react'
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useLang } from 'app/hooks/useLang'

import { MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'

import { height, width } from 'app/utils/constants'
import { useColorScheme } from 'nativewind'
import { getAsyncStorage, setAsyncStorage } from 'app/utils/storage'
import { pickImage } from 'app/utils/pickImage'
import { usePlaylists } from 'app/hooks/usePlaylists'

interface IModalCreatePlaylist {
    isVisible: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}


const ModalCreatePlaylist: FC<IModalCreatePlaylist> = memo(({ isVisible, setIsVisible }) => {
    const [inputValue, setInputValue] = useState("")
    const [imageUri, setImageUri] = useState("")
    const { colorScheme } = useColorScheme()
    const { i18n } = useLang()
    const { setPlaylists } = usePlaylists()

    const onSubmit = async () => {
        let storage_playlists = await getAsyncStorage("playlists")
        
        if(!storage_playlists) {
            storage_playlists = [] as any
        }
        else {
            storage_playlists = JSON.parse(storage_playlists)
        }

        // @ts-ignore
        const isExistYet = storage_playlists.some(item => item.title == inputValue)

        if(isExistYet) {
            Alert.alert(i18n.t("addPlaylist.isPlaylistAlreadyExistTitle"))
            return
        }

        if(inputValue == "") {
            Alert.alert(i18n.t("addPlaylist.blankFieldException"))
            return
        }

        // @ts-ignore
        storage_playlists.push({
            date: new Date(),
            title: inputValue,
            playlistDuration: 0,
            songs: [],
            image: imageUri
        })

        
        setPlaylists(storage_playlists as any)
        setAsyncStorage('playlists', JSON.stringify(storage_playlists))
        setInputValue("")
        setImageUri("")
        setIsVisible(false)
    }
    

    const closeWindow = () => {
        setInputValue("")
        setImageUri("")
        setIsVisible(false)
    }

    const pickImageAsync = async () => {
        const result = await pickImage()

        if(!!result.assets) {
            if(result.assets.length > 0) {
                setImageUri(result.assets[0].uri)
            }
        }
    }


    return (
     <Modal visible={isVisible} animationType='fade' transparent >
        <View className='h-[100%] justify-center items-center w-full' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

            <View 
                style={{ height: 0.5 * height }}
                className='w-[90%] p-[1%] dark:bg-[#0c3b75] bg-[#0c3b75] rounded-xl border border-white'
            >
                <TouchableOpacity 
                    className='justify-end items-end mr-[2%] mt-[2%]'
                    onPress={closeWindow}
                >
                    <MaterialIcons 
                        name={"close"}
                        size={0.06 * width}
                        // color={colorScheme == 'dark' ? "#edebe6" : "#4287f5"}
                        color="#edebe6"
                        className='bg-[#d90731] rounded-md p-[0.3%]'
                    />
                </TouchableOpacity>


                <TouchableOpacity 
                    onPress={pickImageAsync}
                    className='justify-center items-center mb-[4%]'
                    activeOpacity={0.75}
                >
                    {imageUri?.length > 0 ? (
                        <Image
                            style={{ width: 0.4 * width, height: 0.4 * width, borderColor: "white" }}
                            source={imageUri}
                            contentFit="cover"
                            transition={1000}
                        />
                    ) : (
                        <View 
                            style={{ width: 0.4 * width, height: 0.4 * width }}
                            className='dark:bg-[#38664a] bg-gray-300 justify-center items-center rounded-3xl' 
                        >
                            <MaterialIcons 
                                name='queue-music'
                                size={0.15 * width}
                                color={colorScheme == 'dark' ? "#edebe6" : "#121211"}
                            />
                            <Text 
                                className='dark:text-light text-dark text-center mb-[5%] opacity-60'
                                style={{ fontSize: 0.03 * width }}
                            >
                                {i18n.t("addPlaylist.tapToSelectImageTitle")}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>


                <TextInput 
                    placeholder={i18n.t("addPlaylist.inputPlaceholder")}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                    placeholderTextColor="#a0a4a8"
                    className='text-light border-b border-green-500 p-[2%]'
                    aria-disabled
                />

                <TouchableOpacity 
                    activeOpacity={0.7}
                    className='justify-center items-center mt-[10%]'
                    onPress={onSubmit}
                >
                    <View className='w-[50%] bg-[#1175f0] p-[2%] rounded-lg'>
                        <Text className='text-center text-white'>
                            {i18n.t("addPlaylist.createButtonTitle")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
     </Modal>
    )
})

export default ModalCreatePlaylist