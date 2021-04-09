import RepositoryUtility from "./RepositoryUtility";
import {
    importBaseContainerRepository,
    importMainRepository
} from "../ConfigMe/ConfigWizard/statemanagement/actions/repositoryAction";
import AzureUtility from "./AzureUtility";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";
import FilesUtility from "./FilesUtility";

export default class BasicModeUtility extends AzureUtility {
    private repositoryUtility!: RepositoryUtility;
    private fileUtility!: FilesUtility;

    constructor(azureToken: string) {
        super(azureToken);
        appendAsyncConstructor(this, async () => {
            this.repositoryUtility = await new RepositoryUtility(azureToken);
            this.fileUtility = await new FilesUtility(azureToken);
        });
    }

    private updateContent(fileData: string, repositoryName: string, dockerRegistry: string, dockerUser: string) {
        const placeholdersMap = new Map([
            ["<DOCKER_USER>", dockerUser],
            ["<MAIN_PROJECT_BASE>", `${this.projectName.toLowerCase()}-base`],
            ["<MAIN_DEV>", `${this.projectName.toLowerCase()}-dev`],
            ["<PROJECT_NAME>", this.projectName],
            ["<MAIN_REPO_LINK>", `https://${this.azureToken}@dev.azure.com/${this.organizationName}/${this.projectName}/_git/${repositoryName}`],
            ["<MAIN_RELEASE>", `${this.projectName.toLowerCase()}-release`],
            ["<DOCKER_REGISTRY>", dockerRegistry],
            ["<PRODUCTION_CONTAINER>", `${this.projectName.toLowerCase()}-production-container`]
        ]);
        return BasicModeUtility.replacePlaceholders(fileData, placeholdersMap);
    }

//replaceAll isn't supported in most of the browsers yet
    private static replacePlaceholders(content: string, placeholderToValueMap: Map<string, string>) {
        let contentCopy = content.slice();
        placeholderToValueMap.forEach((value, key) => {
            const re = new RegExp(key, 'g');
            contentCopy = contentCopy.replace(re, value);
        });
        return contentCopy;
    }

    /**
     * Could have used only one method to configure files(docker and yaml) but its better to keep it simple and separated
     * @param repositoryName
     * @param branchNames
     * @param dockerRegistry
     * @param dockerUser
     */
    public async configureDockerFiles(repositoryName: string, branchNames: string[], dockerRegistry: string, dockerUser: string) {
        for (const branch of branchNames) {
            let files = await this.fileUtility.getDockerFiles(repositoryName, branch);
            let contents = [];
            for (const pipelineFile of files) {
                const fileData = await this.fileUtility.getFileData(repositoryName, pipelineFile);
                const content = await this.updateContent(fileData, repositoryName, dockerRegistry, dockerUser);
                contents.push(content);
            }
            let status: number = await this.fileUtility.updateFiles(files, repositoryName, branch, contents);
            if (status !== 201) {
                return false;
            }
        }
        return true;
    }

    public async configurePipelineFiles(repositoryName: string, branchNames: string[], dockerRegistry: string, dockerUser: string) {
        for (const branch of branchNames) {
            let files = await this.fileUtility.getPipelineFiles(repositoryName, branch);
            let contents = [];
            for (const pipelineFile of files) {
                const fileData = await this.fileUtility.getFileData(repositoryName, pipelineFile);
                const content = await this.updateContent(fileData, repositoryName, dockerRegistry, dockerUser);
                contents.push(content);
            }
            let status: number = await this.fileUtility.updateFiles(files, repositoryName, branch, contents);
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
    public async basicModeImportRepository(repositoryName: string, sourceUrl: string,
                                           repositoryDispatch: any, repositoryType: string) {
        let existingRepos = await this.repositoryUtility.listRepositories();
        let existingReposNames = existingRepos.map((repo: any) => repo.name);
        if (existingReposNames.includes(repositoryName) && !await this.repositoryUtility.isRepositoryEmpty(repositoryName)) {
            await this.repositoryUtility.deleteRepository(repositoryName)
            existingRepos = await this.repositoryUtility.listRepositories();
            existingReposNames = existingRepos.map((repo: any) => repo.name);
        }
        //create Empty Base-Container Repository inside ConfigTest Project
        return this.repositoryUtility.createRepository(repositoryName)
            .then(createdRepo => {
                //Clone Base-Container of BooksAPI (Here used as base Project)
                this.repositoryUtility.importRepository(createdRepo.id, sourceUrl);
            }).then(() => {
                if (repositoryType === "BASE") {
                    repositoryDispatch(importBaseContainerRepository({baseContainerRepository: repositoryName}));
                } else {
                    repositoryDispatch(importMainRepository({mainRepository: repositoryName}));
                }
                return true;
            }).catch((err: any) => {
                    console.log("error :", err)
                    return false;
                }
            );
    }


    public static getVisibility(mode: string) {
        if (mode === "ADVANCED") return "invisible";
        return "visible";
    }
}