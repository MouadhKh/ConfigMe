import {getOrganizationName} from "../../../../utils/OrganizationUtils";
import * as React from "react";
import {getCurrentProjectName} from "../../../../utils/ProjectUtils";
import {useContext, useEffect, useRef, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {Accordion, Button, Card, FormControl, InputGroup} from "react-bootstrap";
import {BLUE} from "../../styleConstants";
import RepositoryUtility from "../../../../utils/RepositoryUtility";
import {BiImport} from "react-icons/all";
import {AzureAuthConsumer, AzureAuthContext} from "../../statemanagement/contexts/AzureAuthContext";
import {RepositoryDeleteConfirmationModal} from "../modals/RepositoryDeleteConfirmationModal";
import {toastOptions} from "../messages/toasts";
import {RepositoriesContext} from "../../statemanagement/contexts/RepositoriesContext";
import {importBaseContainerRepository, importMainRepository} from "../../statemanagement/actions/repositoryAction";
import {toast, ToastContainer} from "react-toastify";
import {ModeContext} from "../../statemanagement/contexts/ModeContext";
import {changeMode} from "../../statemanagement/actions/modeAction";
import {WizardStepComponent} from "./WizardStepComponent";
import BasicModeUtility from "../../../../utils/BasicModeUtility";

/**
 * Import repositories in two modes :
 * - Basic: Import predefined base repositories
 * - Advanced: Import from a custom source url
 */
export const ImportRepositoriesStep = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [deletionConfirmation, setDeletionConfirmation] = useState(false);
    const [baseRepositoryImportSuccess, setBaseRepositoryImportSuccess] = useState(false);
    const [mainRepositoryImportSuccess, setMainRepositoryImportSuccess] = useState(false);
    const [isMainRepository, setIsMainRepository] = useState(true);
    const [currentRepoType, setCurrentRepoType] = useState("");
    const [currentTargetRepositoryName, setCurrentTargetRepositoryName] = useState("");
    const [currentSourceUrl, setCurrentSourceUrl] = useState("");
    const [imported, setImported] = useState(false);
    const [advancedVisible, setAdvancedVisible] = useState("visible");
    const {repositoriesState, repositoryDispatch} = useContext(RepositoriesContext);
    const {modeState, modeDispatch} = useContext(ModeContext);
    const baseSrcRef: any = useRef(null);
    const baseTargetRef: any = useRef(null);
    const mainSrcRef: any = useRef(null);
    const mainTargetRef: any = useRef(null);
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
        const repositoryUtility = await new RepositoryUtility(azureToken);
        let existingRepos = await repositoryUtility.listRepositories();
        let existingReposNames = existingRepos.map((repo: any) => repo.name);
        if (existingReposNames.includes(repositoryName) &&
            !await repositoryUtility.isRepositoryEmpty(repositoryName)) {
            setDeletionConfirmation(true);
            return false;
        } else {
            const skip: boolean = existingReposNames.includes(repositoryName);
            //create Empty Base-Container Repository inside ConfigTest Project
            return repositoryUtility.createRepository(repositoryName, skip).then(createdRepo => {
                //Clone Base-Container of BooksAPI (Here used as base Project)
                repositoryUtility.importRepository(createdRepo.id, sourceUrl);
            }).then(() => {
                if (repositoryType == "BASE") {
                    setBaseRepositoryImportSuccess(true);
                    repositoryDispatch(importBaseContainerRepository({baseContainerRepository: repositoryName}));
                } else {
                    setMainRepositoryImportSuccess(true);
                    repositoryDispatch(importMainRepository({mainRepository: repositoryName}));
                }
                modeDispatch(changeMode({mode: "ADVANCED"}));
                return true;
            }).catch(() => {
                    if (repositoryType == "BASE") {
                        setBaseRepositoryImportSuccess(false);

                    } else {
                        setMainRepositoryImportSuccess(false);
                    }
                    return false;
                }
            );
        }
    }

    const deleteAndImportRepository = async (azureToken: string) => {
        const repositoryUtility = await new RepositoryUtility(azureToken);
        console.log("current repository:", currentTargetRepositoryName);
        await repositoryUtility.deleteRepository(currentTargetRepositoryName);
        showFeedBack(await importRepo(currentTargetRepositoryName, currentSourceUrl, azureToken, currentRepoType), currentTargetRepositoryName)

    }

    const buildRepositoryLink = (repositoryName: string): string => {
        return `https://dev.azure.com/${organizationName}/${projectName}/_git/${repositoryName}`;

    }

    const showFeedBack = (importState: boolean, repositoryName: string) => {
        console.log("feedback result:", importState)
        if (importState) {
            const Message = () => (<div>Imported <b>{repositoryName}</b> successfully</div>);
            toast.success(
                <Message/>, {...toastOptions, toastId: '200'});
        } else {
            const Message = () => (<div>Importing <b> {repositoryName} </b> failed</div>);
            toast.error(<Message/>, ({...toastOptions, toastId: '404'}))
        }
    }
    const getImportState = () => {
        if (modeState.mode === "BASIC") {
            return imported;
        }
        return mainRepositoryImportSuccess && baseRepositoryImportSuccess;
    }
    return (
        <AzureAuthConsumer>
            {azureCtx => azureCtx &&
                <WizardStepComponent
                    title="Step 2/5: Import Repositories"
                    //Not an elegant solution but extracting this to  a component will cause the whole component
                    // to rerender in a user unfriendly way
                    components={[
                        <div>
                            <div className="row mb-3">
                                <div className="col-6"><i>Organization:<b className="ml-1">{organizationName}</b></i>
                                </div>
                                <div className="col-6"><i>Project: <b className="ml-1">{projectName}</b></i></div>
                            </div>
                            <Accordion className="w-100 m-1" defaultActiveKey="0">
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="0"> <i style={BLUE}>Basic</i>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <Button className="m-4" variant="outline-primary" onClick={async () => {
                                                const basicModeUtility: BasicModeUtility = await new BasicModeUtility(azureCtx.azureState.azureToken);
                                                const basicImportBaseRepoState = await basicModeUtility.basicModeImportRepository("Base-Container",
                                                    "https://github.com/MouadhKh/Base-Container.git", repositoryDispatch, "BASE");
                                                const basicImportMainRepoState = await basicModeUtility.basicModeImportRepository(projectName,
                                                    "https://github.com/MouadhKh/MainProject.git", repositoryDispatch, "MAIN");
                                                showFeedBack(basicImportMainRepoState && basicImportBaseRepoState, "");
                                                setImported(basicImportMainRepoState && basicImportBaseRepoState);
                                                setAdvancedVisible("invisible");
                                            }
                                            }> <BiImport className="mr-2"/> Auto-Import</Button>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card className={advancedVisible}>
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        <i style={BLUE}>Advanced</i>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
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
                                                    <InputGroup.Text className="ml-2">Target
                                                        Repository</InputGroup.Text>
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
                                                            onClick={async () => {
                                                                setCurrentRepoType("BASE");
                                                                setCurrentTargetRepositoryName(baseTargetRef.current.value);
                                                                setCurrentSourceUrl(baseSrcRef.current.value);
                                                                const importResult = await importRepo(baseTargetRef.current.value,
                                                                    baseSrcRef.current.value, azureCtx.azureState.azureToken, "BASE");
                                                                showFeedBack(importResult, baseTargetRef.current.value);
                                                            }}><BiImport className="mr-2"/>Import</Button>
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
                                                <label className="mr-3" htmlFor="Not Main Repository ?"> Target : Not
                                                    Main
                                                    Repository </label>
                                                <InputGroup.Checkbox disabled={mainRepositoryImportSuccess}
                                                                     checked={!isMainRepository}
                                                                     onChange={() => {
                                                                         setIsMainRepository(!isMainRepository);
                                                                         console.log("not main repository checked")
                                                                     }}/>
                                                {!isMainRepository &&
                                                <FormControl disabled={mainRepositoryImportSuccess} ref={mainTargetRef}
                                                             placeholder="Target Repository Name"/>}
                                                <InputGroup.Append>
                                                    <Button className="ml-2" variant="outline-primary"
                                                            disabled={mainRepositoryImportSuccess}
                                                            onClick={async () => {
                                                                setCurrentRepoType("MAIN");
                                                                setCurrentTargetRepositoryName(getMainRepositoryTargetName());
                                                                setCurrentSourceUrl(mainSrcRef.current.value);
                                                                const importResult = await importRepo(getMainRepositoryTargetName(),
                                                                    mainSrcRef.current.value, azureCtx.azureState.azureToken, "MAIN")
                                                                showFeedBack(importResult, getMainRepositoryTargetName());
                                                            }}><BiImport className="mr-2"/> Import</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            <RepositoryDeleteConfirmationModal show={deletionConfirmation}
                                                                               onHide={() => {
                                                                                   setDeletionConfirmation(false)
                                                                               }} onConfirm={async () => {
                                                await deleteAndImportRepository(azureCtx.azureState.azureToken).then(() => {
                                                    setDeletionConfirmation(false);
                                                });
                                            }}/>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            <ToastContainer/>
                        </div>]}
                    nextEnabled={getImportState()}
                />
            }
        </AzureAuthConsumer>
    );
}