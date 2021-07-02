import { combineReducers } from 'redux'

import AuthReducer from "./auth";

// COMBINED REDUCERS
const reducers = {
  auth: AuthReducer
}

export default combineReducers(reducers)
