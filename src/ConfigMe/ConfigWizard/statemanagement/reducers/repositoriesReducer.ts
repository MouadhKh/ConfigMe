import {RepositoriesData, RepositoryAction} from "../types";
import {IMPORT_REPOSITORY} from "../actions/actionTypes";

export const repositoriesReducer = (state: RepositoriesData, action: RepositoryAction) => {
    switch (action.type) {
        case IMPORT_REPOSITORY:
            if (action.payload.repositoryType === "BASE") {
                return {
                    ...state,
                    baseContainerRepository: action.payload.repositoryName
                }
            }
            return {...state, mainRepository: action.payload.repositoryName}
        default:
            return state;
    }
}