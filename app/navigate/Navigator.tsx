import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FC } from 'react'
import { routes } from './routes'
import { TypeRootStackParamList } from './navigation.types'
import { useColorScheme } from 'nativewind'
import { getColor } from 'app/config/colors.config'

const Stack = createNativeStackNavigator<TypeRootStackParamList>()

const PrivateNavigator: FC = () => {
    const { colorScheme } = useColorScheme()

	return (
        <Stack.Navigator
            screenOptions={{
                contentStyle: {
                    backgroundColor: colorScheme == 'dark' ? getColor("bgDark") : getColor("bgLight"),
                },
                headerShown: false,
                animation: 'fade_from_bottom',
                animationDuration: 10,
            }}
        >

        {routes.map(route => (
            // @ts-ignore
            <Stack.Screen key={route.name} {...route}/>
        ))}

        </Stack.Navigator>
	)
}
export default PrivateNavigator
