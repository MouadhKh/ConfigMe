import {combineReducers} from "redux";
import {azureAuthReducer, dockerAuthReducer} from "./authenticationReducers";

export const rootReducer = combineReducers({
    dockerAuthentication: dockerAuthReducer,
    azureAuthentication: azureAuthReducer
});
export type RootState = ReturnType<typeof rootReducer>;