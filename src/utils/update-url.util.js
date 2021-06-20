import {isAndroid} from "./platform.util";

export const updateUrl = (url) => {
    return isAndroid
        ? url
        : 'file:///' + url.split('file:/').join('')
}