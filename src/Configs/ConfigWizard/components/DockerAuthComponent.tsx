import * as React from "react";
import {SiDocker} from 'react-icons/si';
import {Button, Form} from "react-bootstrap";
import {DockerAuthContext} from "../statemanagement/contexts/DockerAuthContext";
import {authenticateDocker} from "../statemanagement/actions/authActions";
import {TiTick} from "react-icons/ti";
import {useContext, useRef, useState} from "react";

export const DockerAuthComponent = () => {
//TODO : investigate more on finding a way to authenticate in Docker
//     const [authorized, setAuthorized] = useState(false)
    //TODO add validation
    const [errors, setErrors] = useState<string[]>([]);
    const {dockerState, dockerDispatch} = useContext(DockerAuthContext);
    const userNameRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const dockerHubRef: any = useRef(null);
    return (
        <Form>
            <div className="row">
                <label className="m-2" style={{color: "#0078d4"}}>DockerHub</label>
                <SiDocker/>
            </div>
            <Form.Group controlId="dockerHubUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control ref={userNameRef} type="username" placeholder="Dockerhub Username"/>
                <Form.Text className="text-muted">
                    Make sure the logins are correct.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="dockerHubPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control ref={passwordRef} type="password" placeholder="Password"/>
            </Form.Group>
            <Form.Group controlId="dockerHubName">
                <Form.Label>DockerHub Service Connection</Form.Label>
                <Form.Control ref={dockerHubRef} placeholder="Service Connection"/>
            </Form.Group>
            <Button variant="outline-success" onClick={() => {
                dockerDispatch(authenticateDocker({
                    dockerUsername: userNameRef.current.value,
                    dockerPassword: passwordRef.current.value,
                    dockerHubName: dockerHubRef.current.value
                }))

            }
            }>
                <TiTick color="green"/>
            </Button>
        </Form>
    );
}