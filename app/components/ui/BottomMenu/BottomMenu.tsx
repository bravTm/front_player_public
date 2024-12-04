import { FC } from 'react'
import { View } from 'react-native'
import { menuItems } from './menu.data'
import MenuItem from './MenuItem'
import { TypeNavigate } from './menu.interface'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface IBottomMenu {
    nav: TypeNavigate
    currentRoute: string
}

const BottomMenu: FC<IBottomMenu> = (props) => {
    const { bottom } = useSafeAreaInsets() // число

    return (
        <View 
            className='pt-3 flex-row justify-center items-center w-full  dark:bg-[#242222] bg-white'
            style={{
                paddingBottom: bottom + 10,
            }}
        >
            {menuItems.map(item => (
                <MenuItem item={item} {...props} key={item.path}/>
            ))}
        </View>
    )
}
export default BottomMenu