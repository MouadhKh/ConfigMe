import {GiPartyPopper} from "react-icons/all";
import * as React from "react";
import {useEffect, useState} from "react";
import PipelineUtility from "../../../../utils/PipelineUtility";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import "react-toastify/dist/ReactToastify.css";
import {BLUE} from "../../styleConstants";
import {Spinner} from "react-bootstrap";
import ServiceEndpointUtility from "../../../../utils/ServiceEndpointUtility";

export interface IBasicModeCreatePipeline {
    projectName: string,
    dockerEndpoint: string,
    azureToken: string
}

/**
 *
 * @param projectName
 * @param dockerEndpoint
 * @param azureToken
 * @constructor
 */
export const BasicModePipelineCreation = ({
                                              projectName,
                                              dockerEndpoint,
                                              azureToken
                                          }: IBasicModeCreatePipeline) => {
    const [pipelineCreated, setPipelineCreated] = useState(false);
    const [pipelineTriggered, setPipelineTriggered] = useState(false);
    useEffect(
        () => {
            const createPipelines = async () => {
                const pipelineUtility = await new PipelineUtility(azureToken);
                const baseContainer = await pipelineUtility.deleteAndCreatePipeline("Base-Container", "main", "Build Base-Container", "/pipelines/build_base.yml");
                const buildDevMainProject = await pipelineUtility.deleteAndCreatePipeline(projectName, "dev", `Build ${projectName}`, "/pipelines/build_dev.yml");
                const testMainProject = await pipelineUtility.deleteAndCreatePipeline(projectName, "dev", `Test ${projectName}`, "/pipelines/test.yml")
                const buildProductionContainer = await pipelineUtility.deleteAndCreatePipeline(projectName, "release", `Build Production Container`, "/pipelines/build_production_container.yml");
                const releaseMainProject = await pipelineUtility.deleteAndCreatePipeline(projectName, "release", `Release ${projectName}`, "/pipelines/build_release.yml");
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
                const pipelineUtility = await new PipelineUtility(azureToken);
                const baseContainerStatus = await pipelineUtility.triggerPipeline("Base-Container", "Build Base-Container",
                    "main");
                const buildDevMainProjectStatus = await pipelineUtility.triggerPipeline(projectName, `Build ${projectName}`, "dev");
                const testMainProjectStatus = await pipelineUtility.triggerPipeline(projectName, `Test ${projectName}`, "dev");
                const buildProductionContainerStatus = await pipelineUtility.triggerPipeline(projectName, `Build Production Container`, "release");
                const releaseMainProjectStatus = await pipelineUtility.triggerPipeline(projectName, `Release ${projectName}`, "release");
                const responseStatus = [baseContainerStatus, buildDevMainProjectStatus, testMainProjectStatus, buildProductionContainerStatus, releaseMainProjectStatus];
                return responseStatus.every((status) => status == 200);
            }
            const grantPermissionsAndTrigger = async () => {
                const serviceEndpointUtility: ServiceEndpointUtility = await new ServiceEndpointUtility(azureToken);
                const pipelineUtility = await new PipelineUtility(azureToken);
//The grant process needs to happen sequentially(before triggering)
                serviceEndpointUtility.getServiceEndpointByName(dockerEndpoint)
                    .then((response: any) => {
                            //Grant permission to docker registry for build base container pipeline
                            pipelineUtility.grantPipelinesPermissionToServiceEndpoint(response.id, "Base-Container",
                                [`Build Base-Container`]).then(() =>
                                //Grant permission to docker registry for MainProject pipelines
                                pipelineUtility.grantPipelinesPermissionToServiceEndpoint(response.id, projectName,
                                    [`Build ${projectName}`, `Test ${projectName}`, `Build Production Container`, `Release ${projectName}`])
                                    .then((response) => {
                                            if (response == 200) {
                                                console.log("granted from outside");
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
            if (pipelineCreated) {
                grantPermissionsAndTrigger().then
                (() => console.log("pipelines triggered successfully"));
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