import {colors} from "../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {showToast} from "../utils/toast.util";

const SET_NIGHT_MODE = 'theme/SET_NIGHT_MODE'

const initialState = {
    nightMode: false,
    colors: colors(false)
}

export const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NIGHT_MODE:
            return {
                ...state,
                nightMode: action.payload.nightMode,
                colors: colors(action.payload.nightMode)
            }
        default:
            return state
    }
}

export const actions = {
    setNightMode: (nightMode) => ({type: SET_NIGHT_MODE, payload: {nightMode}})
}

export const changeMode = (nightMode) => async dispatch => {
    let value
    try {
        if (nightMode) {
            value = '1'
        }
        if (!nightMode) {
            value = '0'
        }
        dispatch(actions.setNightMode(nightMode))
        await AsyncStorage.setItem('nightMode', value)
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    }
}