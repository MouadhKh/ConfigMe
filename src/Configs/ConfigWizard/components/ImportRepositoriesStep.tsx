import {getOrganizationName} from "../../../utils/OrganizationUtils";
import * as React from "react";
import {getCurrentProjectId, getCurrentProjectName} from "../../../utils/ProjectUtils";
import {useContext, useEffect, useRef, useState} from "react";
import {AzureAuthContext} from "../statemanagement/contexts/AzureAuthContext";

import {Button, FormControl, FormControlProps, InputGroup, Modal} from "react-bootstrap";
import {BLUE} from "../styleConstants";
import {
    createRepository, deleteRepository,
    importRepository, isRepositoryEmpty,
    listRepositories
} from "../../../utils/RepositoryUtils";
import {BiImport} from "react-icons/all";
import {AzureAuthConsumer} from "../statemanagement/contexts/AzureAuthContext";
import {RepositoryImportAlert} from "./messages/alerts";
import {DeleteConfirmationModal} from "./messages/modals";
import {RepositoryImportToast} from "./messages/toasts";
import {RepositoriesContext} from "../statemanagement/contexts/RepositoriesContext";
import {importBaseContainerRepository, importMainRepository} from "../statemanagement/actions/repositoryAction";
import {RepositoriesData} from "../statemanagement/types";

