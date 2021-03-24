// // import {useEffect, useState} from "react";
// // import {getRepositoryByName, getRepositoryId} from "../../../../utils/RepositoryUtils";
// // import {getCurrentProjectName} from "../../../../utils/ProjectUtils";
import * as React from "react";
import {useEffect} from "react";
import RepositoryUtility from "../../../../utils/RepositoryUtility";
import FileUtility from "../../../../utils/FileUtility";
import PipelineUtility from "../../../../utils/PipelineUtility";
// import {BasicModePipelineManagementComponent} from "../basicModeComponents/BasicModePipelineManagementComponent";
// import {BasicModeDockerManagementComponent} from "../basicModeComponents/BasicModeDockerManagementComponent";
// import {BasicModePipelineCreation} from "../basicModeComponents/BasicModePipelineCreation";
// import {useEffect} from "react";
// import {getServiceEndpointByName, listServiceEndpoints} from "../../../../utils/ServiceEndpointUtility";
// import {AdvancedModePipelineCreation} from "../advancedModeComponents/AdvancedModePipelineCreation";
// // import {
// //     FileObject,
// //     getDockerFiles,
// //     getFileData,
// //     getPipelineFiles,
// //     pushFile,
// //     updateFile
// // } from "../../../../utils/ContentUtils";
// // import {getRefs, listBranches} from "../../../../utils/BranchUtils";
// // import {getOrganizationName} from "../../../../utils/OrganizationUtils";
// // import {Button} from "react-bootstrap";
// // import {getCommits, getLastCommit} from "../../../../utils/CommitsUtils";
// // import {FileRepresentationComponent} from "../FileRepresentationComponent";
// // import {PipelineManagementComponent} from "../PipelineManagementComponent";
// // import {AdvancedDockerManagementComponent} from "../AdvancedDockerManagementComponent";
// // import {ManageDockerStep} from "./ManageDockerStep";
// //
// import * as SDK from "azure-devops-extension-sdk";
// import {getDefaultAgentPool, listAgentPools} from "../../../../utils/AgentPoolUtils";
//
export const TestStep = () => {
//     // useEffect(() => {
//     //     triggerPipeline("ConfigTest", "Test Test", "ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a")
//     //         .then((response) => console.log(response))
//     //     // createPipelineWithBranch("ConfigTest", "Test Test", "/pipelines/test.yml", "test", "ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a")
//         //     .then(value => console.log(value));
//         // listAgentPools("ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a").then(response => console.log("pools", response));
//         // getDefaultAgentPool("ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a").then(pool => console.log("default pool:", pool));
//     // }, []);
//     // useEffect(() => {
//     //     // getDefinitionByName("Build ConfigTest", "ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a")
//     //     //     .then(response =>
//     //     //     console.log(response));
//     //     // listDefinitions("40a94d1d-cde0-456d-b4be-f8ed12fcb5b2", "ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a").then(response => console.log("definitions from teststep", response));
//     //     deletePipeline("ConfigTest", "Build ConfigTest",
//     //         "ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a")
//     //         .then(response => console.log("delete response:", response));
//     // }, []);
// //     const [repositoryId, setRepositoryId] = useState("");
// //     const [projectName, setProjectName] = useState("");
// //     const [pipelineFiles, setPipelineFiles]: any = useState([]);
// //     const [organization, setOrganization] = useState("");
// //     const [branches, setBranches] = useState([]);
// //     const [commits, setCommits] = useState(null);
// //     const [filesReady, setFilesReady] = useState(false);
// //     // useEffect(() => {
// //     //     const isMounted = true;
// //     //     if (isMounted) {
// //     // getRepositoryId("test", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
// //     //     .then((repoId) => setRepositoryId(repoId));
// //     // getCurrentProjectName().then((name) => setProjectName(name));
// //     // getDockerFiles("ConfigTest", ,"m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
// //     // .then(response => setPipelineFiles(response))
// //     // getOrganizationName().then(org => setOrganization(org));
// //     // getRefs("ConfigTest", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
// //     // .then((response) => setBranches(response));
// //     // getLastCommit("test", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola").then((response) =>
// //     //     setCommits(response))
// //     // }
// //     // }, [])
// //
// //     useEffect(() => {
// //         const isMounted = true;
// //         if (isMounted) {
// //             setFilesReady(true);
// //         }
// //     }, [pipelineFiles]);
// //     useEffect(() => {
// //         console.log("service endpoints", listServiceEndpoints("m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"))
// //         getServiceEndpointByName("dockerHub", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola").then((response) => {
// //             grantPipelinesPermissionToServiceEndpoint(response.id, "MainProject", ["Build MainProject","Test MainProject"], "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola");
// //             console.log("service endpoint found:", response)
// //         });
// //     }, [])
    useEffect(() => {
        const func = async () => {
            const repositoryUtility = await new RepositoryUtility("4e4pjak7fc33sbfchfteyztul6wliy4szimid6saxwj62tkhzllq");
            const fileUtility: FileUtility = await new FileUtility("4e4pjak7fc33sbfchfteyztul6wliy4szimid6saxwj62tkhzllq");
            fileUtility.getAllFiles("ConfigTest", "dev").then(response => console.log("files", response));
            repositoryUtility.listRepositories().then((response) => console.log("response rep:", response))
            const pipelinesUtility = await new PipelineUtility("4e4pjak7fc33sbfchfteyztul6wliy4szimid6saxwj62tkhzllq");
            pipelinesUtility.listPipelines().then(response => console.log("pipeliiines:", response));
        }
        func();

    }, [])
    return (
        <div>
            Test
            {/*<h5>MainProject</h5>*/}
            {/*<AdvancedPipelineCreation azureToken="ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a"*/}
            {/*                          repositoryName="MainProject" dockerEndpoint="dockerHub"/>*/}
            {/*<h5>Base-Container</h5>*/}
            {/*<AdvancedPipelineCreation azureToken="ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a"*/}
            {/*                          repositoryName="Base-Container" dockerEndpoint="dockerHub"/>*/}
            {/*Test*/}
            {/*<BasicModeCreatePipeline projectName="ConfigTest"*/}
            {/*                         azureToken="m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"*/}
            {/*                         dockerEndpoint="dockerHub"/>*/}
            {/*<BasicModePipelineManagementComponent repositoryNames={["Base-Container", "MainProject"]} dockerUser="kaiiz3n"*/}
            {/*                                      dockerRegistry="dockerHub"*/}
            {/*                                      azureToken="m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"/>*/}
            {/*<BasicModeDockerManagementComponent repositoryName="MainProject" dockerUser="kaiiz3n" dockerRegistry="dockerHub"*/}
            {/*                                    azureToken="m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"/>*/}
        </div>
        //         // <div>
//         //     <AdvancedDockerManagementComponent repositoryName="ConfigTest"
//         //                                azureToken="m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola"/>
//         //     <Button className="mt-3" variant="primary" onClick={() => {
//         //         console.log("docker files", pipelineFiles);
//         //         setFilesReady(true)
//         //     }
//
//         // pushFile("test", "main", "/test.yml", "testest", "pushFile", "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
//         // push(fileObj: FileObject, repositoryName: string, branchName: string, content: string, comment: string, azureToken: string) {
//
//         //     updateFile(pipelineFiles[0], "test", "main", "test push", "updated build",
//         //         "m2kppzfgjuzransb7q7s5awd3ameb3z7mdikzdh7zpgnip7zaola")
//         // }>PUSH</Button>
//         // test
//         // </div>
    );
}