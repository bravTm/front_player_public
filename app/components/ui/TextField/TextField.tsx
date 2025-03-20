import { FC } from 'react'
import { TextInput } from 'react-native'

interface ITextField {
    text: string
    setText:  (value: React.SetStateAction<string>) => void
    placeholder?: string
}

const TextField: FC<ITextField> = ({ setText, text, placeholder }) => {
    return (
        <TextInput 
            placeholder={placeholder} 
            value={text}
            onChangeText={(text) => setText(text)}
            className='dark:bg-[#3b3a38] dark:border-gray-500 dark:placeholder:text-gray-200 dark:text-gray-100
            bg-[#e8e6df] border-gray-500 placeholder:text-gray-700 placeholder:text-opacity-50
            border border-opacity-10 mb-[5%] p-[3%] w-[95%] rounded-full '
        /> 
    )
}
export default TextField