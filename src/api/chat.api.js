let ws

let subscribers = {
    "sendMessage": [],
    "setStatus": []
}

const messageHandler = (e) => {
    let newMessages = JSON.parse(e.data);
    subscribers["sendMessage"].forEach(s => s(newMessages))
}

const closeHandler = () => {
    notifyUserAboutStatus("Pending...")
    setTimeout(createChannel, 3000)
}

const openHandler = () => {
    notifyUserAboutStatus("Ready")
}

const errorHandler = () => {
    notifyUserAboutStatus("Error")
    console.log('Refresh the Page')
}

const notifyUserAboutStatus = (status) => {
    subscribers["setStatus"].forEach(s => s(status))
}

const cleanUp = () => {
    ws?.removeEventListener('close', closeHandler)
    ws?.removeEventListener('message', messageHandler)
    ws?.removeEventListener('open', openHandler)
    ws?.removeEventListener('error', errorHandler)
}

const createChannel = () => {
    if(ws !== null) {
        cleanUp()
        ws?.close()
    }
    ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
    notifyUserAboutStatus("Pending...")
    ws.addEventListener('open', openHandler)
    ws.addEventListener('close', closeHandler)
    ws.addEventListener('message', messageHandler)
    ws.addEventListener('error', errorHandler)
}

export const chatApi = {
    start() {
        createChannel()
    },
    stop() {
        subscribers["sendMessage"] = []
        subscribers["setStatus"] = []
        cleanUp()
        ws?.close()
    },
    subscribe(event, callback) {
        subscribers[event].push(callback)
    },
    unsubscribe(event, callback) {
        subscribers[event] = subscribers[event].filter(s => s !== callback)
    },
    sendMessage(message) {
        ws?.send(message)
    }
}