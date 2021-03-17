import {GiPartyPopper} from "react-icons/all";
import * as React from "react";
import {useEffect, useState} from "react";
import {
    deleteAndCreatePipeline,
    grantPipelinesPermissionToServiceEndpoint,
    triggerPipeline
} from "../../../../utils/PipelineUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import "react-toastify/dist/ReactToastify.css";
import {getServiceEndpointByName} from "../../../../utils/ServiceEndpointUtils";
import {BLUE} from "../../styleConstants";
import {Spinner} from "react-bootstrap";

export interface IBasicModeCreatePipeline {
    projectName: string,
    dockerEndpoint: string,
    azureToken: string
}

export const BasicModeCreatePipeline = ({
                                            projectName,
                                            dockerEndpoint,
                                            azureToken
                                        }: IBasicModeCreatePipeline) => {
    const [pipelineCreated, setPipelineCreated] = useState(false);
    const [pipelineTriggered, setPipelineTriggered] = useState(false);
    useEffect(
        () => {
//TODO investigate more on the pipelines on other branches
            const createPipelines = async () => {
                const baseContainer = await deleteAndCreatePipeline("Base-Container", "main", "Build Base-Container", "/pipelines/build_base.yml", azureToken);
                const buildDevMainProject = await deleteAndCreatePipeline(projectName, "dev", `Build ${projectName}`, "/pipelines/build_dev.yml", azureToken);
                const testMainProject = await deleteAndCreatePipeline(projectName, "dev", `Test ${projectName}`, "/pipelines/test.yml", azureToken)
                const buildProductionContainer = await deleteAndCreatePipeline(projectName, "release", `Build Production Container`, "/pipelines/build_production_container.yml", azureToken);
                const releaseMainProject = await deleteAndCreatePipeline(projectName, "release", `Release ${projectName}`, "/pipelines/build_release.yml", azureToken);
                const responseStatus = [baseContainer, buildDevMainProject, testMainProject, buildProductionContainer, releaseMainProject];
                return responseStatus.every(status => status == 200);
            }
            createPipelines().then(status => {
                showFeedback("Pipelines Creation", status);
                setPipelineCreated(status);
            })
        }, []);
    useEffect(() => {
            const triggerPipelines = async () => {
                const baseContainerStatus = await triggerPipeline("Base-Container", "Build Base-Container",
                    "main", azureToken);
                const buildDevMainProjectStatus = await triggerPipeline(projectName, `Build ${projectName}`, "dev", azureToken);
                const testMainProjectStatus = await triggerPipeline(projectName, `Test ${projectName}`, "test", azureToken);
                const buildProductionContainerStatus = await triggerPipeline(projectName, `Build Production Container`, "release", azureToken);
                const releaseMainProjectStatus = await triggerPipeline(projectName, `Release ${projectName}`, "release", azureToken);
                const responseStatus = [baseContainerStatus, buildDevMainProjectStatus, testMainProjectStatus, buildProductionContainerStatus, releaseMainProjectStatus];
                return responseStatus.every((status) => status == 200);
            }
            if (pipelineCreated) {
//The grant process needs to happen sequentially
                getServiceEndpointByName(dockerEndpoint, azureToken)
                    .then((response: any) => {
                            //Grant permission to docker registry for build base container pipeline
                            grantPipelinesPermissionToServiceEndpoint(response.id, "Base-Container",
                                [`Build Base-Container`], azureToken).then(() =>
                                //Grant permission to docker registry for MainProject pipelines
                                grantPipelinesPermissionToServiceEndpoint(response.id, projectName,
                                    [`Build ${projectName}`, `Test ${projectName}`, `Build Production Container`, `Release ${projectName}`], azureToken)
                                    .then((response) => {
                                            if (response == 200) {
                                                triggerPipelines().then((status) => {
                                                    showFeedback("Trigger pipelines", status)
                                                    setPipelineTriggered(status);
                                                })
                                            }
                                        }
                                    )
                            )
                        }
                    )
            }
        }
        , [pipelineCreated]
    );
    const showFeedback = (operation: string, successStatus: boolean) => {
        if (successStatus) {
            toast.success(`${operation} finished with success !`, toastOptions)
        } else {
            toast.error(`${operation}\n failed, check console for more details.`, toastOptions)
        }
    }
    const BasicModeWizardResult = () => {
        if (!pipelineTriggered) {
            return (
                <div className="mt-4">
                    <h4>Configuration in progress</h4>
                    <Spinner animation="border" role="status" variant="primary">
                    </Spinner>
                </div>
            );
        }
        return (<div className="mt-2">
            <h2 color="#B5E550">Configuration finished successfully <div style={BLUE}><GiPartyPopper
                size={128}/></div><br/>
                You can now start coding...
            </h2>
        </div>);
    }
    return (
        <div>
            <div className="h-100 d-flex justify-content-center align-items-center">
                <BasicModeWizardResult/>
            </div>
            <ToastContainer/>
        </div>
    );
}