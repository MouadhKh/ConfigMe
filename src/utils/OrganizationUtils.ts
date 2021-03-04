import * as SDK from "azure-devops-extension-sdk";

export async function getOrganizationName() {
    // await SDK.init();
    return SDK.getAccessToken()
        .then(() => {
                return SDK.getHost().name
            }
        )
}