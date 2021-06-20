import {authApi} from "../api/auth.api";
import {showToast} from "../utils/toast.util";
import {errorActions} from "./error.reducer";

const LOGIN = 'auth/LOGIN'
const LOGOUT = 'auth/LOGOUT'
const GET_CAPTCHA = 'auth/GET_CAPTCHA'
const SET_ERROR = 'auth/SET_ERROR'
const CLEAR_ERROR = 'auth/CLEAR_ERROR'
const SET_IS_LOADING = 'auth/SET_IS_LOADING'

const initialState = {
    id: null,
    auth: false,
    captchaURL: null,
    error: null,
    isLoading: false
}

export const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                ...action.data,
                captchaURL: null
            }
        case LOGOUT:
            return {
                ...state,
                auth: false
            }
        case GET_CAPTCHA:
            return {
                ...state,
                captchaURL: action.captchaURL
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload.err
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        default:
            return state
    }
}

export const actions = {
    userAuth: (id, auth = false) => ({type: LOGIN, data: {id, auth}}),
    logout: () => ({type: LOGOUT}),
    getCaptcha: (captchaURL) => ({type: GET_CAPTCHA, captchaURL}),
    setIsLoading: (isLoading) => ({type: SET_IS_LOADING, payload: {isLoading}}),
    setError: (err) => ({type: SET_ERROR, payload: {err}}),
    clearError: () => ({type: CLEAR_ERROR})
}

export const userAuthentication = () => async (dispatch) => {
    dispatch(actions.clearError())
    dispatch(actions.setIsLoading(true))
    try {
        const response = await authApi.getAuth()
        if (response.data.resultCode === 0) {
            showToast('Successfully logged in!')
            const {id} = response.data.data
            dispatch(actions.userAuth(id, true))
        } else {
            const message = response.data.messages[0] ? response.data.messages[0] : "Something goes wrong :("
            dispatch(actions.setError(message))
        }
    } catch (e) {
        console.log(e)
        dispatch(actions.setError(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsLoading(false))
    }
}

export const userLogin = (email, password, rememberMe, captcha) => async (dispatch) => {
    dispatch(actions.clearError())
    dispatch(actions.setIsLoading(true))
    try {
        const response = await authApi.login(email, password, rememberMe, captcha)
        if (response.data.resultCode === 0) {
            await dispatch(userAuthentication())
        } else if (response.data.resultCode === 10) {
            await dispatch(setCaptchaUrl())
        } else {
            const message = response.data.messages[0] ? response.data.messages[0] : "Something goes wrong :("
            dispatch(actions.setError(message))
        }
    } catch (e) {
        console.log(e)
        dispatch(actions.setError(e))
    } finally {
        dispatch(actions.setIsLoading(false))
    }
}

export const userLogout = () => async (dispatch) => {
    dispatch(actions.clearError())
    dispatch(actions.setIsLoading(true))
    try {
        const response = await authApi.logout()
        if (response.data.resultCode === 0) {
            showToast('Successfully logged out!')
            dispatch(actions.logout())
            dispatch(errorActions.errorCleared())
        }
    } catch (e) {
        console.log(e)
        dispatch(actions.setError(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsLoading(false))
    }
}

export const setCaptchaUrl = () => async dispatch => {
    dispatch(actions.clearError())
    dispatch(actions.setIsLoading(true))
    try {
        const response = await authApi.captcha()
        const captcha = response.data.url
        dispatch(actions.getCaptcha(captcha))
    } catch (e) {
        console.log(e)
        dispatch(actions.setError(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsLoading(false))
    }
}