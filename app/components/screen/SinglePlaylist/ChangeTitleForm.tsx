import { FC } from 'react'
import { TextInput, View } from 'react-native'
import PlaylistButton from './PlaylistButton'

interface IChangeTitleForm {
    title: string
    onChangeTitle: (value: string) => void
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

const ChangeTitleForm: FC<IChangeTitleForm> = ({ title, onChangeTitle, setValue, value }) => {
    return (
        <View className='justify-center items-center mb-[7%]'>
            <TextInput 
                className='dark:text-light text-dark w-[90%] p-[2%] mb-[2%] border border-green-400 border-opacity-50 rounded-md'
                value={value}
                onChangeText={(text) => setValue(text)}
            />

            <PlaylistButton name='save' text='Save' onPress={() => onChangeTitle(value)} bg='#088c11'  />
        </View>
    )
}

export default ChangeTitleForm