import {useEffect, useState} from "react";
import {FileObject, getDockerFiles} from "../../../utils/ContentUtils";
import {getBranchNames} from "../../../utils/BranchUtils";
import {Button, Dropdown} from "react-bootstrap";
import * as React from "react";
import {BLUE} from "../styleConstants";
import {Container} from "react-bootstrap-grid-component/dist/Container";
import {Row} from "react-bootstrap-grid-component/dist/Row";
import {Column} from "react-bootstrap-grid-component/dist/Column";
import {FileRepresentationComponent} from "./FileRepresentationComponent";
import {AiOutlineFileAdd} from "react-icons/all";

interface IDockerManagementComponent {
    repositoryName: string,
    azureToken: string
}

export const DockerManagementComponent = ({repositoryName, azureToken}: IDockerManagementComponent) => {
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [branchNames, setBranchNames] = useState([]);
    const [files, setFiles]: any = useState([]);

    useEffect(() => {
        const isMounted = true;
        if (isMounted) {
            getDockerFiles(repositoryName, azureToken)
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
            //TODO https://react-bootstrap.github.io/components/dropdowns/ (dropdown button instead of toggle)
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
    return (
        <div>
            <h4 style={BLUE}>Dockerfiles : </h4>
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
            </Container>
            <Button className="mt-4" variant="outline-primary"><AiOutlineFileAdd/> Add Dockerfile</Button>
        </div>
    );
}