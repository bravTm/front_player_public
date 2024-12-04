import { bindActionCreators } from "@reduxjs/toolkit"
import { allActions } from "app/store/allActions"
import { useDispatch } from "react-redux"

export const useActions = () => {
    const dispatch = useDispatch()

    return bindActionCreators(allActions, dispatch)
}