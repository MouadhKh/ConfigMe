import {rootReducer} from "./reducers/rootReducer";
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";

let initialState = {}
export default createStore(
    rootReducer,
    initialState, applyMiddleware(thunk));