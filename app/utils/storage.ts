import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage'

// SECURE STORAGE
export const setStorage = (name: string, value: any) => {
    SecureStore.setItem(name, String(value).toString())
}

export const getStorage = (name: string) => {
    return SecureStore.getItem(name)
}


// ASYNC STORAGE
export const setAsyncStorage = async (name: string, value: any) => {
    return await AsyncStorage.setItem(name, String(value).toString())
}

export const getAsyncStorage = async (name: string) => {
    return await AsyncStorage.getItem(name)
}