import React from 'react';
import {StyleSheet, Text} from "react-native";
import {theme} from "../theme/theme";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomMediumText = ({children, style, ...props}) => {
    const colors = useSelector(getColors)
    return (
        <Text style={{
            ...styles(colors).text,
            ...style}}
              {...props}>
            {children}
        </Text>
    );
};

const styles = (colors) => StyleSheet.create({
    text: {
        fontFamily: theme.fonts.roboto,
        color: colors.text
    }
})