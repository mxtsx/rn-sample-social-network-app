import React, {useState} from 'react';
import {SafeAreaView, StatusBar as RNStatusBar, StyleSheet} from 'react-native';
import {AppNavigator} from "./src/navigation/app.navigation";
import {StatusBar} from "expo-status-bar";
import {Provider} from "react-redux";
import {store} from "./src/redux/redux.store";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchFonts = async () => {
    await Font.loadAsync({
        'robotoRegular': require('./assets/fonts/RobotoCondensed-Regular.ttf'),
        'robotoBold': require('./assets/fonts/RobotoCondensed-Bold.ttf')
    })
}

const getMode = async () => {
    let nightMode
    try {
        const value = await AsyncStorage.getItem('nightMode')
        if(value !== null) {
            if (value === '1') {
                nightMode = true
            }
            if (value === '0') {
                nightMode = false
            }
            return nightMode
        }
    } catch(e) {
        console.log(e)
    }
}

export default function App() {
    const [isReady, setIsReady] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    const isLoadingHandler = async () => {
        const mode = await getMode()
        setIsDarkMode(mode)
        await fetchFonts()
    }

    if(!isReady) {
        return <AppLoading startAsync={isLoadingHandler}
                           onError={e => console.log(e)}
                           onFinish={() => setIsReady(true)}/>
    }
    return (
        <Provider store={store}>
            <SafeAreaView style={styles.container}>
                <AppNavigator isDarkMode={isDarkMode}/>
                <StatusBar/>
            </SafeAreaView>
        </Provider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: RNStatusBar.currentHeight ? RNStatusBar.currentHeight : 0
    },
});
