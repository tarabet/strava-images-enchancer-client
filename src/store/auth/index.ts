import {AnyAction, ActionCreator, Dispatch, Action} from 'redux'
import {ThunkAction} from "redux-thunk";
import Cookies from 'js-cookie';

import { apiPost } from '../../utils/fetch-utils'
import {LoginValues, RegisterValues, RegisterResponseMessage} from "../../utils/types";
import {AppDispatch} from "../store";
import { API_URL_SIGNIN, API_URL_SIGNUP } from '../../utils/constants'

const AUTH_LOGIN = 'auth/login'
const AUTH_REGISTER = 'auth/register'

export type AuthState = {
    isAuthenticated: boolean,
    username: string,
    email: string
}

const initialState: AuthState = {
    isAuthenticated: false,
    username: '',
    email: ''
}

export const authLogin = (values: LoginValues) => {
    return (dispatch: AppDispatch) => {
        return apiPost(null, API_URL_SIGNIN, values)
            .then((data ) => {
                const { token, type } = data

                if (token) {
                    Cookies.set('Authorization', type + ' ' + token)
                }

                dispatch({ type: AUTH_LOGIN, payload: data })
            })
            .catch(e => {
                console.log("ERROR", e.message)
            })
    }
}

export const authRegister: AppDispatch = (values: RegisterValues) => {
    return async (dispatch: AppDispatch) => {
        return apiPost(null, API_URL_SIGNUP, values)
            .then((data: RegisterResponseMessage ) => {
                return dispatch({ type: AUTH_REGISTER, payload: data })
            })
            .catch(e => {
                console.log("ERROR", e.message)
            })
    }
}

const authReducer = (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case AUTH_LOGIN:
            return { ...state, ...payload, isAuthenticated: !!payload.token }
        default:
            return state
    }
}

export default authReducer
