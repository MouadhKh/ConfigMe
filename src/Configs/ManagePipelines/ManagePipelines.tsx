// import * as React from 'react';
// import {showRootComponent} from "../../Common";
// import {Page} from "azure-devops-ui/Page";
// import {Header} from "azure-devops-ui/Header";
// import {Button} from "azure-devops-ui/Button";
// import {ButtonGroup} from "azure-devops-ui/ButtonGroup";
// import * as SDK from "azure-devops-extension-sdk";
// import PipelineAction from "./PipelineAction";
// import {getRepositoryByName} from "../../utils/RepositoryUtils";
//
// // //TODO try to delete this later
// // interface IHubContentState {
// //     selectedTabId: string;
// //     fullScreenMode: boolean;
// //     headerDescription?: string;
// //     useLargeTitle?: boolean;
// //     useCompactPivots?: boolean;
// // }
//
// class ManagePipelines extends React.Component<{}, {}> {
//     pipelineAction: PipelineAction;
//
//     constructor(props: {}) {
//         super(props)
//         this.pipelineAction = new PipelineAction();
//     }
//
//     private async initializeState() {
//         //TODO more initialization here when we have forms
//         await SDK.ready();
//     }
//
//     public componentDidMount() {
//         SDK.init();
//         this.initializeState();
//     }
//
//     public render(): JSX.Element {
//         return (
//             <Page className="page-content page-content-bottom flex-grow flex-center">
//                 <Header title="Manage Pipelines"/>
//                 <ButtonGroup>
//                     <Button
//                         text="Create Docker Registry"
//                         primary={true}
//                         onClick={() => this.pipelineAction.createDockerRegistry("dockerHub", "kaiiz3n", "1475963F16m")}
//                     />
//                     <Button
//                         text="Create Build Pipeline"
//                         primary={true}
//                         //TODO change this: project name  as repository name is bad idea
//                         onClick={() => this.pipelineAction.createPipeline("Build", "/pipelines/build.yml", "ConfigTest")}
//                     />
//                     <Button
//                         text="Trigger Build Pipeline"
//                         primary={true}
//                         onClick={() => this.pipelineAction.triggerPipeline("Build")}
//                     />
//                 </ButtonGroup>
//             </Page>
//
//         );
//     }
// }
//
//
// showRootComponent(
//     <ManagePipelines/>
// );