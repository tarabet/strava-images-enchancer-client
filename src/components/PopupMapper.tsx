import React, { FunctionComponent } from 'react'
import {useDispatch, useSelector} from "react-redux";

import { RootState } from "../store/store";
import { togglePopup } from "../store/popup";

import ModalSignInForm from "./ModalRegularSignInForm";
import ModalSignUpForm from "./ModalRegularSignUpForm";
import ModalMessage from "./ModalMessage";

export const POPUP_FETCH_ERROR = 'popupFetchError'

export const POPUP_SIGN_IN_FORM = 'popupSignInForm'
export const POPUP_SIGN_UP_FORM = 'popupSignUpForm'
export const POPUP_LOGIN_SUCCESS = 'popupLoginSuccess'
export const POPUP_LOGIN_FAILED = 'popupLoginFailed'
export const POPUP_REGISTER_SUCCESS = 'popupRegisterSuccess'
export const POPUP_REGISTER_FAILED = 'popupRegisterFailed'
export const POPUP_PROFILE_UPDATE_SUCCESS = 'popupProfileUpdateSuccess'
export const POPUP_PROFILE_UPDATE_FAILED = 'popupProfileUpdateFailed'

export const POPUP_POST_SAVE_SUCCESS = 'popupProfileUpdateSuccess'
export const POPUP_POST_SAVE_FAILED = 'popupProfileUpdateFailed'

export const PopupMapper: FunctionComponent = () => {
    const { popupShow, popupType, popupMessage } = useSelector((store: RootState) => store.popup)
    const dispatch = useDispatch()

    const togglePopupHandler = (popupShow: boolean, popupType: string = '') => {
        dispatch(togglePopup(popupShow, popupType))
    }

    if (!popupShow) {
        return null;
    }

    return(
        <>
            {popupType === POPUP_FETCH_ERROR && <ModalMessage title='Failed' text={`Fetch failed! Reason: ${popupMessage}`} togglePopupHandler={togglePopupHandler} />}

            {popupType === POPUP_SIGN_IN_FORM && <ModalSignInForm togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_SIGN_UP_FORM && <ModalSignUpForm togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_LOGIN_SUCCESS && <ModalMessage title='Success' text='Login Successful!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_LOGIN_FAILED && <ModalMessage title='Failed' text='Login Failed!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_REGISTER_SUCCESS && <ModalMessage title='Success' text='User created. Use your credentials to login!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_REGISTER_FAILED && <ModalMessage title='Failed' text='Register failed!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_PROFILE_UPDATE_SUCCESS && <ModalMessage title='Success' text='Profile updated!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_PROFILE_UPDATE_FAILED && <ModalMessage title='Failed' text='Profile update failed!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_POST_SAVE_SUCCESS && <ModalMessage title='Success' text='Post saved!' togglePopupHandler={togglePopupHandler} />}
            {popupType === POPUP_POST_SAVE_FAILED && <ModalMessage title='Failed' text='Could not save post!' togglePopupHandler={togglePopupHandler} />}
        </>
    )
}
