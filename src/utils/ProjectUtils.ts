import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";


export async function getProjectId(): Promise<string> {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    let res= await projectService.getProject().then((response) => {
        console.log("project id: " + response?.id);
        return response?.id;
    }).catch((err) => console.log("Error Retrieving Project Id: " + err));
    if(res!=undefined){
    return res;
    }
    return "INVALID_GET_PROJECT_ID";//supposed to be an error code
}

export const getProjectName = async () => {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    return await projectService.getProject().then((response) => {
        console.log(response?.name);
        return response?.name
    }).catch((err) => console.log("Error Retrieving Project name"));
}
