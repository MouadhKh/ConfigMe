import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectName} from "./ProjectUtils";
import {getClient} from "azure-devops-extension-api";
import {GitRestClient, VersionControlRecursionType} from "azure-devops-extension-api/Git";

import {AUTH_HEADER} from "../auth";
import axios from "axios";

export async function listPushes(repositoryId: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`
    return axios.get(url, {headers: AUTH_HEADER}).then((response) => console.log("Pushes debug log", response))
}

