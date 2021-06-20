export const getProfile = (state) => {
    return state.profilePage.profile
}

export const getStatus = (state) => {
    return state.profilePage.status
}

export const getProfileIsFetching = (state) => {
    return state.profilePage.isFetching
}

export const getIsFollowed = (state) => {
    return state.profilePage.isFollowed
}