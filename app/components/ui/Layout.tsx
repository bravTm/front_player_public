import { FC, PropsWithChildren } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import cn from 'clsx'
import { ILayout } from 'App'
import FloatPlayer from './FloatPlayer/FloatPlayer'

const Layout: FC<PropsWithChildren<ILayout>> = ({ children, className, isHasPadding, style }) => {
    const { top } = useSafeAreaInsets()

    return (
     <>
        <SafeAreaView className='flex-1'>
            <View className={cn('dark:bg-[#141414] bg-[#ccd2db]', className, {
                'px-6': isHasPadding
            })}
                style={{
                    ...style, 
                    paddingTop: Platform.OS == 'ios' ? top / 4 : top / 1.5
                }}
            >
                {children}
            </View>
        </SafeAreaView>
        <FloatPlayer />

     </>
    )
}
export default Layout