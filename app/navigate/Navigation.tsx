import { FC, useEffect, useState } from 'react'
import React from 'react'
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider, useNavigationContainerRef } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'

import Navigator from './Navigator'
import BottomMenu from 'app/components/ui/BottomMenu/BottomMenu'

import { getStorage, setStorage } from 'app/utils/storage'


const Navigation: FC = () => {
	const { colorScheme, setColorScheme } = useColorScheme()

	useEffect(() => {
		const checkTheme = async () => {
			const theme = await getStorage('theme')

			if(theme == null) {
				setStorage('theme', 'dark')
				setColorScheme('dark')
			}
			else setColorScheme(theme as any)
			
		}

		checkTheme();
	}, [])


	const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined)

	const navRef = useNavigationContainerRef()

	useEffect(() => {
		setCurrentRoute(navRef.getCurrentRoute()?.name)
		const listener = navRef.addListener('state', () => setCurrentRoute(navRef.getCurrentRoute()?.name))

		return () => {
			navRef.removeListener('state', listener)
		}
	}, [])


	useEffect(() => {
		setCurrentRoute(navRef.getCurrentRoute()?.name)
		const listener = navRef.addListener('state', () => setCurrentRoute(navRef.getCurrentRoute()?.name))

		return () => {
			navRef.removeListener('state', listener)
		}
	}, [])


    return (
		<ThemeProvider value={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
			<>
				<NavigationContainer ref={navRef}>
					<Navigator />
				</NavigationContainer>

				
				{currentRoute && (
					<>
						<BottomMenu currentRoute={currentRoute} nav={navRef.navigate}/>
					</>
				)}
			</>
		</ThemeProvider>
    )
}
export default Navigation