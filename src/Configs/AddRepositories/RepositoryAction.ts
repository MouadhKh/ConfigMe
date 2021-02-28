// import {getCurrentProjectId, getCurrentProjectName} from "../../utils/ProjectUtils";
// import * as SDK from "azure-devops-extension-sdk";
// import {CommonServiceIds, IHostPageLayoutService} from "azure-devops-extension-api";
// import {createRepository, importRepository, listRepositories} from "../../utils/RepositoryUtils";
// import {getOrganizationName} from "../../utils/OrganizationUtils";
//
// class RepositoryAction {
//
//
//     //TODO solve main repo problem
//     /**
//      * @param repoToCreate
//      * @param sourceUrl
//      * @param skip
//      */
//     async createRepo(repoToCreate: string, sourceUrl: string, skip: boolean = false) {
//         const dialogSvc = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
//         const organizationName = await getOrganizationName();
//         const projectName = await getCurrentProjectName();
//         const currentProjectId: string = await getCurrentProjectId();
//         let existingRepos = await listRepositories(organizationName, projectName);
//         let existingReposNames = existingRepos.map((repo: any) => repo.name);
//         if (existingReposNames.includes(repoToCreate) && !skip) {
//             dialogSvc.openMessageDialog(`Repository ${repoToCreate} already exists`, {showCancel: false});
//         } else {
//             //create Empty Base-Container Repository inside ConfigTest Project
//             createRepository(organizationName, currentProjectId, repoToCreate, skip).then(createdRepo => {
//                 //Clone Base-Container of BooksAPI (Here used as base Project)
//                 importRepository(organizationName, projectName, createdRepo.id, sourceUrl, "");
//             }).then(() => {
//                 dialogSvc.openMessageDialog(`${repoToCreate} repository created successfully`, {showCancel: false});
//             }).catch((err) =>
//                 dialogSvc.openMessageDialog(`Following error interrupted Repository creation : ${err}`, {showCancel: false}));
//         }
//     }
// }
//
// export default RepositoryAction;