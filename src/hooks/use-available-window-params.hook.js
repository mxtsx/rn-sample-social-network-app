import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions} from "react-native";

export const useAvailableWindowParams = () => {
    const [width, setWidth] = useState(Dimensions.get('window').width)
    const [height, setHeight] = useState(Dimensions.get('window').height)

    const updateLayout = useCallback(() => {
        setWidth(Dimensions.get('window').width)
        setHeight(Dimensions.get('window').height)
    }, [])

    useEffect(() => {
        Dimensions.addEventListener('change', updateLayout)
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        }
    }, [width, height])

    return [width, height]
}