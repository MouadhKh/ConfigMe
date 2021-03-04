import {useEffect, useState} from "react";
import {getRepositoryByName, getRepositoryId} from "../../../../utils/RepositoryUtils";
import {getCurrentProjectName} from "../../../../utils/ProjectUtils";
import * as React from "react";
import {
    FileObject,
    getDockerFiles,
    getFileData,
    getPipelineFiles,
    pushFile,
    updateFile
} from "../../../../utils/ContentUtils";
import {getRefs, listBranches} from "../../../../utils/BranchUtils";
import {getOrganizationName} from "../../../../utils/OrganizationUtils";
import {Button} from "react-bootstrap";
import {getCommits, getLastCommit} from "../../../../utils/CommitsUtils";
import {FileRepresentationComponent} from "../FileRepresentationComponent";
import {PipelineManagementComponent} from "../PipelineManagementComponent";
import {DockerManagementComponent} from "../DockerManagementComponent";

export const TestStep = () => {
    const [repositoryId, setRepositoryId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [pipelineFiles, setPipelineFiles]: any = useState([]);
    const [organization, setOrganization] = useState("");
    const [branches, setBranches] = useState([]);
    const [commits, setCommits] = useState(null);
    const [filesReady, setFilesReady] = useState(false);
    useEffect(() => {
        const isMounted = true;
        if (isMounted) {
            // getRepositoryId("test", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
            //     .then((repoId) => setRepositoryId(repoId));
            // getCurrentProjectName().then((name) => setProjectName(name));
            getDockerFiles("ConfigTest", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
                .then(response => setPipelineFiles(response))
            // getOrganizationName().then(org => setOrganization(org));
            // getRefs("ConfigTest", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
            // .then((response) => setBranches(response));
            // getLastCommit("test", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola").then((response) =>
            //     setCommits(response))
        }
    }, [])

    useEffect(() => {
        const isMounted = true;
        if (isMounted) {
            setFilesReady(true);
        }
    }, [pipelineFiles]);
    return (
        <div>
            <DockerManagementComponent repositoryName="ConfigTest" azureToken="m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"/>
            <Button className="mt-3" variant="primary" onClick={() => {
                console.log("docker files", pipelineFiles);
                setFilesReady(true)
            }

                // pushFile("test", "main", "/test.yml", "testest", "pushFile", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
                // push(fileObj: FileObject, repositoryName: string, branchName: string, content: string, comment: string, azureToken: string) {

                //     updateFile(pipelineFiles[0], "test", "main", "test push", "updated build",
                //         "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
            }>PUSH</Button>
            test
        </div>
    );
}