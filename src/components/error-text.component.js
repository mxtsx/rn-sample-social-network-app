import React from 'react';
import {StyleSheet, View} from "react-native";
import {theme} from "../theme/theme";
import {CustomMediumText} from "./custom-medium-text";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const ErrorTextComponent = ({err}) => {
    const colors = useSelector(getColors)
    return (
        <View>
            <CustomMediumText style={styles(colors).error}>
                {err}
            </CustomMediumText>
        </View>
    );
};

const styles = (colors) => StyleSheet.create({
    error: {
        marginVertical: theme.space[2],
        color: colors.danger,
        fontSize: theme.fontSize.large,
        fontWeight: theme.fontWeight.bolder,
        textAlign: 'center'
    }
})