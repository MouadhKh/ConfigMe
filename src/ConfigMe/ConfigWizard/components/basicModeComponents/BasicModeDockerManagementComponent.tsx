import * as React from "react";
import {useEffect, useState} from "react";

import {Button} from "react-bootstrap";

import {GrDocumentConfig} from "react-icons/all";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import {toastOptions} from "../messages/toasts";
import BasicModeUtility from "../../../../utils/BasicModeUtility";
import BranchUtility from "../../../../utils/BranchUtility";


export interface IBasicDockerManagement {
    repositoryName: string
    dockerUser: string,
    dockerRegistry: string,
    azureToken: string

}

/**
 * Basic Dockerfiles management : automatically replace placeholders
 * @param repositoryName
 * @param dockerUser
 * @param dockerRegistry
 * @param azureToken
 * @constructor
 */
export const BasicModeDockerManagementComponent = ({
                                                       repositoryName,
                                                       dockerUser,
                                                       dockerRegistry,
                                                       azureToken
                                                   }: IBasicDockerManagement) => {
    const [mainBranchNames, setMainBranchNames] = useState([]);
    useEffect(() => {
            const initMainBranchNames = async () => {
                const branchUtility: BranchUtility = await new BranchUtility(azureToken);
                //Base repository must be always first
                branchUtility.getBranchNames(repositoryName).then(response =>
                    setMainBranchNames(response));
            }
            const isMounted = true;
            if (isMounted) {
                initMainBranchNames().then(() => console.log("main branch names initialized successfully"))
            }
        },
        []);
    const showFeedBack = (success: boolean) => {
        if (success) {
            toast.success(`${repositoryName} : Docker files configuration finished with success`, toastOptions);
        } else {
            toast.error(`${repositoryName} : Docker files configuration failed`, toastOptions);
        }
    }
    return (
        <div>
            <Button className="m-4" variant="outline-primary" onClick={async () => {
                const basicModeUtility: BasicModeUtility = await new BasicModeUtility(azureToken);
                const dockerPushState = await basicModeUtility.configureDockerFiles(repositoryName, mainBranchNames, dockerRegistry, dockerUser);
                showFeedBack(dockerPushState);
            }
            }> <GrDocumentConfig className="mr-2"/> Auto-Configure</Button>
            <ToastContainer/>
        </div>
    );
}