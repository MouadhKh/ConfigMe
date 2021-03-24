import * as React from "react";
import {SiDocker} from 'react-icons/si';
import {Badge, Button, Form} from "react-bootstrap";
import {DockerAuthContext} from "../../statemanagement/contexts/DockerAuthContext";
import {authenticateDocker} from "../../statemanagement/actions/authActions";
import {TiTick} from "react-icons/ti";
import {useContext, useRef, useState} from "react";
import ServiceEndpointUtility from "../../../../utils/ServiceEndpointUtility";

import {HelpComponent} from "../utilityComponents/HelpComponent";
import {AiFillEye} from "react-icons/all";
import {authenticate} from "../../../../utils/basicModeUtils/DockerUtils";

const DOCKERHUB_SIGNUP = "https://hub.docker.com/signup";

interface IDockerAuthComponent {
    azureToken: string
    azureAuthorized: boolean
}

export const DockerAuthComponent = ({azureToken, azureAuthorized}: IDockerAuthComponent) => {
//TODO : investigate more on finding a way to authenticate in Docker
    const [authorized, setAuthorized] = useState(false)
    const [form, setForm] = useState({username: "", password: "", dockerhub: ""})
    const [errors, setErrors] = useState({username: "", password: "", dockerhub: ""})
    const [authorizationAttempt, setAuthorizationAttempt] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const {dockerState, dockerDispatch} = useContext(DockerAuthContext);
    const userNameRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const dockerHubRef: any = useRef(null);
    const setField = (field: string, value: string) => {
        setForm({
            ...form,
            [field]: value
        });

        // @ts-ignore
        if (!!errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }
    const findFormErrors = () => {
        const {username, password, dockerhub} = form
        const newErrors = {username: "", password: "", dockerhub: ""};
        if (username.length < 6) newErrors.username = 'Username must be at least 6 character long'
        if (password.length < 8) newErrors.password = 'Given password is too short'!
        if (dockerhub === "") newErrors.dockerhub = "Dockerhub service connection can't be empty"

        return newErrors
    }
    const handleAuthorize = () => {
        const newErrors = findFormErrors()
        const fieldsWithErrors = Object.values(newErrors).filter(value => value !== "");
        if (fieldsWithErrors.length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    }
    const authFeedback = () => {
        if (authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }
    const showPassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
        } else {
            setPasswordType("password");
        }
    }
    return (
        <Form className="m-3">
            <div className="row">
                <label className="mr-2" style={{color: "#0078d4"}}>Docker</label>
                <SiDocker/>
                <HelpComponent className="ml-2" id="dockerInfo" content={
                    <div>
                        DockerHub account can be created <a
                        href={DOCKERHUB_SIGNUP} target="_blank"
                        rel="noopener noreferrer">here</a>
                    </div>
                }/>
            </div>
            <Form.Group controlId="dockerHubUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control ref={userNameRef} type="username" placeholder="Dockerhub Username"
                              onChange={(e => setField("username", e.target.value))}
                              isInvalid={!!errors.username}/>
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="dockerHubPassword">
                <Form.Label>Password</Form.Label>
                <Form.Row>
                    <Form.Control style={{width: '95%'}} ref={passwordRef} type={passwordType} placeholder="Password"
                                  onChange={(e => setField("password", e.target.value))}
                                  isInvalid={!!errors.password}/>
                    <span className="ml-2" onClick={() => showPassword()}><AiFillEye size="24"/></span>
                </Form.Row>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

            </Form.Group>
            <Form.Group controlId="dockerHubName">
                <Form.Label>DockerHub Service Connection <HelpComponent id="dockerHub_serviceConnection"
                                                                        content={<div>No action from your side
                                                                            needed.<br/>
                                                                            Azure service connection will be created for
                                                                            you.</div>}/>
                </Form.Label>
                <Form.Control ref={dockerHubRef} type="text" placeholder="Service Connection"
                              onChange={(e => setField("dockerhub", e.target.value))}
                              isInvalid={!!errors.dockerhub}/>
                <Form.Control.Feedback type="invalid">{errors.dockerhub}</Form.Control.Feedback>
            </Form.Group>
            <Button disabled={!azureAuthorized} variant="outline-success" onClick={async () => {
                setAuthorizationAttempt(true);
                if (handleAuthorize()) {
                    const serviceEndpointUtility: ServiceEndpointUtility = new ServiceEndpointUtility(azureToken);
                    serviceEndpointUtility.createDockerRegistry(dockerHubRef.current.value, userNameRef.current.value, passwordRef.current.value)
                        .then((response) => {
                            if (response == 200) {
                                setAuthorized(true)
                                dockerDispatch(authenticateDocker({
                                    dockerUsername: userNameRef.current.value,
                                    dockerPassword: passwordRef.current.value,
                                    dockerHubName: dockerHubRef.current.value
                                }));
                            } else {
                                setAuthorized(false);
                            }
                        }).catch(() =>
                        setAuthorized(false));
                }
            }
            }>
                <TiTick color="green"/>
            </Button>
            {authorizationAttempt && authFeedback()}
        </Form>
    );
}