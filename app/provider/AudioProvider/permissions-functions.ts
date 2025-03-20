import { Alert, BackHandler } from "react-native"
import * as MediaLibrary from "expo-media-library"
import { I18n } from "i18n-js"
import { ISong } from "app/types/song.types"


type setSongsType = React.Dispatch<React.SetStateAction<ISong[]>>
type setTotalCountType = React.Dispatch<React.SetStateAction<number>>


// -------------- START SECTION: PERMISSION/GET AUDIOS FROM DEVICE -------------
const getAudioFiles = async (setSongs: setSongsType, setTotalCount: setTotalCountType) => {
  let media = await MediaLibrary.getAssetsAsync({
    mediaType: "audio",
    sortBy: "modificationTime"
  })

  media = await MediaLibrary.getAssetsAsync({
    mediaType: "audio",
    first: media.totalCount,
    sortBy: "modificationTime"
  })

  setSongs(media.assets as any)
  setTotalCount(media.totalCount)
}


const permissionAlert = (i18n: I18n, setSongs: setSongsType, setTotalCount: setTotalCountType) => {
  Alert.alert(i18n.t("permission.title"), i18n.t("permission.text"), 
    [{
      text: i18n.t("permission.ready"),
      onPress: () => getPermission(i18n, setSongs, setTotalCount)
    }, 
    {
      text: i18n.t("permission.cancel"),
      onPress: () => permissionAlert(i18n, setSongs, setTotalCount)
    }]
  )
}


export const getPermission = async (i18n: I18n, setSongs: setSongsType, setTotalCount: setTotalCountType) => {
  // {"accessPrivileges": "none", "canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
  const permission = await MediaLibrary.getPermissionsAsync()
  
  if(permission.granted) {
    // we want to get all the audio files
    getAudioFiles(setSongs, setTotalCount)
  }

  if(!permission.granted && permission.canAskAgain) {
    const { status, canAskAgain} =  await MediaLibrary.requestPermissionsAsync()

    if(status === 'denied' && canAskAgain) {
      // we are going to display alert that user must allow this permission to work this app
      permissionAlert(i18n, setSongs, setTotalCount)
    } 

    if(status === 'granted') {
      getAudioFiles(setSongs, setTotalCount)
    }

    if(status === 'denied' && !canAskAgain) {
      // we want to display some error to the user
      // just exit app
      BackHandler.exitApp()
    } 
  }
}

  // -------------- END SECTION: PERMISSION/GET AUDIOS FROM DEVICE -------------