import {usersApi} from "../api/users.api";
import {showToast} from "../utils/toast.util";
import {errorActions} from "./error.reducer";

const GET_USERS = 'users/GET_USERS'
const GET_TOTAL_USERS_COUNT = 'users/GET_TOTAL_USERS_COUNT'
const FOLLOW_UNFOLLOW_USER = 'users/FOLLOW_UNFOLLOW_USER'
const SET_CURRENT_PAGE = 'user/SET_CURRENT_PAGE'
const SET_FILTER = 'user/SET_FILTER'
const RESET_FILTER = 'user/RESET_FILTER'
const FOLLOWING_IS_FETCHING = 'user/FOLLOWING_IS_FETCHING'
const SET_FETCHING = 'user/SET_FETCHING'

const initialState = {
    users: [],
    pageSize: 6,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingIsFetching: [],
    filter: {
        term: '',
        friend: null
    }
}

export const usersReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage
            }
        case GET_TOTAL_USERS_COUNT:
            return {
                ...state,
                totalUsersCount: action.totalUsers
            }
        case GET_USERS:
            return {
                ...state,
                users: [...action.users]
            }
        case SET_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload
            }
        case RESET_FILTER:
            return {
                ...state,
                filter: {
                    term: '',
                    friend: null
                }
            }
        case FOLLOW_UNFOLLOW_USER:
            return {
                ...state,
                users: state.users.map(u => {
                    if(u.id === action.id) {
                        return {...u, followed: action.followed}
                    }
                    return u
                })
            }
        case FOLLOWING_IS_FETCHING:
            return {
                ...state,
                followingIsFetching: action.isFetching ? [...state.followingIsFetching, action.id]
                : state.followingIsFetching.filter(id => id !== action.id)
            }
        default:
            return state
    }
}

export const actions = {
    setCurrentPage: (currentPage = 1) => ({type: SET_CURRENT_PAGE, currentPage}),
    getNewUsers: (users) => ({type: GET_USERS, users}),
    setFetching: (isFetching) => ({type: SET_FETCHING, isFetching}),
    setFilter: (filter) => ({type: SET_FILTER, payload: filter}),
    resetFilter: () => ({type: RESET_FILTER}),
    followingDataIsFetching: (isFetching, id) => ({type: FOLLOWING_IS_FETCHING, isFetching, id}),
    getTotalUsersCount: (totalUsers) => ({type: GET_TOTAL_USERS_COUNT, totalUsers}),
    followUnfollowUserSuccess: (followed, id) => ({type: FOLLOW_UNFOLLOW_USER, followed, id}),
}


export const getUsers = (pageSize, page, filter) => async (dispatch) => {
    dispatch(errorActions.errorCleared())
    dispatch(actions.setFetching(true))
    try {
        dispatch(actions.setFilter(filter))
        dispatch(actions.setCurrentPage(page))
        const response = await usersApi.getUsers(pageSize, page, filter.term, filter.friend)
        const {items, totalCount} = (response.data)
        dispatch(actions.getNewUsers(items))
        dispatch(actions.getTotalUsersCount(totalCount))
    } catch (e) {
        console.log(e)
        dispatch(errorActions.errorReceived(e))
        showToast('Something went wrong')
    } finally {
        dispatch(actions.setFetching(false))
    }
}

export const followUnfollowUser = async (followValue, id, name, apiMethod, actionCreator, dispatch) => {
    dispatch(actions.followingDataIsFetching(true, id))
    try {
        const response = await apiMethod(id)
        if (response.data.resultCode === 0) {
            showToast(
                !!followValue
                    ? `User ${name} was followed`
                    : `User ${name} was unfollowed`
            )
            dispatch(actionCreator(followValue, id))
        }
    } catch (e) {
        console.log(e)
        showToast('Something went wrong')
    } finally {
        dispatch(actions.followingDataIsFetching(false, id))
    }
}

export const followUser = (id, name) => async (dispatch) => {
    const apiMethod = usersApi.follow.bind(usersApi)
    const followValue = true
    const actionCreator = actions.followUnfollowUserSuccess
    await followUnfollowUser(followValue, id, name, apiMethod, actionCreator, dispatch)
}

export const unfollowUser = (id, name) => async (dispatch) => {
    const apiMethod = usersApi.unfollow.bind(usersApi)
    const followValue = false
    const actionCreator = actions.followUnfollowUserSuccess
    await followUnfollowUser(followValue, id, name, apiMethod, actionCreator, dispatch)
}