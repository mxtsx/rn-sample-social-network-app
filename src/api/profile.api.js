import {instance} from "./api";
import mime from "mime";

export const profileApi = {
    getProfile(id) {
        return instance.get(`profile/${id}`)
    },
    getUserStatus(id) {
        return instance.get(`profile/status/${id}`)
    },
    updateUserStatus(status) {
        return instance.put(`profile/status`, {status: status})
    },
    updateProfileInformation(profile) {
        return instance.put('profile', profile)
    },
    updateProfilePhoto(photo) {
        const formData = new FormData()
        formData.append('image', {
            uri: photo,
            type: mime.getType(photo),
            name: photo.split('/').pop()
        })
        return instance.put('profile/photo', formData, {headers: {"Content-Type": "multipart/form-data"}})
    }
}