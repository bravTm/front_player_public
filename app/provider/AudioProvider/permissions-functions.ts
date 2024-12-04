import { Alert, BackHandler } from "react-native"
import * as MediaLibrary from "expo-media-library"
import { I18n } from "i18n-js"
import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { IReduxSongs } from "app/store/songs/songs.slice"


type typeInitialize = ActionCreatorWithPayload<IReduxSongs, "songs/initialize">


// -------------- START SECTION: PERMISSION/GET AUDIOS FROM DEVICE -------------
const getAudioFiles = async (initialize: typeInitialize) => {
  let media = await MediaLibrary.getAssetsAsync({
    mediaType: "audio",
    sortBy: "modificationTime"
  })

  media = await MediaLibrary.getAssetsAsync({
    mediaType: "audio",
    first: media.totalCount,
    sortBy: "modificationTime"
  })

  initialize({ songs: media.assets, totalCount: media.totalCount })
}


const permissionAlert = (i18n: I18n, initialize: typeInitialize) => {
  Alert.alert(i18n.t("permission.title"), i18n.t("permission.text"), 
    [{
      text: i18n.t("permission.ready"),
      onPress: () => getPermission(i18n, initialize)
    }, 
    {
      text: i18n.t("permission.cancel"),
      onPress: () => permissionAlert(i18n, initialize)
    }]
  )
}


export const getPermission = async (i18n: I18n, initialize: typeInitialize) => {
  // {"accessPrivileges": "none", "canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
  const permission = await MediaLibrary.getPermissionsAsync()
  

  if(permission.granted) {
      // we want to get all the audio files
      getAudioFiles(initialize)
  }

  if(!permission.granted && permission.canAskAgain) {
    const { status, canAskAgain} =  await MediaLibrary.requestPermissionsAsync()

    if(status === 'denied' && canAskAgain) {
      // we are going to display alert that user must allow this permission to work this app
      permissionAlert(i18n, initialize)
    } 

    if(status === 'granted') {
      getAudioFiles(initialize)
    }

    if(status === 'denied' && !canAskAgain) {
      // we want to display some error to the user
      // just exit app
      BackHandler.exitApp()
    } 
  }
}

  // -------------- END SECTION: PERMISSION/GET AUDIOS FROM DEVICE -------------