import * as React from "react";
import {useEffect, useState} from "react";
import BranchUtility from "../../../../utils/BranchUtility";
import {Button} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import {GrDocumentConfig} from "react-icons/all";
import BasicModeUtility from "../../../../utils/basicModeUtils/BasicModeUtility";


export interface IBasicPipelineManagement {
    repositoryNames: string[]
    dockerUser: string,
    dockerRegistry: string,
    azureToken: string
}

export const BasicModePipelineManagementComponent = ({
                                                         repositoryNames,
                                                         dockerUser,
                                                         dockerRegistry,
                                                         azureToken,

                                                     }: IBasicPipelineManagement) => {
    const [baseBranchNames, setBaseBranchNames] = useState([]);
    const [mainBranchNames, setMainBranchNames] = useState([]);
    useEffect(() => {
            const initBranchNames = async () => {
                const branchUtility = await new BranchUtility(azureToken);
                branchUtility.getBranchNames(repositoryNames[0])
                    .then((response) => {
                            setBaseBranchNames(response);
                        }
                    );
                branchUtility.getBranchNames(repositoryNames[1]).then(response =>
                    setMainBranchNames(response));
            }
            //TODO interesting pattern
            const isMounted = true;
            if (isMounted) {
                initBranchNames().then(() =>
                    console.log("repository names from basic mode :", repositoryNames));
                //Base repository must be always first
            }
        },
        []);

    const showFeedBack = (success: boolean, repositoryName: string) => {
        if (success) {
            toast.success(`${repositoryName} : Pipeline files configuration finished with success`, toastOptions);
        } else {
            toast.error(`${repositoryName} : Pipeline files configuration failed`, toastOptions);
        }
    }

    return (
        <div>
            <Button className="m-4" variant="outline-primary" onClick={async () => {
                const basicModeUtility = await new BasicModeUtility(azureToken);
                let basePipelinesPushState = await basicModeUtility.configurePipelineFiles(repositoryNames[0], baseBranchNames, dockerRegistry,
                    dockerUser);
                showFeedBack(basePipelinesPushState, repositoryNames[0]);
                let mainPipelinesPushState = await basicModeUtility.configurePipelineFiles(repositoryNames[1],
                    mainBranchNames, dockerRegistry, dockerUser);
                showFeedBack(mainPipelinesPushState, repositoryNames[1]);
            }
            }><GrDocumentConfig className="mr-2"/> Auto-Configure</Button>
            <ToastContainer/>
        </div>);
}