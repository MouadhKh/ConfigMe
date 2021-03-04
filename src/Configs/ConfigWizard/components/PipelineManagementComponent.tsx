import {Button, Dropdown} from "react-bootstrap";
import * as React from "react";
import {BLUE} from "../styleConstants";
import {FileObject, getPipelineFiles} from "../../../utils/ContentUtils";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import {Container} from "react-bootstrap-grid-component/dist/Container";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {Row} from "react-bootstrap-grid-component/dist/Row";
import {useEffect, useState} from "react";
import {getBranchNames} from "../../../utils/BranchUtils";
import {RepositoriesConsumer} from "../statemanagement/contexts/RepositoriesContext";
import {RepositoriesData} from "../statemanagement/types";
import {AzureAuthConsumer} from '../statemanagement/contexts/AzureAuthContext';
import {AiOutlineFileAdd} from "react-icons/all";

interface IPipelineFiles {
    repositoryName: string
    azureToken: string
}

export const PipelineManagementComponent = ({repositoryName, azureToken}: IPipelineFiles) => {
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [branchNames, setBranchNames] = useState([]);
    const [files, setFiles]: any = useState([]);

    useEffect(() => {
        const isMounted = true;
        if (isMounted) {
            getPipelineFiles(repositoryName, azureToken)
                .then(response => setFiles(response))
        }
    }, [])
    useEffect(() => {
            //TODO interesting pattern
            const isMounted = true;
            if (isMounted) {
                getBranchNames(repositoryName, azureToken)
                    .then((response) => {
                            setBranchNames(response);
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

    const BranchSelector = ({branchNames}: IBranchSelector) => {
        const [toggleText, setToggleText] = useState("Select Branch")
        return (
            <Dropdown>
                <Dropdown.Toggle size="sm" variant="outline-primary" id="dropdown-basic">
                    {toggleText}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {branchNames.map(name => <Dropdown.Item eventKey={name}
                                                            onSelect={(event) => {
                                                                console.log("event:", event);
                                                                setSelectedBranchName(event!);
                                                            }} key={name}>{name}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
    // const onDelete = (fileObj: FileObject, repositoryName: string, pipelineName: string, azureToken: string) => {
    //     deletePipeline(repositoryName, pipelineName, azureToken)
    //         .then(() => deleteFile(repositoryName, selectedBranchName, fileObj, azureToken))
    // }
    return (
        <div>
            <h4 style={BLUE}>Existent pipeline definitions : </h4>
            <Container className="col-10">
                <BranchSelector repositoryName={repositoryName}
                                branchNames={branchNames}
                                azureToken={azureToken}/>
                <Row>
                    {files.map((file: FileObject) => {
                        return (<Column className="m-3" key={file.objectId}>
                            <FileRepresentationComponent fileObj={file}
                                                         azureToken={azureToken}
                                                         branchName={selectedBranchName}
                                                         repositoryName={repositoryName}/>
                        </Column>);
                    })}
                </Row>
                <Button className="mt-4"variant="outline-primary"><AiOutlineFileAdd/> Add Pipeline File</Button>
            </Container>
        </div>
    );
}
