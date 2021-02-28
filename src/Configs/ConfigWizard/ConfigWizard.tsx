import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./ConfigWizard.css";
import {Page} from "azure-devops-ui/Page";
import * as SDK from "azure-devops-extension-sdk";
import {showRootComponent} from "../../Common";
import {AzureAuthComponent} from "./components/AzureAuthComponent";
import {DockerAuthComponent} from "./components/DockerAuthComponent";
import {WizardStepComponent} from "./components/WizardStepComponent";
import {useContext, useEffect, useState} from "react";
import {Wizard} from "react-use-wizard";
import {debugContextDevtool} from "react-context-devtool";
import {
    DockerAuthProvider
} from "./statemanagement/contexts/DockerAuthContext";
import {AuthenticationStep} from "./components/AuthenticationStep";
import {AzureAuthProvider} from "./statemanagement/contexts/AzureAuthContext";
import {ImportRepositoriesStep} from "./components/ImportRepositoriesStep";
import {RepositoriesProvider} from "./statemanagement/contexts/RepositoriesContext";

//TODO maybe use this for config parameters
//TODO first page in the wizard should be the authenticator(generate token + docker logins)
//TODO use this for token
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
        <Page className="flex-grow flex-center">
            <AzureAuthProvider>
                <DockerAuthProvider>
                    <RepositoriesProvider>
                        <div className="container">
                            <div className="col-10 mx-auto">
                                <Wizard>
                                    <AuthenticationStep/>
                                    <WizardStepComponent components={[<ImportRepositoriesStep/>]}
                                                         title="Step 2/3 Import Repositories"
                                                         nextEnabled={true} nextOnClick={() => console.log("next(2)")}/>
                                    <WizardStepComponent components={[<AzureAuthComponent/>]} title="Step 2"
                                                         nextOnClick={() => console.log("step 2")} nextEnabled={false}/>
                                </Wizard>
                            </div>
                        </div>
                    </RepositoriesProvider>
                </DockerAuthProvider>
            </AzureAuthProvider>
        </Page>
    );


}
showRootComponent(<ConfigWizard/>);