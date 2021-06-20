import {profileApi} from "../api/profile.api";
import {usersApi} from "../api/users.api";
import {showToast} from "../utils/toast.util";
import {errorActions} from "./error.reducer";

const SET_USER_PROFILE = 'profile/SET_USER_PROFILE'
const GET_USER_STATUS = 'profile/GET_USER_STATUS'
const SET_IS_FETCHING = 'profile/SET_IS_FETCHING'
const SET_NEW_PHOTO = 'profile/SET_NEW_PHOTO'
const IS_USER_FOLLOWED = 'profile/IS_USER_FOLLOWED'

const initialState = {
    profile: null,
    status: null,
    isFetching: false,
    isFollowed: null,
}

export const profileReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER_PROFILE:
            return {
                ...state,
                profile: action.profile
            }
        case GET_USER_STATUS:
            return {
                ...state,
                status: action.status
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_NEW_PHOTO:
            return {
                ...state,
                profile: {...state.profile, photos: action.photos}
            }
        case IS_USER_FOLLOWED:
            return {
                ...state,
                isFollowed: action.payload.isFollowed
            }
        default:
            return state
    }
}

export const actions = {
    getNewProfile: (profile) => ({type: SET_USER_PROFILE, profile}),
    getUserStatus: (status) => ({type: GET_USER_STATUS, status}),
    setIsFetching: (isFetching) => ({type: SET_IS_FETCHING, isFetching}),
    setNewPhoto: (photos) => ({type: SET_NEW_PHOTO, photos}),
    userIsFollowed: (isFollowed) => ({type: IS_USER_FOLLOWED, payload: {isFollowed}}),
}

export const setUserProfile = (id) => async (dispatch) => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.setIsFetching(true))
    try {
        const response = await profileApi.getProfile(id)
        dispatch(actions.getNewProfile(response.data))
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsFetching(false))
    }
}


export const getCurrentUserStatus = (id) => async (dispatch) => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.setIsFetching(true))
    try {
        let response = await profileApi.getUserStatus(id)
        if(response.data === null) {
            response.data = ''
        }
        dispatch(actions.getUserStatus(response.data))
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsFetching(false))
    }
}


export const setUserStatus = (status) => async (dispatch) => {
    dispatch(actions.setIsFetching(true))
    try {
        const response = await profileApi.updateUserStatus(status)
        if (response.data.resultCode === 0) {
            dispatch(actions.getUserStatus(status))
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsFetching(false))
    }
}


export const setUserProfileUpdate = (profile, id) => async (dispatch) => {
    dispatch(actions.setIsFetching(true))
    try {
        const response = await profileApi.updateProfileInformation(profile)
        if (response.data.resultCode === 0) {
            await dispatch(setUserProfile(id))
            showToast('Profile successfully updated!')
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsFetching(false))
    }
}

export const setNewProfilePhotos = (photo) => async (dispatch) => {
    dispatch(actions.setIsFetching(true))
    try {
        const response = await profileApi.updateProfilePhoto(photo)
        if (response.data.resultCode === 0) {
            dispatch(actions.setNewPhoto(response.data.data.photos))
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setIsFetching(false))
    }
}


export const isUserFollowed = (id) => async (dispatch) => {
    dispatch(errorActions.errorCleared())
    try {
        const response = await usersApi.isFollow(id)
        dispatch(actions.userIsFollowed(response))
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    }
}
