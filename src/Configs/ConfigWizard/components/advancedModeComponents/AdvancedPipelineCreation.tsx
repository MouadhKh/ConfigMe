import {Row} from "react-bootstrap-grid-component/dist/Row";
import {FileObject, getPipelineFiles} from "../../../../utils/ContentUtils";
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
import {IAdvancedPipelineManagement, IBranchSelector} from "./AdvancedPipelineManagementComponent";
import {getBranchNames} from "../../../../utils/BranchUtils";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {GoDiffAdded} from "react-icons/all";
import {
    deleteAndCreatePipeline,
    grantPipelinesPermissionToServiceEndpoint,
    triggerPipeline
} from "../../../../utils/PipelineUtils";
import {getServiceEndpointId} from "../../../../utils/ServiceEndpointUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";

interface IAdvancedModePipelineCreation {
    repositoryName: string,
    dockerEndpoint: string,
    azureToken: string
}

export const AdvancedPipelineCreation = ({
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
        getPipelineFiles(repositoryName, selectedBranchName, azureToken)
            .then(response => setFiles(response))
    }, [selectedBranchName])
    useEffect(() => {
            getBranchNames(repositoryName, azureToken)
                .then((response) => {
                        setBranchNames(response);
                        setSelectedBranchName(response[0]);
                    }
                )
        },
        []);
    useEffect(() => {
        getServiceEndpointId(dockerEndpoint, azureToken).then(response => setEndpointId(response))
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

        const createAndDeleteStatus = await deleteAndCreatePipeline(repositoryName, selectedBranchName,
            pipelineRef.current.value, file.path, azureToken);
        if (createAndDeleteStatus) {
            console.log("pipeline Ref:", pipelineRef.current.value)
            console.log("current pipelineName", currentPipelineName);
            const grantPermissionStatus = await grantPipelinesPermissionToServiceEndpoint(endpointId, repositoryName,
                [currentPipelineName], azureToken)
            if (grantPermissionStatus == 200) {
                const triggerStatus = await triggerPipeline(repositoryName, pipelineRef.current.value, selectedBranchName, azureToken);
                showFeedback(triggerStatus == 200, pipelineRef.current.value);
            }
        }
    }
    return (
        <Container>
            <BranchSelector repositoryName={repositoryName}
                            branchNames={branchNames}
                            azureToken={azureToken}/>
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