import {AuthHeader, getAuthHeader} from "./auth";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";
import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectId, getCurrentProjectName} from "./ProjectUtils";

/**
 * Superclass of all the utilities class.
 * fetch projectName,projectId and organizationName asynchronously
 * create authentication header
 */
export default class AzureUtility {
    protected authHeader: AuthHeader;
    protected azureToken: string;
    protected organizationName!: string;
    protected projectName!: string;
    protected projectId!: string;


    constructor(azureToken: string) {
        this.authHeader = getAuthHeader(azureToken);
        this.azureToken = azureToken;
        appendAsyncConstructor(this, async () => {
            this.organizationName = await getOrganizationName();
            this.projectName = await getCurrentProjectName();
            this.projectId = await getCurrentProjectId();
        });
    }

}