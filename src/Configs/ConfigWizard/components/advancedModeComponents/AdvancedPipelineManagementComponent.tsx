import {Button} from "react-bootstrap";
import * as React from "react";
import {BLUE} from "../../styleConstants";
import {FileObject, getPipelineFiles} from "../../../../utils/ContentUtils";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import {Container} from "react-bootstrap-grid-component/dist/Container";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {Row} from "react-bootstrap-grid-component/dist/Row";
import {useEffect, useState} from "react";
import {getBranchNames} from "../../../../utils/BranchUtils";
import {AiOutlineFileAdd} from "react-icons/all";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import {EditorComponent} from "../modals/EditorComponent";

export interface IAdvancedPipelineManagement {
    repositoryName: string
    azureToken: string
}

export interface IBranchSelector {
    branchNames: any[]
    repositoryName: string
    azureToken: string,
}

export const AdvancedPipelineManagementComponent = ({repositoryName, azureToken}: IAdvancedPipelineManagement) => {
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [branchNames, setBranchNames] = useState([]);
    const [files, setFiles]: any = useState([]);
    const [showEditorCreate, setShowEditorCreate] = useState(false);
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
// const onDelete = (fileObj: FileObject, repositoryName: string, pipelineName: string, azureToken: string) => {
//     deletePipeline(repositoryName, pipelineName, azureToken)
//         .then(() => deleteFile(repositoryName, selectedBranchName, fileObj, azureToken))
// }
    return (
        <div>
            <Container className="col-10 m-4">
                <BranchSelector repositoryName={repositoryName}
                                branchNames={branchNames}
                                azureToken={azureToken}/>
                <Row>
                    {files.map((file: FileObject) => {
                        return (<Column className="m-3" key={file.objectId}>
                            <FileRepresentationComponent withButtons={true} fileObj={file}
                                                         azureToken={azureToken}
                                                         branchName={selectedBranchName}
                                                         repositoryName={repositoryName}/>
                        </Column>);
                    })}
                </Row>
                <Button className="mt-4" variant="outline-primary"><AiOutlineFileAdd/> Add Pipeline File</Button>
                <EditorComponent show={showEditorCreate} title="Add Pipeline file" mode="yaml" content=""
                                 onHide={() =>
                                     setShowEditorCreate(false)} type="CREATE" repositoryName={repositoryName}
                                 branchName={selectedBranchName} azureToken={azureToken}/>
            </Container>
        </div>
    );
}
