import {  USER_LOGIN, USER_LOGOUT  } from "./types"

export const userLogin = () => {
    return {
        type: USER_LOGIN,
    }
}

export const userLogout = () => {
    return {
        type: USER_LOGOUT,
    }
}


export const handleUserLogin = ({
    email,
    password,
    onSuccess = () => { }
    , onFail = () => { }
}) => {
    return async (dispatch) => {
        try {
             
        } catch (e) {
            //localStorage.removeItem(authToken);
            //onFail()
        }

    }
}

export const handleUserLogout = ({ onFail = () => { }, onSuccess = () => { } }) => async (dispatch) => {

    try {
        
        dispatch(userLogout())
        
    } catch (e) {
        dispatch(userLogout())
    }
}


