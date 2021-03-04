import {AUTH_HEADER, getAuthHeader} from "../auth";
import axios from "axios";
import {getOrganizationName} from "./OrganizationUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getCurrentProjectName} from "./ProjectUtils";
import {extractFileName} from "./ContentUtils";

export async function listBranches(organizationName: string, projectIdOrName: string) {
    const url = `https://dev.azure.com/{organization}/${projectIdOrName}/_apis/tfvc/branches?path=$/&api-version=6.0`
    return axios.get(url, {headers: AUTH_HEADER}).then((response) => {
        console.log(response.data);
        return response.data;
    });
}


/**
 * Create an empty branch initialized by a README file
 * @param organizationName
 * @param repositoryId
 * @param sourceBranchId : If not set an empty branch is created
 * @param branchName : branch to create
 * @param comment : commit comment
 * @param content : README Content
 */
export async function createBranch(organizationName: string, repositoryId: string, branchName: string, comment: string, content: string, sourceBranchId?: string) {
    const url = `https://dev.azure.com/${organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
    sourceBranchId = (typeof sourceBranchId !== "undefined") ? sourceBranchId : "0000000000000000000000000000000000000000";
    const body = {
        refUpdates: [
            {
                name: `refs/heads/${branchName}`,
                oldObjectId: sourceBranchId
            }
        ],
        commits: [
            {
                comment: comment,
                changes: [
                    {
                        changeType: "add",
                        item: {
                            path: "/readme.md"
                        },
                        newContent: {
                            content: content,
                            contentType: "rawtext"
                        }
                    }
                ]
            }
        ]
    }
    const response = axios.post(url, body, {headers: AUTH_HEADER});
    return response.then((res) => {
        console.log(`Branch ${branchName} created successfully`)
        return res.data;
    }).catch((err) => console.log(`error when creating branch ${branchName}: ${err}`))

}

export async function getRefs(repositoryName: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const projectName = await getCurrentProjectName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/refs?api-version=6.0`;
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then(response => response.data.value);
}

/**
 * Used to get the optional parameter in #createBranch()
 * @param organizationName
 * @param projectIdOrName
 * @param repositoryId
 * @param refName
 */
export async function getRefObjectId(repositoryName: string, refName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const refs = await getRefs(repositoryName, azureToken);
    const foundRef = refs.filter((ref: any) => ref.name === refName);
    if (foundRef.length > 0) {
        return foundRef[0].objectId;
    }
}

function extractBranchName(refString: string): string {
    return refString.substring(refString.lastIndexOf("/") + 1);
}

export async function getBranchNames(repositoryName: string, azureToken: string) {
    return getRefs(repositoryName, azureToken).then(refs => {
        return refs.map((ref: any) => extractBranchName(ref.name))
    });
}
