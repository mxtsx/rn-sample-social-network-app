import {instance} from "./api";

export const usersApi = {
    getUsers(count, page, term = '', friend = null) {
        return instance.get(`users?count=${count}&page=${page}&term=${term}&friend=${friend}`)
    },
    follow(id) {
        return instance.post(`follow/${id}`, {})
    },
    unfollow(id) {
        return instance.delete(`follow/${id}`)
    },
    isFollow(id) {
        return instance.get(`follow/${id}`).then(res => res.data)
    }
}