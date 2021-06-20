const SET_ERROR = 'error/SET_ERROR'
const CLEAR_ERROR = 'error/CLEAR_ERROR'

const initialState = {
    error: null
}

export const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const errorActions = {
    errorReceived: (error) => ({type: SET_ERROR, payload: {error}}),
    errorCleared: () => ({type: CLEAR_ERROR})
}