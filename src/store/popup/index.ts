import {AnyAction} from 'redux'

import {AppDispatch} from "../store";

export const POPUP_TOGGLE = 'popup/toggle'

export type PopupState = {
    popupShow: boolean,
    popupType: string,
    popupMessage: string
}

const initialState: PopupState = {
    popupShow: false,
    popupType: '',
    popupMessage: ''
}

export const togglePopup = (popupShow: boolean, popupType?: string) => {
    return { type: POPUP_TOGGLE, payload: { popupShow, popupType }}
}

const popupReducer = (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case POPUP_TOGGLE:
            return { ...state, ...payload }
        default:
            return state
    }
}

export default popupReducer
