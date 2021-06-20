import {ToastAndroid} from "react-native";
import {isAndroid} from "./platform.util";
import Toast from "react-native-root-toast";

export const showToast = (message) => {
    !isAndroid
        ? Toast.show(message, {
            hideOnPress: true,
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true
        })
        : ToastAndroid.show(message, ToastAndroid.SHORT)
}