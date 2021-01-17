import * as SDK from "azure-devops-extension-sdk";
import {CommonServiceIds, IHostPageLayoutService} from "azure-devops-extension-api";

export default class UIDialog {
    private readonly message: string;

    constructor(message: string) {
        this.message = message;

    }

    public async showSimpleDialog() {
        const dialog = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        dialog.openMessageDialog(this.message, {showCancel: false});
    }
}