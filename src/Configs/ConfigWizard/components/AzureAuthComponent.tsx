import {Badge, Button, FormControl, InputGroup} from "react-bootstrap";
import {TiTick} from "react-icons/ti";
import * as React from "react";
import {isTokenValid} from "../../../auth";
import {SiAzuredevops} from 'react-icons/si';
import {authenticateAzure} from "../store/actionCreators";
import {useRef, useState} from "react";
import {useDispatch} from "react-redux";


export const AzureAuthComponent = ({}) => {

    const tokenInput: any = useRef();//Todo can be problematic
    const [token, setToken] = useState("");
    const [authorized, setAuthorized] = useState(false);

    const dispatch = useDispatch();
    const isAuthorized = async (token: string) => {
        return isTokenValid(token);
    }

    const tokenFeedback = () => {
        if (authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }


    return (<div>
        <div className="row">
            <label className="m-2" style={{color: "#0078d4"}}>Azure</label>
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
                                setAuthorized(true);
                                dispatch(authenticateAzure(tokenInput.current.value));
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
    </div>);
}