export const ImportRepositoriesStep = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [deletionConfirmation, setDeletionConfirmation] = useState(false);
    const [baseRepositoryImportSuccess, setBaseRepositoryImportSuccess] = useState(false);
    const [mainRepositoryImportSuccess, setMainRepositoryImportSuccess] = useState(false);
    const [showBaseRepositoryImportToast, setShowBaseRepositoryImportToast] = useState(false);
    const [showMainRepositoryImportToast, setShowMainRepositoryImportToast] = useState(false);
    const [isMainRepository, setIsMainRepository] = useState(true);
    const [currentRepoType, setCurrentRepoType] = useState("");
    const [currentTargetRepositoryName, setCurrentTargetRepositoryName] = useState("");
    const [currentSourceUrl, setCurrentSourceUrl] = useState("");
    const {repositoriesState, repositoryDispatch} = useContext(RepositoriesContext);

    useEffect(() => {
        getOrganizationName().then(org => setOrganizationName(org));
        getCurrentProjectName().then(project => setProjectName(project));

    }, []);

    const getMainRepositoryTargetName = () => {
        if (!isMainRepository) {
            return mainTargetRef.current.value;
        }
        return projectName;
    }
    const importRepo = async (repositoryName: string, sourceUrl: string, azureToken: string, repositoryType: string) => {
        const currentProjectId: string = await getCurrentProjectId();
        let existingRepos = await listRepositories(organizationName, projectName, azureToken);
        let existingReposNames = existingRepos.map((repo: any) => repo.name);
        if (existingReposNames.includes(repositoryName) && !await isRepositoryEmpty(repositoryName, azureToken)) {
            setDeletionConfirmation(true);
        } else {
            const skip: boolean = existingReposNames.includes(repositoryName);
            //create Empty Base-Container Repository inside ConfigTest Project
            createRepository(organizationName, currentProjectId, repositoryName, azureToken, skip).then(createdRepo => {
                //Clone Base-Container of BooksAPI (Here used as base Project)
                importRepository(organizationName, projectName, createdRepo.id, sourceUrl, azureToken);
            }).then(() => {
                if (repositoryType == "BASE") {
                    setBaseRepositoryImportSuccess(true);
                    setShowBaseRepositoryImportToast(true)
                    repositoryDispatch(
                        importBaseContainerRepository({baseContainerRepository: repositoryName}));
                } else {
                    setMainRepositoryImportSuccess(true);
                    setShowMainRepositoryImportToast(true);
                    repositoryDispatch(
                        importMainRepository({mainRepository: repositoryName}))
                }
                //TODO problem : bad imports are success
            }).catch(() => {
                    if (repositoryType == "BASE") {
                        setBaseRepositoryImportSuccess(false);
                        setShowBaseRepositoryImportToast(true);
                    } else {
                        setMainRepositoryImportSuccess(false);
                        setShowMainRepositoryImportToast(true);
                    }
                }
            );
        }
    }

    const deleteAndImportRepository = (azureCtx: any) => {
        return deleteRepository(organizationName, projectName, currentTargetRepositoryName, azureCtx.azureState.azureToken).then(() =>
            importRepo(currentTargetRepositoryName, currentSourceUrl, azureCtx.azureState.azureToken, currentRepoType))
    }
    const buildRepositoryLink = (repositoryName: string): string => {
        return `https://dev.azure.com/${organizationName}/${projectName}/_git/${repositoryName}`;

    }
    const baseSrcRef: any = useRef(null);
    const baseTargetRef: any = useRef(null);
    const mainSrcRef: any = useRef(null);
    const mainTargetRef: any = useRef(null);


    return (
        <AzureAuthConsumer>
            {azureCtx => azureCtx &&
                <div>
                    <div className="row mb-3">
                        <div className="col-6">Organization :<b className="ml-2">{organizationName}</b></div>
                        <div className="col-6">Project: <b className="ml-2">{projectName}</b></div>
                    </div>
                    <label style={BLUE}>Base Container Repository</label>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Source URL</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled={baseRepositoryImportSuccess} ref={baseSrcRef}
                                     placeholder="Source URL"
                        />
                    </InputGroup>
                    <br/>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="ml-2">Target Repository</InputGroup.Text>
                        </InputGroup.Prepend>

                        <FormControl
                            ref={baseTargetRef}
                            disabled={baseRepositoryImportSuccess}
                            placeholder="Target Repository Name"
                            aria-label="Target Repository"
                            aria-describedby="Target Repository Name"
                        />
                        <InputGroup.Append>
                            <Button disabled={baseRepositoryImportSuccess}
                                    className="ml-2" variant="outline-primary"
                                    onClick={() => {
                                        setCurrentRepoType("BASE");
                                        setCurrentTargetRepositoryName(baseTargetRef.current.value);
                                        setCurrentSourceUrl(baseSrcRef.current.value);
                                        //TODO try to use state currenttarget here
                                        importRepo(baseTargetRef.current.value,
                                            baseSrcRef.current.value, azureCtx.azureState.azureToken, "base");
                                    }}><BiImport/></Button>
                        </InputGroup.Append>
                    </InputGroup>

                    <br/>
                    <label style={BLUE}>Main Repository Model</label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Source URL</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled={mainRepositoryImportSuccess} ref={mainSrcRef}
                        />
                    </InputGroup>
                    <br/>
                    <InputGroup className="mb-2">
                        <label className="mr-3" htmlFor="Not Main Repository ?"> Target : Not Main
                            Repository </label>
                        <InputGroup.Checkbox disabled={mainRepositoryImportSuccess} checked={!isMainRepository}
                                             onChange={() => {
                                                 setIsMainRepository(!isMainRepository);
                                                 console.log("not main repository checked")
                                             }}/>
                        {!isMainRepository &&
                        <FormControl disabled={mainRepositoryImportSuccess} ref={mainTargetRef}
                                     placeholder="Target Repository Name"/>}
                        <InputGroup.Append>
                            {/*TODO change mainSrcRef based on checkbox state*/}
                            <Button className="ml-2" variant="outline-primary"
                                    disabled={mainRepositoryImportSuccess}
                                    onClick={() => {
                                        setCurrentRepoType("MAIN");
                                        setCurrentTargetRepositoryName(getMainRepositoryTargetName());
                                        setCurrentSourceUrl(mainSrcRef.current.value);
                                        importRepo(getMainRepositoryTargetName(),
                                            mainSrcRef.current.value, azureCtx.azureState.azureToken, "MAIN")
                                    }}><BiImport/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <>
                        <RepositoryImportToast show={showBaseRepositoryImportToast}
                                               onClose={() => setShowBaseRepositoryImportToast(false)}
                                               success={baseRepositoryImportSuccess}
                                               repositoryName={currentTargetRepositoryName}/>
                        <RepositoryImportToast show={showMainRepositoryImportToast}
                                               onClose={() => setShowMainRepositoryImportToast(false)}
                                               success={mainRepositoryImportSuccess}
                                               repositoryName={currentTargetRepositoryName}/>
                        {/*<RepositoryImportAlert repositoryName={currentTargetRepositoryName}*/}
                        {/*                       link={buildRepositoryLink(currentTargetRepositoryName)}*/}
                        {/*                       show={baseRepositoryImportSuccess != -1}*/}
                        {/*                       success={baseRepositoryImportSuccess == 1}/>*/}
                    </>
                    <DeleteConfirmationModal show={deletionConfirmation} onHide={() => {
                        setDeletionConfirmation(false)
                    }} onConfirm={() => {
                        deleteAndImportRepository(azureCtx).then(() => {
                            setDeletionConfirmation(false);
                        });
                    }}/>
                </div>}
        </AzureAuthConsumer>);
}