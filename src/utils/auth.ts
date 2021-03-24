import {getOrganizationName} from "./OrganizationUtils";
import {listProjectsByOrganization} from "./ProjectUtils";

export type AuthHeader = {
    Authorization: string
}

/**
 *  create an authorization header from personal access token
 * @param patToken
 */
export function getAuthHeader(patToken: string): AuthHeader {
    return {Authorization: 'Basic ' + btoa(":" + patToken)}
}

/**
 * Trick to verify the token is valid by sending a request and verifying the response status(401 means unauthorized)
 * @param token
 */
export async function isTokenValid(token: string) {
    let organizationName = await getOrganizationName();
    let response = listProjectsByOrganization(organizationName, token);
    let status: number = await response.then((res) => res.status);
    return status == 200;
}
