import React from 'react'
import {StyleSheet, Switch, View} from "react-native";
import {isAndroid} from "../utils/platform.util";
import {theme} from "../theme/theme";
import {CustomBoldText} from "./custom-bold-text";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomSwitchComponent = ({label, value, setValue, style, fontStyle, switchStyle, ...props}) => {

    const colors = useSelector(getColors)

    return(
        <View style={{...styles.filterContainer, ...style}}>
            <CustomBoldText style={{...styles.label, ...fontStyle}}>
                {label}
            </CustomBoldText>
            <Switch value={value}
                    thumbColor={isAndroid ? colors.switch : ''}
                    style={switchStyle}
                    trackColor={{true: colors.switch, false: colors.grayish}}
                    onValueChange={newValue => setValue(newValue)}
                    {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: theme.fontSize.large
    }
})