import { FC, useEffect, useState } from 'react'
import { Platform, Text, TextInput, View, PushNotification } from 'react-native'
import Layout from 'app/components/ui/Layout';
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import TextField from 'app/components/ui/TextField/TextField';
import { rapidApiHost, rapidApiKey } from 'app/config/api-keys.config';



const DownloadMusic: FC = () => {
    const [text, setText] = useState("")


    const download = async () => {
    //    const videoId = "nvg2dDGKgZI"
    const videoId = "HkIKDqzI3sQ"
       const fetchApi = fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": rapidApiKey,
                "x-rapidapi-host": rapidApiHost
            }
       })

       const fetchResponse = await (await fetchApi).json()

       console.log(fetchResponse?.link)

       if(fetchResponse?.status == "ok") {
            const result = await FileSystem.downloadAsync(
                fetchResponse?.link,
                FileSystem.documentDirectory + videoId + ".mp3"
            )

            console.log(result)
       }
    }

    


    return (
     <Layout>
        <View className='justify-center items-center'>
            <TextField text={text} setText={setText} />

            <Text
                className='text-white'
                // onPress={showLocalNotification}
            >
                DownloadMusic
            </Text>

        </View>
     </Layout>
    )
}
export default DownloadMusic