import * as SDK from "azure-devops-extension-sdk";
import {CommonServiceIds, IProjectPageService} from "azure-devops-extension-api";
import axios from "axios";
import {AUTH_HEADER, getAuthHeader} from "../auth";

// import {AUTH_HEADER} from "../auth";

/**
 * When SDK is used the project Name in the current page get fetched
 */
export async function getCurrentProjectId() {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    let res = await projectService.getProject().then((response) => {
        return response?.id;
    }).catch((err) => console.log("Error Retrieving Project Id: " + err));
    if (res != undefined) {
        return res;
    }
    return "INVALID_GET_PROJECT_ID";//supposed to be an error code
}

/**
 * When SDK is used the project Name in the current page get fetched
 */
export async function getCurrentProjectName(): Promise<string> {
    let projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    const res = await projectService.getProject().then((response) => {
        console.log(response?.name);
        return response?.name
    }).catch((err) => console.log(`Error Retrieving Project name: ${err}`));
    if (res != undefined) {
        return res;
    }
    return "INVALID_GET_PROJECT_NAME";//supposed to be an error code
}

export async function listProjectsByOrganization(organizationName: string, token: string) {
    const url = `https://dev.azure.com/${organizationName}/_apis/projects?api-version=6.0`
    let authHeader = getAuthHeader(token);
    const response = axios.get(url, {
            headers: authHeader
            // 'Authorization': authHeader

        }
    );
    console.log("response cors:", response);
    return response;
}

export async function getProjectByName(organizationName: string, projectName: string, token: string) {
    //bad: can cause problems
    let foundProjects = await (await listProjectsByOrganization(organizationName, token)).data.value.filter((project: any) =>
        project.name === projectName);
    if (foundProjects.length > 0) {
        console.log("project found " + foundProjects[0]);
        return foundProjects[0];
    } else {
        console.log(`No project called ${projectName} found`)
    }
}