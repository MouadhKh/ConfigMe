import {RepositoriesData} from "../types";
import {IMPORT_REPOSITORY} from "./actionTypes";

export const importBaseContainerRepository = (repository: any) => {
    return {
        type: IMPORT_REPOSITORY,
        payload: {
            repositoryType: "BASE",
            repositoryName: repository.baseContainerRepository,
            // mainRepository: repository.mainRepository
        }
    }
}
export const importMainRepository = (repository: any) => {
    return {
        type: IMPORT_REPOSITORY,
        payload: {
            repositoryType: "MAIN",
            repositoryName: repository.mainRepository
        }
    }
}