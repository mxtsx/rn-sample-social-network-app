import React from 'react';
import {CustomButtonComponent} from "./custom-button.component";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const ErrorComponent = ({disabled, onRefreshHandler, style, buttonStyle, errorText, indicatorColor, ...props}) => {
    const colors = useSelector(getColors)

    return (
        <View style={{
            ...styles.container,
            ...style,
            backgroundColor: colors.background,
        }}>
            <CustomButtonComponent
                style={{
                    ...buttonStyle
                }}
                color={
                    !disabled
                        ? colors.danger
                        : colors.grayish}
                onPress={onRefreshHandler}
            >
                {!errorText
                    ? 'Try again'
                    : errorText
                }
            </CustomButtonComponent>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})