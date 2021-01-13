import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IHostPageLayoutService } from "azure-devops-extension-api";
import { getProjectId, getProjectName } from "../../utils/ProjectUtils";
import { getCreateRepositoriesRequestArray, listRepositories } from '../../utils/RepositoryUtils';

SDK.register("booksapi-repository-action", () => {
    return {
        execute: async () => {
            const dialogSvc = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            //TODO: find a way to make 'mouadh-kh' dynamic too
            const projectName = await getProjectName();
            const projectId = await getProjectId();
            listRepositories(projectId);
            getCreateRepositoriesRequestArray("mouadhkhl", "ConfigTest", ["Base-Container", "BooksAPI"])
                .then(() => {
                    dialogSvc.openMessageDialog(`Books-API repositories created successfully`, { showCancel: false });
                }).catch((err) => console.log(`Error interrupted Repo Creation: ${err})`));
        }
    };
});

SDK.init();