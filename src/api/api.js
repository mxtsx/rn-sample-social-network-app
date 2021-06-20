import axios from "axios";
export const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.0/",
    withCredentials: true,
    headers: {
        "API-KEY": "94a15a79-63ba-4e19-beb8-d0dda2e70f39"
    }
})