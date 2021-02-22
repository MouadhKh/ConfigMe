import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./ConfigWizard.css";
import {Page} from "azure-devops-ui/Page";
import * as SDK from "azure-devops-extension-sdk";
import {showRootComponent} from "../../Common";
import {AzureAuthComponent} from "./components/AzureAuthComponent";
import {DockerAuthComponent} from "./components/DockerAuthComponent";
import {WizardStepComponent} from "./components/WizardStepComponent";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {rootReducer} from "./store/reducers/rootReducer";
import {useEffect} from "react";
import store from "./store/store";


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
        SDK.init();
        await SDK.ready();
    }


    return (
        <Provider store={store}>
            <Page className="flex-grow flex-center">
                <div className="container">
                    <div className="col-10 mx-auto">
                        {console.log("store:", store)}
                        <WizardStepComponent components={[<AzureAuthComponent/>, <DockerAuthComponent/>]}
                                             title="Step 1/3: Authentication"
                                             nextOnClick={() => console.log("Auth:Next")}/>
                    </div>
                </div>
            </Page>
        </Provider>
    );


}

showRootComponent(<ConfigWizard/>);