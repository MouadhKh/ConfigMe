import {Badge, Button, FormControl, InputGroup} from "react-bootstrap";
import {TiTick} from "react-icons/ti";
import * as React from "react";
import {isTokenValid} from "../../../../utils/auth";
import {SiAzuredevops} from 'react-icons/si';
import {useContext, useRef, useState} from "react";
import {AzureAuthContext, AzureAuthProvider} from "../../statemanagement/contexts/AzureAuthContext";
import {authenticateAzure} from "../../statemanagement/actions/authActions";
import {BLUE} from "../../styleConstants";
import {HelpComponent} from "../utilityComponents/HelpComponent";
// import {AzureAuthContext} from "../contexts/AzureAuthContext";


const CREATE_PAT_LINK = "https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page";

export const AzureAuthComponent = () => {

    const tokenInput: any = useRef(null);
    const [token, setToken] = useState("");
    const [authorized, setAuthorized] = useState(false);
    const {azureState, azureDispatch} = useContext(AzureAuthContext);
    const isAuthorized = async (token: string) => {
        return isTokenValid(token);
    }

    const showFeedback = () => {
        if (authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }


    return (
        <div className="m-3">
            <div className="row">
                <label className="m-2" style={BLUE}>Azure</label>
                <SiAzuredevops/>
            </div>
            <InputGroup className="mb-3 w-75">
                <InputGroup.Prepend>
                    <InputGroup.Text>Azure Token
                        <HelpComponent id="azToken_tooltip"
                                       content={
                                           <div>
                                               A Tutorial on how to create a personal access token can
                                               be found <a
                                               href={CREATE_PAT_LINK} target="_blank"
                                               rel="noopener noreferrer">here</a>
                                           </div>}/>
                    </InputGroup.Text>

                </InputGroup.Prepend>

                <FormControl
                    disabled={authorized}
                    ref={tokenInput}
                    placeholder="Azure Token"
                    aria-label="Token"
                    aria-describedby="Azure Authentication Token"
                />
                <InputGroup.Append>
                    <Button variant="outline-success" onClick={() => {
                        setToken(tokenInput.current.value);
                        isAuthorized(tokenInput.current.value)
                            .then((result: boolean) => {
                                if (result) {
                                    azureDispatch(authenticateAzure({azureToken: tokenInput.current.value}))
                                    setAuthorized(true);
                                }
                            });
                    }
                    }><TiTick color="green"/>
                    </Button>
                    <div className="ml-2">
                        {token !== "" && showFeedback()}
                    </div>
                </InputGroup.Append>
            </InputGroup>
        </div>
    );
}