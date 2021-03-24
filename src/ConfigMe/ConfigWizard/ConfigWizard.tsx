import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./ConfigWizard.css";
import {Page} from "azure-devops-ui/Page";
import * as SDK from "azure-devops-extension-sdk";
import {useEffect} from "react";
import {Wizard} from "react-use-wizard";
import {ContextDevTool} from "react-context-devtool";
import {
    DockerAuthProvider
} from "./statemanagement/contexts/DockerAuthContext";
import {AuthenticationStep} from "./components/stepComponents/AuthenticationStep";
import {AzureAuthProvider} from "./statemanagement/contexts/AzureAuthContext";
import {ImportRepositoriesStep} from "./components/stepComponents/ImportRepositoriesStep";
import {RepositoriesContext, RepositoriesProvider} from "./statemanagement/contexts/RepositoriesContext";
import {ModeProvider} from "./statemanagement/contexts/ModeContext";
import {CreatePipelinesStep} from "./components/stepComponents/CreatePipelinesStep";
import {showRootComponent} from "../../Common";
import {AzureAuthComponent} from "./components/authComponents/AzureAuthComponent";
import {ManageDockerStep} from "./components/stepComponents/ManageDockerStep";
import {ManagePipelineStep} from "./components/stepComponents/ManagePipelineStep";
import {WizardStepComponent} from "./components/stepComponents/WizardStepComponent";
import {TestStep} from "./components/stepComponents/TestStep";

/**
 * Root Component, Container of the wizard steps
 */
export const ConfigWizard = () => {
    useEffect(() => {
        initializeState().then(() => {
            console.log("SDK Initialized");
        })
    }, []);
    const initializeState = async () => {
        await SDK.init();
        await SDK.ready();
    }
    return (
        <Page className="page-content m-5">
            <ModeProvider>
                <AzureAuthProvider>
                    <DockerAuthProvider>
                        <RepositoriesProvider>
                            <div>
                                <ContextDevTool context={RepositoriesContext} id="repositoriesCtx"
                                                displayName="Repositories Context"/>
                                <div style={{width: '100%'}} className="container">
                                    <Wizard>
                                        <AuthenticationStep/>
                                        <ImportRepositoriesStep/>
                                        <WizardStepComponent components={[<ManagePipelineStep/>]}
                                                             title={"Step 3/5: Manage Pipeline files"}
                                        />
                                        <WizardStepComponent components={[<ManageDockerStep/>]}
                                                             title={"Step 4/5: Manage Dockerfiles"}
                                        />
                                        <WizardStepComponent components={[<CreatePipelinesStep/>]}
                                                             title="Step 5/5: Create pipelines"
                                                             nextVisible={false}
                                        />
                                        <WizardStepComponent components={[<AzureAuthComponent/>]} title="Step 2"
                                                             nextOnClick={() => console.log("step 2")}
                                                             nextEnabled={false}/>
                                    </Wizard>
                                </div>
                            </div>
                        </RepositoriesProvider>
                    </DockerAuthProvider>
                </AzureAuthProvider>
            </ModeProvider>
        </Page>
    );

}
showRootComponent(
    <ConfigWizard/>
);