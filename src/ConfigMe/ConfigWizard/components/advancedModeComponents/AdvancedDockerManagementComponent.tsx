import {useEffect, useState} from "react";
import FileUtility from "../../../../utils/FileUtility";
import BranchUtility from "../../../../utils/BranchUtility";
import {Button} from "react-bootstrap";
import * as React from "react";
import {BLUE} from "../../styleConstants";
import {Container} from "react-bootstrap-grid-component/dist/Container";
import {Row} from "react-bootstrap-grid-component/dist/Row";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import {AiOutlineFileAdd} from "react-icons/all";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {EditorComponent} from "../modals/EditorComponent";
import {FileObject} from "../../../../utils/types";


interface IDockerManagementComponent {
    repositoryName: string,
    azureToken: string
}

export const AdvancedDockerManagementComponent = ({repositoryName, azureToken}: IDockerManagementComponent) => {
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [branchNames, setBranchNames] = useState([]);
    const [showEditorCreate, setShowEditorCreate] = useState(false);
    const [files, setFiles]: any = useState([]);
    const fileUtility: FileUtility = new FileUtility(azureToken);
    const branchUtility: BranchUtility = new BranchUtility(azureToken);
    useEffect(() => {
        const isMounted = true;
        if (isMounted) {
            fileUtility.getDockerFiles(repositoryName, selectedBranchName)
                .then(response => setFiles(response))
        }
    }, [selectedBranchName]);
    useEffect(() => {
            //TODO interesting pattern
            const isMounted = true;
            if (isMounted) {
                branchUtility.getBranchNames(repositoryName)
                    .then((response) => {
                            setBranchNames(response);
                            setSelectedBranchName(response[0]);
                        }
                    )
            }
        },
        []);

    interface IBranchSelector {
        branchNames: any[]
        repositoryName: string
        azureToken: string
    }

    //TODO extract component
    const BranchSelector = ({branchNames}: IBranchSelector) => {
        return (
            <div className="row">
                <label style={BLUE} className="mr-3">Select a branch </label>
                <Dropdown options={branchNames} onChange={(option) => {
                    setSelectedBranchName(option.value)
                }} value={selectedBranchName} placeholder="Select Branch"/>
            </div>
        );
    }
    return (
        <div>
            <Container className="col-10 m-4">
                <BranchSelector repositoryName={repositoryName}
                                branchNames={branchNames}
                                azureToken={azureToken}/>
                <Row>
                    {files.map((file: FileObject) => {
                        return (<Column className="m-3" key={file.objectId}>
                            <FileRepresentationComponent fileObj={file}
                                                         withButtons={true}
                                                         azureToken={azureToken}
                                                         branchName={selectedBranchName}
                                                         repositoryName={repositoryName}/>
                        </Column>);
                    })}
                </Row>
            </Container>
            <Button className="mt-4" variant="outline-primary" onClick={() => {
                setShowEditorCreate(true);
            }}><AiOutlineFileAdd/> Add Dockerfile</Button>
            <EditorComponent show={showEditorCreate} title="Add Dockerfile" mode="dockerfile" content="" onHide={() =>
                setShowEditorCreate(false)} type="CREATE" repositoryName={repositoryName}
                             branchName={selectedBranchName} azureToken={azureToken}/>
        </div>
    );
}