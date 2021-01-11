import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService, IProjectPageService } from "azure-devops-extension-api";
import axios from "axios";
import {AxiosResponse} from "axios";
import { getProjectId, getProjectName } from "../../utils";
import { AUTH_HEADER } from '../../auth';



/**
 * create "CreateRepository" Axios Requests dynamically
 * @param url 
 * @param repositoriesNames 
 */
const getCreateRepositoriesRequestArray = async (url: string, repositoriesNames: string[]) => {
    return repositoriesNames.map(repoName => postRepos(repoName,url));
}
const postRepos=async(repoName:string,url:string)=>{
    let body = {
        "name": repoName,
        "project": {
            "id": await getProjectId()
        }
    }    
    return axios.post(url, body, { headers: AUTH_HEADER })
    .then(response=>console.log(`Repo ${body.name} created successfully`))
    .catch(()=>{
        console.log('url:'+url);
        console.log('header:'+AUTH_HEADER.Authorization);
        console.log('body:'+body.project.id);

        console.log(`Error creating ${body.name}`)});
}

SDK.register("booksapi-repository-action", () => {
    return {
        execute: async () => {

            const dialogSvc = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            //TODO: find a way to make 'mouadh-kh' dynamic too
            const projectName = await getProjectName();

            const url = `https://dev.azure.com/mouadhkhl/${projectName}/_apis/git/repositories?api-version=6.0`;
            getCreateRepositoriesRequestArray(url,["Base-Container","BooksAPI"])
                .then((response) => {
                    dialogSvc.openMessageDialog(`Books-API repositories created successfully`, { showCancel: false });
                }).catch((err) => console.log(`Error interrupted Repo Creation: ${err})`));
        }
    };
});

SDK.init();