import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ImagePickerComponent = ({image, setImage, style, children}) => {
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need media library permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.7} style={style} onPress={pickImage} >
            {image
                ? <Image source={{ uri: image }}
                         style={styles.image}
                         resizeMode={'contain'}/>
                : children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%'
    }
})