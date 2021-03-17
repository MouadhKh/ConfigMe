import {FileObject, getFileData, getPipelineFiles, updateFiles} from "../ContentUtils";
import {getCurrentProjectId, getCurrentProjectName} from "../ProjectUtils";
import {
    createRepository,
    deleteRepository,
    getRepositoryId,
    importRepository,
    isRepositoryEmpty,
    listRepositories
} from "../RepositoryUtils";
import {getOrganizationName} from "../OrganizationUtils";
import {
    importBaseContainerRepository,
    importMainRepository
} from "../../Configs/ConfigWizard/statemanagement/actions/repositoryAction";

export function updateContent(fileData: string, organizationName: string, projectName: string, repositoryName: string,
                              dockerRegistry: string, dockerUser: string
    , azureToken: string) {
    const placeholdersMap = new Map([
        ["<DOCKER_USER>", dockerUser],
        ["<MAIN_PROJECT_BASE>", `${projectName.toLowerCase()}-base`],
        ["<MAIN_DEV>", `${projectName.toLowerCase()}-dev`],
        ["<PROJECT_NAME>", projectName],
        ["<MAIN_REPO_LINK>", `https://${azureToken}@dev.azure.com/${organizationName}/${projectName}/_git/${repositoryName}`],
        ["<MAIN_RELEASE>", `${projectName.toLowerCase()}-release`],
        ["<DOCKER_REGISTRY>", dockerRegistry],
        ["<PRODUCTION_CONTAINER>", `${projectName.toLowerCase()}-production-container`]
    ]);
    return replacePlaceholders(fileData, placeholdersMap);
}

//replaceAll isn't supported in most of the browsers yet
export function replacePlaceholders(content: string, placeholderToValueMap: Map<string, string>) {
    let contentCopy = content.slice();
    placeholderToValueMap.forEach((value, key) => {
        const re = new RegExp(key, 'g');
        contentCopy = contentCopy.replace(re, value);
    });
    return contentCopy;
}

export async function configure(repositoryName: string, branchNames: string[], dockerRegistry: string, dockerUser: string,
                                fileExtractionMethod: Function, azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    for (const branch of branchNames) {
        let files = await fileExtractionMethod(repositoryName, branch, azureToken);
        let contents = [];
        for (const pipelineFile of files) {
            const fileData = await getFileData(repositoryName, pipelineFile, azureToken);
            const content = await updateContent(fileData, organizationName, projectName, repositoryName, dockerRegistry, dockerUser, azureToken);
            contents.push(content);
        }
        let status: number = await updateFiles(files, repositoryName, branch, contents, azureToken);
        if (status !== 201) {
            return false;
        }
    }
    return true;
}

// export async function deleteAndImport(repositoryName: string, azureToken: string) {
//     const organizationName = await getOrganizationName();
//     const projectName = await getCurrentProjectName();
//     await deleteRepository(organizationName, projectName, repositoryName, azureToken);
//     export async function importRepository(organizationName: string, projectIdOrName: string,
//                                            repositoryId: string, sourceUrl: string, token: string)
//     await importRepository(organizationName,projectName,getRepositoryId())
// }
export const basicModeImportRepository = async (repositoryName: string, sourceUrl: string, azureCtx: any, repositoryDispatch: any, repositoryType: string) => {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const currentProjectId: string = await getCurrentProjectId();
    let existingRepos = await listRepositories(organizationName, projectName, azureCtx.azureState.azureToken);
    let existingReposNames = existingRepos.map((repo: any) => repo.name);
    if (existingReposNames.includes(repositoryName) && !await isRepositoryEmpty(repositoryName, azureCtx.azureState.azureToken)) {
        await deleteRepository(organizationName, projectName, repositoryName, azureCtx.azureState.azureToken)
        existingRepos = await listRepositories(organizationName, projectName, azureCtx.azureState.azureToken);
        existingReposNames = existingRepos.map((repo: any) => repo.name);
    }
    // const skip: boolean = existingReposNames.includes(repositoryName);
    //create Empty Base-Container Repository inside ConfigTest Project
    return createRepository(organizationName, currentProjectId, repositoryName, azureCtx.azureState.azureToken)
        .then(createdRepo => {
            console.log("create repo response: ", createdRepo)
            //Clone Base-Container of BooksAPI (Here used as base Project)
            importRepository(organizationName, projectName, createdRepo.id, sourceUrl, azureCtx.azureState.azureToken);
        }).then(() => {
            if (repositoryType === "BASE") {
                repositoryDispatch(importBaseContainerRepository({baseContainerRepository: repositoryName}));
            } else {
                repositoryDispatch(importMainRepository({mainRepository: repositoryName}));
            }
            return true;
            //TODO problem : bad imports are success
        }).catch((err) => {
                console.log("error :", err)
                return false;
            }
        );
}

export function getVisibility(mode: string) {
    if (mode === "ADVANCED") return "invisible";
    return "visible";
}