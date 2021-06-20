import React, {useCallback, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {theme} from "../../theme/theme";
import {CustomInputComponent} from "../../components/custom-input.component";
import {useDispatch, useSelector} from "react-redux";
import {getCaptchaUrl, getError, getIsLoading} from "../../redux/auth.selectors";
import {CustomButtonComponent} from "../../components/custom-button.component";
import {actions, setCaptchaUrl, userAuthentication, userLogin} from "../../redux/auth.reducer";
import {CustomSwitchComponent} from "../../components/custom-switch.component";
import {ErrorTextComponent} from "../../components/error-text.component";
import {CustomMediumText} from "../../components/custom-medium-text";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {isAndroid} from "../../utils/platform.util";
import {getColors} from "../../redux/theme.selectors";
import {useFocusEffect} from "@react-navigation/native";

const {width} = Dimensions.get('window')

export const LoginScreen = React.memo(() => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [captchaText, setCaptchaText] = useState('')

    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const colors = useSelector(getColors)
    const isLoading = useSelector(getIsLoading)
    const error = useSelector(getError)
    const captcha = useSelector(getCaptchaUrl)

    const dispatch = useDispatch()

    const loginInfo = [
        email,
        password
    ]

    const fieldIsEmpty = loginInfo.some(i => !i);

    useFocusEffect((useCallback(() => {
        dispatch(userAuthentication())
    }, [])))

    const loginHandler = () => {
        dispatch(userLogin(email, password, rememberMe, captchaText))
    }

    const getCaptchaHandler = () => {
        dispatch(setCaptchaUrl())
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground source={require('./login-bg.jpg')}
                             style={{...styles.background, padding: !isAlbum
                                     ? theme.space[0]
                                     : !isAndroid
                                         ? theme.space[5]
                                         : theme.space[0]
                             }}>
                <CustomMediumText style={{...styles.title, color: colors.white}}>Login</CustomMediumText>
                <KeyboardAvoidingView behavior={'padding'}
                                      keyboardVerticalOffset={50}
                                      style={styles.inputContainer}>
                    <CustomInputComponent style={styles.input}
                                          placeholder={'Email'}
                                          id={'email'}
                                          name={'email'}
                                          keyboardType={'email-address'}
                                          required
                                          autoCorrect={false}
                                          autoCapitalize={'none'}
                                          setError={actions.setError}
                                          clearError={actions.clearError}
                                          email
                                          value={email}
                                          onChangeText={setEmail}/>
                    <CustomInputComponent style={styles.input}
                                          placeholder={'Password'}
                                          id={'password'}
                                          name={'password'}
                                          onSubmitEditing={loginHandler}
                                          required
                                          setError={actions.setError}
                                          clearError={actions.clearError}
                                          secureTextEntry
                                          value={password}
                                          onChangeText={setPassword}/>
                    {!!error && <ErrorTextComponent err={error} />}
                    <CustomSwitchComponent label={'Remember me'}
                                           value={rememberMe}
                                           fontStyle={{
                                               ...styles.switchLabel,
                                               color: colors.white,
                                           }}
                                           setValue={setRememberMe}/>
                    {!!captcha &&
                    <>
                        <View style={styles.captchaImageContainer}>
                            <TouchableOpacity activeOpacity={0.7}
                                              onPress={getCaptchaHandler}>
                                <Image source={{uri: captcha}}
                                       style={styles.captcha}/>
                            </TouchableOpacity>
                        </View>
                        <CustomInputComponent style={styles.input}
                                              placeholder={'Captcha'}
                                              id={'captcha'}
                                              name={'captcha'}
                                              value={captchaText}
                                              onChangeText={setCaptchaText}/>
                    </>
                    }
                    <View style={styles.buttonContainer}>
                        <CustomButtonComponent style={styles.button}
                                               disabled={fieldIsEmpty || isLoading}
                                               color={fieldIsEmpty && colors.grayish}
                                               onPress={loginHandler}>
                            {!isLoading
                                ? 'Submit'
                                : <ActivityIndicator color={fieldIsEmpty ? colors.preloader : colors.secondary} size={'small'} />}
                        </CustomButtonComponent>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </ScrollView>
    );
})

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        flexDirection: 'column'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: theme.fontSize.h1,
        marginBottom: theme.space[6]
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        height: width / 9.5,
        marginBottom: theme.space[3],
        padding: theme.space[2]
    },
    switchLabel: {
        fontWeight: theme.fontWeight.bolder,
        fontSize: theme.fontSize.larger
    },
    captchaImageContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: theme.space[2]
    },
    captcha: {
        width: width / 2,
        height: width / 5
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.space[5]
    },
    button: {
        width: width / 4
    }
})