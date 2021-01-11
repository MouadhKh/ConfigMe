import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService, IProjectPageService } from "azure-devops-extension-api";

export const getProjectId = async () => {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    return await projectService.getProject().then((response) => {
        console.log(response?.id);
        return response?.id
    }).catch((err) => console.log("Error Retrieving Project Id"));
}

export const getProjectName = async () => {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    return await projectService.getProject().then((response)=>{
        console.log(response?.name);
        return response?.name
    }).catch((err)=>console.log("Error Retrieving Project name"));
}
