import {StyleSheet, TextInput} from "react-native";
import React, {useState} from "react";
import {theme} from "../theme/theme";
import {useDispatch, useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomInputComponent = React.memo(({style, email, value, setError, clearError, required, ...props}) => {
    const [disabled, setDisabled] = useState(false)

    const colors = useSelector(getColors)

    const dispatch = useDispatch()

    const filters = [
        email,
        required
    ]

    const onBlurHandler = () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(required && !value) {
            dispatch(setError('Field is required'))
            setDisabled(true)
            return
        }
        if(email && !emailRegex.test(value.toLowerCase())) {
            dispatch(setError('Please, enter a valid email'))
            setDisabled(true)
            return
        }
        dispatch(clearError())
        setDisabled(false)
    }
    return <TextInput style={{...styles(disabled, colors).input, ...style}}
                      onBlur={filters.some(f => f)
                          ? onBlurHandler
                          : () => {}}
                      {...props} />
})

const styles = (disabled, colors) => StyleSheet.create({
    input: {
        backgroundColor: colors.white,
        borderColor: !disabled
            ? colors.primary
            : colors.danger,
        borderWidth: 2
    }
})
