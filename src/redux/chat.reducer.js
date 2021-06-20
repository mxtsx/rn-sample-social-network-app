import {chatApi} from "../api/chat.api";
import {v4} from 'uuid';
import {arraysAreEqualUtil} from "../utils/arrays-are-equal.util";

const CHAT_MESSAGES_RECEIVED = 'chat/CHAT_MESSAGES_RECEIVED'
const SET_STATUS = 'chat/SET_STATUS'
const SET_IS_ADDED = 'chat/SET_IS_ADDED'

const initialState = {
    messages: [],
    isAdded: false,
    status: ''
}

export const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case CHAT_MESSAGES_RECEIVED:
            if ((!state.messages[state.messages.length - 1] && (!arraysAreEqualUtil(state.messages, action.payload.messages) || (action.payload.messages.length <= 3)))
                || (state.messages[state.messages.length - 1] && (action.payload.messages.length === 1))
                || ((state.messages.length === 100 && action.payload.messages.length === 101))) {
                return {
                    ...state,
                    messages: [...state.messages, ...action.payload.messages.map(m => ({...m, id: v4()}))]
                        .filter((m, index, array) => index >= array.length - 100)
                }
            }
            if (state.messages[state.messages.length - 1]
                && (!arraysAreEqualUtil(state.messages, action.payload.messages))) {
                return {
                    ...state,
                    messages: [...state.messages, ...action.payload.messages.slice(state.messages.length).map(m => ({
                        ...m,
                        id: v4()
                    }))]
                }
            }
            return {...state, messages: state.messages}
        case SET_STATUS:
            return {
                ...state,
                status: action.payload.status
            }
        case SET_IS_ADDED:
            return {
                ...state,
                isAdded: action.payload.isAdded
            }
        default:
            return state
    }
}

export const actions = {
    messagesReceived: (messages) => ({type: CHAT_MESSAGES_RECEIVED, payload: {messages}}),
    statusChanged: (status) => ({type: SET_STATUS, payload: {status}}),
    messagesAdded: (isAdded) => ({type: SET_IS_ADDED, payload: {isAdded}})
}

let _newMessageHandler = null
const newMessageHandlerCreator = (dispatch) => {
    if(_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(actions.messagesReceived(messages))
            dispatch(actions.messagesAdded(true))
        }
    }
    return _newMessageHandler
}

let _newStatusHandler = null
const newStatusHandlerCreator = (dispatch) => {
    if(_newStatusHandler === null) {
        _newStatusHandler = (status) => {
            dispatch(actions.statusChanged(status))
            dispatch(actions.messagesAdded(false))
        }
    }
    return _newStatusHandler
}

export const startMessagesListening = () => async (dispatch) => {
    try {
        chatApi.start()
        await chatApi.subscribe("sendMessage", newMessageHandlerCreator(dispatch))
        await chatApi.subscribe("setStatus", newStatusHandlerCreator(dispatch))
    } catch (e) {
        console.log(e)
    }
}

export const stopMessagesListening = () => async (dispatch) => {
    try {
        chatApi.stop()
        await chatApi.unsubscribe("sendMessage", newMessageHandlerCreator(dispatch))
        await chatApi.unsubscribe("setStatus", newStatusHandlerCreator(dispatch))
    } catch (e) {
        console.log(e)
    }
}


export const sendMessageToChat = (message) => async (dispatch) => {
    try {
        await chatApi.sendMessage(message)
    } catch (e) {
        console.log(e)
    }
}
