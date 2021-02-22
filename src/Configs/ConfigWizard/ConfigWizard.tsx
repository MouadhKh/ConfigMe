import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Header, TitleSize} from "azure-devops-ui/Header";
import "./ConfigWizard.css";
import {FcNext} from 'react-icons/fc';
import {GrConfigure} from 'react-icons/gr';
import {AiFillCopyrightCircle} from 'react-icons/ai';
import {Page} from "azure-devops-ui/Page";
import * as SDK from "azure-devops-extension-sdk";
import {Button, Card} from "react-bootstrap";
import {showRootComponent} from "../../Common";
import AzureAuthComponent from "./components/AzureAuthComponent";
import DockerAuthComponent from "./components/DockerAuthComponent";
import WizardStepComponent from "./components/WizardStepComponent";


interface Color {
    color: string;
}

//TODO maybe use this for config parameters
//TODO first page in the wizard should be the authenticator(generate token + docker logins)
//TODO use this for token
class ConfigWizard extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render(): JSX.Element {
        const ColoredLine = (color: Color) => (
            <hr
                style={{
                    color: color.color,
                    backgroundColor: color.color,
                    height: 5
                }}
            />
        );
        return (
            <Page className="flex-grow flex-center">
                <div className="container">
                    <div className="col-10 mx-auto">
                        <WizardStepComponent components={[<AzureAuthComponent/>, <DockerAuthComponent/>]}
                                             title="Step 1/3: Authentication"
                                             nextOnClick={() => console.log("Auth:Next")}/>
                    </div>
                </div>
            </Page>
        )
            ;
    }

    private async initializeState() {
        //TODO more initialization here when we have forms
        await SDK.ready();
    }

    public componentDidMount() {
        SDK.init();
        this.initializeState();
    }
}

showRootComponent(
    <ConfigWizard/>
);