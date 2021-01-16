import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import RepositoryAction from "./RepositoryAction";
import {getCurrentProjectName} from "../../utils/ProjectUtils";


let repositoryAction = new RepositoryAction();

SDK.init().then(() => {
        console.log("repositoryAction initialized successfully");
        SDK.register("base-container-repository-action", () => {

            return {
                execute: async () => {
                    await repositoryAction.createRepo("Base-Container", "https://github.com/MouadhKh/Base-Container.git");
                }
            }
        });
        SDK.register("main-repository-action", () => {
            return {
                execute: async () => {
                    //TODO find a better way to make it dynamic
                    // this only works because we can assume that main repository = project name
                    await repositoryAction.createRepo(await getCurrentProjectName(),
                        "https://dev.azure.com/mouadh-kh/BooksAPI/_git/BooksAPI", true);
                }

            }
        });
    }
);




