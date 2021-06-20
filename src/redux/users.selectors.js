export const getUsersSelector = (state) => {
    return state.usersPage.users
}

export const getPageSize = (state) => {
    return state.usersPage.pageSize
}

export const getTotalUsersCountSelector = (state) => {
    return state.usersPage.totalUsersCount
}

export const getCurrentPage = (state) => {
    return state.usersPage.currentPage
}

export const getIsFetching = (state) => {
    return state.usersPage.isFetching
}

export const getFollowingIsFetching = (state) => {
    return state.usersPage.followingIsFetching
}

export const getCurrentFilter = (state) => {
    return state.usersPage.filter
}