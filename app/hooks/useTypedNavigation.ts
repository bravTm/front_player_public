import { useNavigation, NavigationProp } from '@react-navigation/native'
import { TypeRootStackParamList } from 'app/navigate/navigation.types'

export const useTypedNavigation = () => useNavigation<NavigationProp<TypeRootStackParamList>>()