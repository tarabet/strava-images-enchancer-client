import { combineReducers } from 'redux'

import AuthReducer from "./auth";
import PopupReducer from './popup'

// COMBINED REDUCERS
const reducers = {
  auth: AuthReducer,
  popup: PopupReducer
}

export default combineReducers(reducers)
