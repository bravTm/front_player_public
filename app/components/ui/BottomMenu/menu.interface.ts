import { TypeRootStackParamList } from "app/navigate/navigation.types"
import { TypeFeatherIconNames, TypeMaterialIconNames } from "app/types/icon.types"

export interface IMenuItem {
    iconName: TypeMaterialIconNames
    path: keyof TypeRootStackParamList
}


export type TypeNavigate = (screenName: keyof TypeRootStackParamList) => void