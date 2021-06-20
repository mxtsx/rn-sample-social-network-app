import {dialogsApi} from "../api/dialogs.api";
import {showToast} from "../utils/toast.util";
import {errorActions} from "./error.reducer";

const SET_IS_LOADING = 'dialogs/SET_IS_LOADING'
const GET_DIALOGS = 'dialogs/GET_DIALOGS'
const GET_MESSAGES = 'dialogs/GET_MESSAGES'
const GET_NEXT_PAGE_MESSAGES = 'dialogs/GET_NEXT_PAGE_MESSAGES'
const GET_NEW_MESSAGE = 'dialogs/GET_NEW_MESSAGE'
const CLEAR_MESSAGES = 'dialogs/CLEAR_MESSAGES'
const ADD_TO_REMOVED = 'dialogs/ADD_TO_REMOVED'
const CLEAR_REMOVED = 'dialogs/CLEAR_REMOVED'
const REMOVE_MESSAGE = 'dialogs/REMOVE_MESSAGE'

const initialState = {
    dialogs: [],
    messages: null,
    areNextPageMessages: null,
    removed: [],
    newMessages: {},
    isLoading: false
}

export const dialogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DIALOGS:
            return {
                ...state,
                dialogs: action.payload.dialogs
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        case GET_MESSAGES:
            return {
                ...state,
                messages:
                    !!state.messages
                        ? [...action.payload.messages.filter(m => !state.messages?.some(el => el.id === m.id)), ...state.messages]
                        : action.payload.messages

            }
        case GET_NEXT_PAGE_MESSAGES:
            return {
                ...state,
                areNextPageMessages: !!action.payload.messages.length
            }
        case GET_NEW_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages.filter(m => !state.messages?.some(el => el.id === m.id))]
            }
        case CLEAR_MESSAGES:
            return {
                ...state,
                messages: null,
                areNextPageMessages: null
            }
        case ADD_TO_REMOVED:
            return {
                ...state,
                removed: [...state.removed, action.payload.id]
            }
        case CLEAR_REMOVED:
            return {
                ...state,
                removed: state.removed.filter(i => !i)
            }
        case REMOVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter(m => m.id !== action.payload.id)
            }
        default:
            return state
    }
}

export const actions = {
    dialogsReceived: (dialogs) => ({type: GET_DIALOGS, payload: {dialogs}}),
    messagesReceived: (messages) => ({type: GET_MESSAGES, payload: {messages}}),
    nextPageMessagesReceived: (messages) => ({type: GET_NEXT_PAGE_MESSAGES, payload: {messages}}),
    newMessageReceived: (messages) => ({type: GET_NEW_MESSAGE, payload: {messages}}),
    messagesCleared: () => ({type: CLEAR_MESSAGES}),
    isLoadingChanged: (isLoading) => ({type: SET_IS_LOADING, payload: {isLoading}}),
    addToRemoved: (id) => ({type: ADD_TO_REMOVED, payload: {id}}),
    removedCleared: () => ({type: CLEAR_REMOVED}),
    messageRemoved: (id) => ({type: REMOVE_MESSAGE, payload: {id}})
}

export const getDialogs = () => async dispatch => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.isLoadingChanged(true))
    try {
        const res = await dialogsApi.getDialogs()
        if(res.status === 200) {
            dispatch(actions.dialogsReceived(res.data))
        }
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.isLoadingChanged(false))
    }
}

export const getMessages = (id, page, count) => async dispatch => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.isLoadingChanged(true))
    try {
        const res = await dialogsApi.getDialog(id, page, count)
        if(res.status === 200) {
            dispatch(actions.messagesReceived(res.data.items))
        }
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.isLoadingChanged(false))
    }
}

export const getNextPageMessages = (id, page, count) => async dispatch => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.isLoadingChanged(true))
    try {
        const res = await dialogsApi.getDialog(id, page, count)
        if(res.status === 200) {
            dispatch(actions.nextPageMessagesReceived(res.data.items))
        }
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.isLoadingChanged(false))
    }
}

export const getNewMessage = (id, page = 1, count) => async dispatch => {
    dispatch(actions.isLoadingChanged(true))
    try {
        const res = await dialogsApi.getDialog(id, page, count)
        if(res.status === 200) {
            dispatch(actions.newMessageReceived(res.data.items))
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    } finally {
        dispatch(actions.isLoadingChanged(false))
    }
}

export const startChatting = (id) => async dispatch => {
    dispatch(errorActions.errorCleared())
    try {
        await dialogsApi.startDialog(id)
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    }
}

export const sendMessage = (id, message) => async dispatch => {
    try {
        await dialogsApi.sendMessage(id, message)
        await dispatch(getNewMessage(id))
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    }
}

export const addToRemoved = (id) => async dispatch => {
    try {
        const res = await dialogsApi.removeMessage(id)
        if(res.status === 200) {
            showToast('Message was successfully removed!')
            dispatch(actions.addToRemoved(id))
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    }
}

export const restoreMessage = (id) => async dispatch => {
    try {
        const res = await dialogsApi.restoreMessageFromRemoved(id)
        if(res.status === 200) {
            showToast('Message successfully restored!')
            dispatch(actions.removedCleared())
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    }
}

export const removeMessage = (id) => dispatch => {
    try {
        dispatch(actions.messageRemoved(id))
        dispatch(actions.removedCleared())
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    }
}