export const getMessages = (state) => {
    return state.chat.messages
}

export const getStatus = (state) => {
    return state.chat.status
}

export const getIsAdded = (state) => {
    return state.chat.isAdded
}