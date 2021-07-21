import {AnyAction} from 'redux'
import Cookies from 'js-cookie';
import {signin, signout} from "next-auth/client";

import {apiPost, apiGet} from '../../utils/fetch-utils'
import {LoginValues, RegisterValues, RegisterResponseMessage} from "../../utils/types";
import {AppDispatch} from "../store";
import {API_URL_GET_USER, API_URL_SIGNUP} from '../../utils/constants'
import {
  POPUP_LOGIN_FAILED,
  POPUP_LOGIN_SUCCESS,
  POPUP_REGISTER_FAILED,
  POPUP_REGISTER_SUCCESS
} from "../../components/PopupMapper";
import {POPUP_TOGGLE} from "../popup";

export const AUTH_LOGIN = 'auth/login'
export const AUTH_REGISTER = 'auth/register'
export const AUTH_SET_USER = 'auth/set-user'

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
    signin('credentials', { redirect: false, ...values})
        .then(() => {
          dispatch({ type: POPUP_TOGGLE, payload: { popupType: POPUP_LOGIN_SUCCESS }})
        })
        .catch(e => {
            dispatch({ type: POPUP_TOGGLE, payload: { popupType: POPUP_LOGIN_FAILED }})
        })
  }
}

export const authSignOut = () => signout()

export const authRegister: AppDispatch = (values: RegisterValues) => {
  return async (dispatch: AppDispatch) => {
    return apiPost(null, API_URL_SIGNUP, values)
      .then((data: RegisterResponseMessage) => {
        dispatch({type: AUTH_REGISTER, payload: data})
        dispatch({ type: POPUP_TOGGLE, payload: { popupType: POPUP_REGISTER_SUCCESS }})
      })
      .catch(e => {
        dispatch({ type: POPUP_TOGGLE, payload: { popupType: POPUP_REGISTER_FAILED }})
      })
  }
}

export const getUser: AppDispatch = () => {
  return (dispatch: AppDispatch) => {
    return apiGet(null, API_URL_GET_USER)
      .then((userData) => {
        return dispatch({type: AUTH_SET_USER, payload: userData})
      })
      .catch(e => console.log("Error:", e.message))
  }
}

const authReducer = (state = initialState, {type, payload}: AnyAction) => {
  switch (type) {
    case AUTH_LOGIN: {
      return {...state, ...payload, isAuthenticated: !!payload.token}
    }
    case AUTH_SET_USER: {
      const {user, email, enabled} = payload

      return {...state, user, email, isAuthenticated: !!enabled}
    }
    default:
      return state
  }
}

export default authReducer
