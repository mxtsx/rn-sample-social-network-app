import React, {useRef} from 'react';
import {StyleSheet, View} from "react-native";
import * as Animatable from "react-native-animatable"
import {TouchableAreaComponent} from "./touchable-area.component";
import {theme} from "../theme/theme";
import {CustomBoldText} from "./custom-bold-text";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomButtonComponent = ({children, onPress, color, style, disabled}) => {

    const colors = useSelector(getColors)

    const pulseAnimRef = useRef()
    const onPressHandler = () => {
        pulseAnimRef.current?.pulse(300)
        onPress && onPress()
    }
    return (
        <Animatable.View ref={pulseAnimRef} style={{...style}}>
            <TouchableAreaComponent activeOpacity={0.8}
                                    disabled={!!disabled}
                                    onPress={onPressHandler}>
                <View style={{...styles(colors).animButton, backgroundColor: color ? color : colors.button}}>
                    <CustomBoldText style={styles(colors).animButtonText}>
                        {children}
                    </CustomBoldText>
                </View>
            </TouchableAreaComponent>
        </Animatable.View>
    );
};

const styles = (colors) => StyleSheet.create({
    animButton: {
        padding: theme.space[3],
        borderRadius: theme.size[3],
        elevation: theme.size[3],
        shadowColor: colors.black,
        shadowOffset: {
            width: theme.size[1],
            height: theme.size[1]
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden'
    },
    animButtonText: {
        color: colors.white,
        fontSize: theme.fontSize.large,
        textAlign: 'center'
    }
})