import * as ImagePicker from 'expo-image-picker'

export const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
        // mediaTypes: ImagePicker.MediaTypeOptions.Images
        mediaTypes: ['images']
    });

    return result
}