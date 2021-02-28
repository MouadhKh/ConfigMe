import {Badge, Button, FormControl, InputGroup} from "react-bootstrap";
import {TiTick} from "react-icons/ti";
import * as React from "react";
import {isTokenValid} from "../../../auth";
import {SiAzuredevops} from 'react-icons/si';
import {useContext, useRef, useState} from "react";
import {AzureAuthContext, AzureAuthProvider} from "../statemanagement/contexts/AzureAuthContext";
import {authenticateAzure} from "../statemanagement/actions/authActions";
import {BLUE} from "../styleConstants";
// import {AzureAuthContext} from "../contexts/AzureAuthContext";


export const AzureAuthComponent = ({}) => {

    const tokenInput: any = useRef(null);//Todo can be problematic
    const [token, setToken] = useState("");
    const [authorized, setAuthorized] = useState(false);
    const {azureState, azureDispatch} = useContext(AzureAuthContext);
    const isAuthorized = async (token: string) => {
        return isTokenValid(token);
    }

    const tokenFeedback = () => {
        if (authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }


    return (
        // <AzureAuthContext.Provider value={{token: ""}}>
        <div>
            <div className="row">
                <label className="m-2" style={BLUE}>Azure</label>
                <SiAzuredevops/>
            </div>
            <InputGroup size="sm" style={{width: "60%"}} className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Azure Token</InputGroup.Text>
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
                        isAuthorized(tokenInput.current.value)
                            .then((result: boolean) => {
                                setToken(tokenInput.current.value);
                                if (result) {
                                    azureDispatch(authenticateAzure({azureToken: tokenInput.current.value}))
                                    setAuthorized(true);
                                }
                            });
                    }
                    }><TiTick color="green"/>
                    </Button>
                    <div className="ml-2">
                        {token != "" && tokenFeedback()}
                    </div>
                </InputGroup.Append>
            </InputGroup>
        </div>
        // </AzureAuthContext.Provider>
    );
}