import {Row} from "react-bootstrap-grid-component/dist/Row";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import "react-toastify/dist/ReactToastify.css";

import {Container} from "react-bootstrap-grid-component/dist/Container";
//TODO pull those kind of imports to configwizard.tsx
import 'react-dropdown/style.css';
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {BLUE} from "../../styleConstants";
import Dropdown from "react-dropdown";
import {Button, FormControl, InputGroup} from "react-bootstrap";
import {GoDiffAdded} from "react-icons/all";
import PipelineUtility from "../../../../utils/PipelineUtility";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import BranchUtility from "../../../../utils/BranchUtility";
import ServiceEndpointUtility from "../../../../utils/ServiceEndpointUtility";
import FileUtility from "../../../../utils/FileUtility";
import {FileObject} from "../../../../utils/types";
import {IBranchSelector} from "../utilityComponents/BranchSelector";

interface IAdvancedModePipelineCreation {
    repositoryName: string,
    dockerEndpoint: string,
    azureToken: string
}

/**
 * Custom Pipeline creation
 * Features :
 * - Edit pipelin
 */
export const AdvancedModePipelineCreation = ({
                                                 repositoryName,
                                                 dockerEndpoint,
                                                 azureToken
                                             }: IAdvancedModePipelineCreation) => {
    const [files, setFiles]: any = useState([]);
    const [selectedBranchName, setSelectedBranchName]: any = useState([]);
    const [branchNames, setBranchNames] = useState([]);
    const [endpointId, setEndpointId] = useState("");
    const [currentPipelineName, setCurrentPipelineName] = useState("");
    const pipelineRef: any = useRef(null);
    useEffect(() => {
        const fetchPipelineFiles = async () => {
            const fileUtility: FileUtility = await new FileUtility(azureToken);
            fileUtility.getPipelineFiles(repositoryName, selectedBranchName)
                .then(response => setFiles(response))
        }
        fetchPipelineFiles().then(() => console.log("pipeline files fetched successfully"));
    }, [selectedBranchName])


    useEffect(() => {
            const initBranches = async () => {
                const branchUtility: BranchUtility = await new BranchUtility(azureToken);
                branchUtility.getBranchNames(repositoryName)
                    .then((response) => {
                            setBranchNames(response);
                            setSelectedBranchName(response[0]);
                        }
                    )
            }
            initBranches().then(() => console.log("branches initialized successfully"));
        },
        []);
    useEffect(() => {
        const initEndPoint = async () => {
            const serviceEndpointUtility: ServiceEndpointUtility = await new ServiceEndpointUtility(azureToken);
            serviceEndpointUtility.getServiceEndpointId(dockerEndpoint)
                .then(response => setEndpointId(response))
        }
        initEndPoint().then(() => console.log("endpoint id set successfully"));
    }, [])
    //TODO extract with setSelect as prop and selectedBranchName as Prop
    const BranchSelector = ({branchNames}: IBranchSelector) => {
        return (
            <div className="row">
                <label style={BLUE} className="mr-3">Select a branch </label>
                <Dropdown options={branchNames} onChange={(option) => {
                    //TODO refactor with setSelect.. as a prop
                    setSelectedBranchName(option.value)
                }} value={selectedBranchName} placeholder="Select Branch"/>
            </div>
        );
    }
    const showFeedback = (triggerStatus: boolean, pipelineName: string) => {
        if (triggerStatus) {
            toast.success(`Pipeline ${pipelineName} created and triggered successfully`, toastOptions);
        } else {
            toast.error(`Pipeline ${pipelineName} couldn't be created`, toastOptions);
        }
    }
    const createAndTriggerPipeline = async (file: FileObject) => {
        const pipelineUtility: PipelineUtility = await new PipelineUtility(azureToken);
        const createAndDeleteStatus = await pipelineUtility.deleteAndCreatePipeline(repositoryName, selectedBranchName,
            pipelineRef.current.value, file.path);
        if (createAndDeleteStatus) {
            console.log("pipeline Ref:", pipelineRef.current.value)
            console.log("current pipelineName", currentPipelineName);
            const grantPermissionStatus = await pipelineUtility.grantPipelinesPermissionToServiceEndpoint(endpointId, repositoryName,
                [currentPipelineName])
            if (grantPermissionStatus == 200) {
                const triggerStatus = await pipelineUtility.triggerPipeline(repositoryName, pipelineRef.current.value, selectedBranchName);
                showFeedback(triggerStatus == 200, pipelineRef.current.value);
            }
        }
    }
    return (
        <Container>
            <BranchSelector repositoryName={repositoryName}
                            branchNames={branchNames}
                            selectBranch={setSelectedBranchName}
                            selectedBranch={selectedBranchName}
            />
            <Row>
                {files.map((file: FileObject) => {
                    return (<Column className="m-3" key={file.objectId}>
                        <FileRepresentationComponent fileObj={file}
                                                     azureToken={azureToken}
                                                     withButtons={false}
                                                     branchName={selectedBranchName}
                                                     repositoryName={repositoryName}/>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    Pipeline Name
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl style={{width: '50%'}} type="text" required
                                         ref={pipelineRef}
                                         placeholder="Pipeline"
                                         aria-label="Pipeline"
                                         aria-describedby="Pipeline"
                            />
                            <Button className="mr-1" variant="outline-primary"
                                    onClick={async () => {
                                        setCurrentPipelineName(pipelineRef.current.value);
                                        await createAndTriggerPipeline(file)
                                    }
                                    }><GoDiffAdded/> Create
                            </Button>
                        </InputGroup>
                    </Column>);
                })}
            </Row>
            <ToastContainer/>
        </Container>
    );
}