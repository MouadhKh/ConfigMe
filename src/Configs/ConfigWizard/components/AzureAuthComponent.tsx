import {Badge, Button, FormControl, InputGroup} from "react-bootstrap";
import {TiTick} from "react-icons/ti";
import * as React from "react";
import {isTokenValid} from "../../../auth";
import {SiAzuredevops} from 'react-icons/si';

interface IAzureAuthState {
    token: string;
    authorized: boolean;
}

export default class AzureAuthComponent extends React.Component<{}, IAzureAuthState> {
    private tokenInput: any = React.createRef();//Todo can be problematic

    constructor(props: {}) {
        super(props);
        this.state = {token: "", authorized: false};
    }

    async isAuthorized(token: string) {
        return isTokenValid(token);
    }

    tokenFeedback() {
        if (this.state.authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }

    render() {

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
                    disabled={this.state.authorized}
                    ref={this.tokenInput}
                    placeholder="Azure Token"
                    aria-label="Token"
                    aria-describedby="Azure Authentication Token"
                />
                <InputGroup.Append>
                    <Button variant="outline-success" onClick={() => {
                        this.isAuthorized(this.tokenInput.current.value)
                            .then((result: boolean) => this.setState(
                                {
                                    token: this.tokenInput.current.value,
                                    authorized: result
                                }
                            ))
                        console.log("state", this.state);
                    }}><TiTick color="green"/></Button>
                    <div className="ml-2">
                        {this.state.token != "" && this.tokenFeedback()}
                    </div>
                </InputGroup.Append>
            </InputGroup>
        </div>);
    }
}