import React from 'react';
import {TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import {isAndroid} from "../utils/platform.util";
import {useSelector} from "react-redux";
import {getColors, getNightMode} from "../redux/theme.selectors";

export const TouchableAreaComponent = ({style, children, ...props}) => {

    const nightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)

    let Area = TouchableOpacity
    if (isAndroid) {
        Area = TouchableNativeFeedback
    }
    return (
        <View style={{...style, overflow: 'hidden'}}>
            <Area {...props}
                  useForeground={true}
                  background={TouchableNativeFeedback.Ripple(
                      !nightMode
                          ? colors.black
                          : colors.grayish,
                      true)}>
                {children}
            </Area>
        </View>
    )
}