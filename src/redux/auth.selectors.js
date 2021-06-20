export const getId = (state) => {
    return state.auth.id
}

export const getEmail = (state) => {
    return state.auth.email
}

export const getLogin = (state) => {
    return state.auth.login
}

export const getAuth = (state) => {
    return state.auth.auth
}

export const getCaptchaUrl = (state) => {
    return state.auth.captchaURL
}

export const getIsLoading = (state) => {
    return state.auth.isLoading
}

export const getError = (state) => {
    return state.auth.error
}