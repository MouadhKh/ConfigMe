// : at the beginning because the username isn't needed for authentification
//TODO: problem of this approach is that myPAT is needed (hide secret)
//const myPATToken = ':3bm3hcokqz5ackq4fadsn3eqf22gjjjsrspfytk5xk7zetrr447q';
import {getOrganizationName} from "./utils/OrganizationUtils";
import {listProjectsByOrganization} from "./utils/ProjectUtils";

export function getAuthHeader(patToken: string) {
    return {Authorization: 'Basic ' + btoa(":" + patToken)}
}

//any request should have done the job here
export async function isTokenValid(token: string) {
    let organizationName = await getOrganizationName();
    let response = listProjectsByOrganization(organizationName, token);
    let status: number = await response.then((res) => res.status);
    return status == 200;
}
export const AUTH_HEADER = {
    'Authorization': 'Basic ' + btoa(":3bm3hcokqz5ackq4fadsn3eqf22gjjjsrspfytk5xk7zetrr447q")
};
