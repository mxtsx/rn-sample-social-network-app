import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "./auth.reducer";
import {chatReducer} from "./chat.reducer";
import {profileReducer} from "./profile.reducer";
import {usersReducer} from "./users.reducer";
import {themeReducer} from "./theme.reducer";
import {dialogsReducer} from "./dialogs.reducer";
import {errorReducer} from "./error.reducer";

const reducers = combineReducers({
    auth: authReducer,
    usersPage: usersReducer,
    profilePage: profileReducer,
    chat: chatReducer,
    theme: themeReducer,
    dialogs: dialogsReducer,
    error: errorReducer
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))