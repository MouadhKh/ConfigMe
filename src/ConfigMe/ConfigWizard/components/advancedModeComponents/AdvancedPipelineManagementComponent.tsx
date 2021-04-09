import {Button} from "react-bootstrap";
import * as React from "react";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import {Container} from "react-bootstrap-grid-component/dist/Container";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {Row} from "react-bootstrap-grid-component/dist/Row";
import {useEffect, useState} from "react";
import {AiOutlineFileAdd} from "react-icons/all";
import 'react-dropdown/style.css';
import {EditorComponent} from "../modals/EditorComponent";
import FilesUtility from "../../../../utils/FilesUtility";
import BranchUtility from "../../../../utils/BranchUtility";
import {FileObject} from "../../../../utils/types";
import {BranchSelector} from "../utilityComponents/BranchSelector";

export interface IAdvancedPipelineManagement {
    repositoryName: string
    azureToken: string
}


export const AdvancedPipelineManagementComponent = ({repositoryName, azureToken}: IAdvancedPipelineManagement) => {
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [branchNames, setBranchNames] = useState([]);
    const [files, setFiles]: any = useState([]);
    const [showEditorCreate, setShowEditorCreate] = useState(false);
    const fileUtility: FilesUtility = new FilesUtility(azureToken);
    const branchUtility: BranchUtility = new BranchUtility(azureToken);
    useEffect(() => {
        fileUtility.getPipelineFiles(repositoryName, selectedBranchName)
            .then(response => setFiles(response))
    }, [selectedBranchName])
    useEffect(() => {
            branchUtility.getBranchNames(repositoryName)
                .then((response) => {
                        setBranchNames(response);
                        setSelectedBranchName(response[0]);
                    }
                )
        },
        []);
    return (
        <div>
            <Container className="col-10 m-4">
                <BranchSelector repositoryName={repositoryName}
                                branchNames={branchNames}
                                selectBranch={setSelectedBranchName}
                                selectedBranch={selectedBranchName}/>
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
                <Button className="mt-4" variant="outline-primary"
                        onClick={() => setShowEditorCreate(true)}><AiOutlineFileAdd/> Add Pipeline File</Button>
                <EditorComponent show={showEditorCreate} title="Add Pipeline file" mode="yaml" content=""
                                 onHide={() =>
                                     setShowEditorCreate(false)} type="CREATE" repositoryName={repositoryName}
                                 branchName={selectedBranchName} azureToken={azureToken}/>
            </Container>
        </div>
    );
}
