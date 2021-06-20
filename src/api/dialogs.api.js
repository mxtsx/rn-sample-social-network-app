import {instance} from "./api";

export const dialogsApi = {
    getDialogs() {
        return instance.get('dialogs')
    },
    startDialog(id) {
        return instance.put(`dialogs/${id}`)
    },
    getDialog(id, page, count) {
        return instance.get(
            `dialogs/${id}/messages?page=${page}&count=${count}`
        )
    },
    sendMessage(id, message) {
        return instance.post(`dialogs/${id}/messages`, {body: message})
    },
    removeMessageToSpam(messageId) {
        return instance.post(
            `dialogs/messages/${messageId}/spam`
        )
    },
    removeMessage(messageId) {
        return instance.delete(
            `dialogs/messages/${messageId}`
        )
    },
    restoreMessageFromRemoved(messageId) {
        return instance.put(
            `dialogs/messages/${messageId}/restore`
        )
    }
}