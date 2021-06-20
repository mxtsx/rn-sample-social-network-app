const basicLightColors = {
    cyan: '#a8dadc',
    white: '#fff',
    red: '#e63946',
    scarlet: '#e63976',
    gray: '#ccc',
    green: '#00cc00',
    violet: '#9f91ac'
}

const basicDarkColors = {
    darkblue: '#457b9d',
    darkviolet: '#240046',
    grayish: '#aaa',
    darkgray: '#4c4f59',
    black: '#000'
}

export const colors = (isNightMode) => ({
    primary: !isNightMode
        ? basicDarkColors.darkblue
        : basicDarkColors.darkviolet,
    secondary: !isNightMode
        ? basicLightColors.cyan
        : basicLightColors.gray,
    white: basicLightColors.white,
    danger: basicLightColors.red,
    alert: basicLightColors.scarlet,
    grayish: !isNightMode
        ? basicLightColors.gray
        : basicDarkColors.grayish,
    black: basicDarkColors.black,
    green: basicLightColors.green,
    background: !isNightMode
        ? basicLightColors.gray
        : basicDarkColors.darkgray,
    cardShadow: !isNightMode
        ? basicDarkColors.black
        : basicLightColors.violet,
    card: !isNightMode
        ? basicLightColors.white
        : basicDarkColors.darkviolet,
    text: !isNightMode
        ? basicDarkColors.black
        : basicLightColors.white,
    placeholder: basicLightColors.gray,
    photoIcon: !isNightMode
        ? basicDarkColors.grayish
        : basicLightColors.gray,
    element: !isNightMode
        ? basicDarkColors.darkblue
        : basicLightColors.violet,
    switch: !isNightMode
        ? basicDarkColors.darkblue
        : basicLightColors.violet,
    usersAdd: !isNightMode
        ? basicDarkColors.black
        : basicLightColors.white,
    button: !isNightMode
        ? basicDarkColors.darkblue
        : basicLightColors.violet,
    preloader: !isNightMode
        ? basicDarkColors.darkblue
        : basicLightColors.gray,
    message: !isNightMode
        ? basicLightColors.white
        : basicDarkColors.darkviolet,
    authorMessage: !isNightMode
        ? basicLightColors.cyan
        : basicDarkColors.darkgray,
    icon: basicDarkColors.grayish
})