import * as SDK from "azure-devops-extension-sdk";

export async function getOrganizationName() {
    return SDK.getAccessToken().then(() => {
            console.log("Organization:" + SDK.getHost().name);
            return SDK.getHost().name
        }
    );
}