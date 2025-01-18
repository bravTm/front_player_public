import { FC, PropsWithChildren } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import cn from 'clsx'
import { ILayout } from 'App'
import FloatPlayer from './FloatPlayer/FloatPlayer'
import { useColorScheme } from 'nativewind'
import { getColor } from 'app/config/colors.config'

const Layout: FC<PropsWithChildren<ILayout>> = ({ children, className, isHasPadding, style }) => {
    const { top } = useSafeAreaInsets()
    const { colorScheme } = useColorScheme()

    return (
        <>
            {/* <SafeAreaView 
                style={{ flex: 1, backgroundColor: colorScheme == 'dark' ? getColor('bgDark') : getColor('bgLight') }}
                edges={["left", "right"]}
            > */}
                <View className={cn('dark:bg-dark bg-light', className, {
                    'px-6': isHasPadding
                })}
                    style={{
                        ...style, 
                        paddingTop: Platform.OS == 'ios' ? top / 4 : 1.1 * top
                    }}
                >
                    {children}
                </View>

                <FloatPlayer />
            {/* </SafeAreaView> */}
        </>
    )
}
export default Layout