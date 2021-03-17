import * as React from "react";
import {useEffect, useState} from "react";
import {getPipelineFiles} from "../../../../utils/ContentUtils";
import {getBranchNames} from "../../../../utils/BranchUtils";
import {Button} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import {configure} from "../../../../utils/basicModeUtils/BasicModeUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import {GrDocumentConfig} from "react-icons/all";


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
            //TODO interesting pattern
            const isMounted = true;
            if (isMounted) {
                console.log("repository names from basic mode :", repositoryNames);
                //Base repository must be always first
                getBranchNames(repositoryNames[0], azureToken)
                    .then((response) => {
                            setBaseBranchNames(response);
                        }
                    );
                getBranchNames(repositoryNames[1], azureToken).then(response =>
                    setMainBranchNames(response));
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

                let basePipelinesPushState = await configure(repositoryNames[0], baseBranchNames, dockerRegistry,
                    dockerUser, getPipelineFiles, azureToken);
                showFeedBack(basePipelinesPushState, repositoryNames[0]);
                let mainPipelinesPushState = await configure(repositoryNames[1], mainBranchNames, dockerRegistry, dockerUser, getPipelineFiles, azureToken);
                showFeedBack(mainPipelinesPushState, repositoryNames[1]);
            }
            }><GrDocumentConfig className="mr-2"/> Auto-Configure</Button>
            <ToastContainer/>
        </div>);
}