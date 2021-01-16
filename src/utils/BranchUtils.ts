import {AUTH_HEADER} from "../auth";
import axios from "axios";

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

export async function listRefs(organizationName: string, projectIdOrName: string, repositoryId: string) {
    const url = `https://dev.azure.com/${organizationName}/${projectIdOrName}/_apis/git/repositories/${repositoryId}/refs?api-version=6.0`;
    return axios.get(url, {headers: AUTH_HEADER}).then(response => response.data.value)
        .catch((err) => console.log("error fetching refs list", err));
}

/**
 * Used to get the optional parameter in #createBranch()
 * @param organizationName
 * @param projectIdOrName
 * @param repositoryId
 * @param refName
 */
export async function getRefObjectId(organizationName: string, projectIdOrName: string, repositoryId: string, refName: string) {
    const refs = await listRefs(organizationName, projectIdOrName, repositoryId);
    const foundRef = refs.filter((ref: any) => ref.name === refName);
    if (foundRef.length > 0) {
        return foundRef[0];
    }
}
