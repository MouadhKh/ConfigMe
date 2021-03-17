import * as React from "react";
import {useEffect, useState} from "react";
import {getDockerFiles} from "../../../../utils/ContentUtils";
import {getBranchNames} from "../../../../utils/BranchUtils";

import {Button} from "react-bootstrap";

import {getCurrentProjectName, getProjectByName} from "../../../../utils/ProjectUtils";
import {configure} from "../../../../utils/basicModeUtils/BasicModeUtils";
import {GrDocumentConfig} from "react-icons/all";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import {getOrganizationName} from "../../../../utils/OrganizationUtils";


export interface IBasicDockerManagement {
    repositoryName: string
    dockerUser: string,
    dockerRegistry: string,
    azureToken: string

}

export const BasicModeDockerManagementComponent = ({
                                                   repositoryName,
                                                   dockerUser,
                                                   dockerRegistry,
                                                   azureToken
                                               }: IBasicDockerManagement) => {
    const [mainBranchNames, setMainBranchNames] = useState([]);

    useEffect(() => {
            //TODO interesting pattern
            const isMounted = true;
            if (isMounted) {
                //Base repository must be always first
                getBranchNames(repositoryName, azureToken).then(response =>
                    setMainBranchNames(response));
            }
        },
        []);
    const showFeedBack = (success: boolean) => {
        if (success) {
            toast.success(`${repositoryName.toLowerCase()} : Docker files configuration finished with success`, toastOptions);
        } else {
            toast.error(`${repositoryName.toLocaleLowerCase()} : Docker files configuration failed`, toastOptions);
        }
    }
    return (
        <div>
            <Button className="m-4" variant="outline-primary" onClick={async () => {
                const dockerPushState = await configure( repositoryName,mainBranchNames,  dockerRegistry, dockerUser, getDockerFiles, azureToken);
                showFeedBack(dockerPushState);
            }
            }> <GrDocumentConfig className="mr-2"/> Auto-Configure</Button>
            <ToastContainer/>
        </div>
    );
}