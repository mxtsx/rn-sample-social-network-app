export const getDialogs = (state) => {
    return state?.dialogs?.dialogs
}

export const getIsLoading = (state) => {
    return state?.dialogs?.isLoading
}

export const getMessages = (state) => {
    return state?.dialogs?.messages
}

export const getNextPageMessages = (state) => {
    return state?.dialogs?.areNextPageMessages
}

export const getNewMessagesAreFetching = (state) => {
    return state?.dialogs?.newMessagesAreFetching
}

export const getRemoved = (state) => {
    return state?.dialogs?.removed
}