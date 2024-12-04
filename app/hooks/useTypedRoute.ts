import { useRoute, RouteProp } from '@react-navigation/native'
import { TypeRootStackParamList } from 'app/navigate/navigation.types'

export const useTypedRoute = <N extends keyof TypeRootStackParamList>() => useRoute<RouteProp<TypeRootStackParamList, N>>()