import React, {useEffect} from 'react'
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {UsersScreen} from "../screens/users/users.screen";
import {ProfileScreen} from "../screens/profile/profile.screen";
import {LoginScreen} from "../screens/authentication/login.screen";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import {ChatScreen} from "../screens/chat/chat.screen";
import {enableScreens} from "react-native-screens";
import {isAndroid} from "../utils/platform.util";
import {theme} from "../theme/theme";
import {Ionicons} from "@expo/vector-icons";
import {Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "../redux/auth.selectors";
import {userLogout} from "../redux/auth.reducer";
import {SettingsScreen} from "../screens/settings/settings.screen";
import {getColors, getNightMode} from "../redux/theme.selectors";
import {changeMode} from "../redux/theme.reducer";
import {DialogsScreen} from "../screens/dialogs/dialogs.screen";
import {MessagesScreen} from "../screens/dialogs/messages.screen";

const {width} = Dimensions.get('window')

const hideHeaderOption = {
    headerShown: false
}

const stackHeaderOptions = (colors, isNightMode) => ({
    headerStyle: {
        backgroundColor: !isNightMode
            ? isAndroid
                ? colors.primary
                : colors.white
            : colors.primary
    },
    headerTitleStyle: {
        fontFamily: theme.fonts.robotoBold,
        fontSize: theme.fontSize.larger
    },
    headerTintColor: !isNightMode
        ? isAndroid
            ? colors.white
            : colors.primary
        : colors.white,
    headerStatusBarHeight: 0
})

const drawerNavigatorProperties = (colors, isNightMode) => ({
    backgroundColor: !isNightMode
        ? isAndroid
            ? colors.primary
            : colors.white
        : colors.primary,
    width: width / 1.5
})

const drawerNavigatorContentProperties = (colors, isNightMode) => ({
    activeTintColor: !isNightMode
        ? isAndroid
            ? colors.white
            : colors.primary
        : colors.white,
    inactiveTintColor: colors.grayish,
    labelStyle: {
        fontFamily: theme.fonts.robotoBold,
        fontSize: theme.fontSize.large
    }
})

const customDrawerIcon = (androidIcon, iosIcon) => ({color}) => {
    return (
        <Ionicons
            name={isAndroid
                ? androidIcon
                : iosIcon}
            size={23}
            color={color}/>
    )
}

enableScreens()
const Stack = createStackNavigator()

const ProfileStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Stack.Navigator screenOptions={stackHeaderOptions(colors, isNightMode)}>
            <Stack.Screen name={'Profile'} component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

const UsersStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Stack.Navigator screenOptions={stackHeaderOptions(colors, isNightMode)}>
            <Stack.Screen name={'Users'} component={UsersScreen}/>
            <Stack.Screen name={'Profile'} component={ProfileScreen}/>
            <Stack.Screen name={'Dialog'} component={MessagesScreen}/>
        </Stack.Navigator>
    )
}

const AuthStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Stack.Navigator screenOptions={{...stackHeaderOptions(colors, isNightMode), ...hideHeaderOption}}>
            <Stack.Screen name={'Login'} component={LoginScreen}/>
        </Stack.Navigator>
    )
}

const ChatStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Stack.Navigator screenOptions={stackHeaderOptions(colors, isNightMode)}>
            <Stack.Screen name={'Chat'} component={ChatScreen}/>
            <Stack.Screen name={'Profile'} component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

const SettingsStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Stack.Navigator screenOptions={stackHeaderOptions(colors, isNightMode)}>
            <Stack.Screen name={'Settings'} component={SettingsScreen}/>
        </Stack.Navigator>
    )
}

const DialogsStack = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return (
        <Stack.Navigator screenOptions={stackHeaderOptions(colors, isNightMode)}>
            <Stack.Screen name={'Dialogs'} component={DialogsScreen}/>
            <Stack.Screen name={'Dialog'} component={MessagesScreen}/>
            <Stack.Screen name={'Profile'} component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

const Draw = createDrawerNavigator()

const CustomDrawerContent = (props) => {
    const dispatch = useDispatch()
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <DrawerContentScrollView>
            <DrawerItemList {...props}/>
            <DrawerItem {...drawerNavigatorContentProperties(colors, isNightMode)}
                        label={'Logout'}
                        onPress={() => dispatch(userLogout())}
                        icon={customDrawerIcon('md-log-out', 'ios-log-out')} />
        </DrawerContentScrollView>
    )
}

const DrawerNavigator = () => {
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    return(
        <Draw.Navigator drawerStyle={drawerNavigatorProperties(colors, isNightMode)}
                        drawerContent={(props) => <CustomDrawerContent {...props}/>}
                        drawerContentOptions={drawerNavigatorContentProperties(colors, isNightMode)}>
            <Draw.Screen name={'Profile'} component={ProfileStack} options={{drawerIcon: customDrawerIcon('md-person-circle', 'ios-person-circle')}}/>
            <Draw.Screen name={'Users'} component={UsersStack} options={{drawerIcon: customDrawerIcon('md-people-circle', 'ios-people-circle')}}/>
            <Draw.Screen name={'Dialogs'} component={DialogsStack} options={{drawerIcon: customDrawerIcon('md-chatbubbles', 'ios-chatbubbles')}}/>
            <Draw.Screen name={'Chat'} component={ChatStack} options={{drawerIcon: customDrawerIcon('md-chatbubble-ellipses', 'ios-chatbubble-ellipses')}}/>
            <Draw.Screen name={'Settings'} component={SettingsStack} options={{drawerIcon: customDrawerIcon('md-settings-sharp', 'ios-settings-sharp')}}/>
        </Draw.Navigator>
    )
}

export const AppNavigator = ({isDarkMode}) => {
    const isAuth = useSelector(getAuth)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(changeMode(isDarkMode))
    }, [])

    return(
        <NavigationContainer>
            {!isAuth
                ? <AuthStack/>
                : <DrawerNavigator />}
        </NavigationContainer>
    )
}