import * as SDK from "azure-devops-extension-sdk";

/**
 * Get Current organization name
 */
export async function getOrganizationName() {
    return SDK.getAccessToken()
        .then(() => {
                return SDK.getHost().name
            }
        )
}