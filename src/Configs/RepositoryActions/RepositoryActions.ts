import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("booksapi-repository-action", () => {
    return {
        execute: async () => {
            const dialogSvc = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            dialogSvc.openMessageDialog(`Books-API repository action`, { showCancel: false });
        }
    }
});

SDK.init();