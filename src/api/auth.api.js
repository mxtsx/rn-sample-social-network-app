import {instance} from "./api";

export const authApi = {
    getAuth() {
        return instance.get('auth/me')
    },
    login(email, password, rememberMe = false, captcha = null) {
        return instance.post('auth/login', {email, password, rememberMe, captcha})
    },
    logout() {
        return instance.delete('auth/login')
    },
    captcha() {
        return instance.get('security/get-captcha-url')
    }
}