import * as React from "react";
import {SiDocker} from 'react-icons/si';
import {Badge, Button, Form} from "react-bootstrap";
import {DockerAuthContext} from "../statemanagement/contexts/DockerAuthContext";
import {authenticateDocker} from "../statemanagement/actions/authActions";
import {TiTick} from "react-icons/ti";
import {useContext, useEffect, useRef, useState} from "react";
import {createDockerRegistry} from "../../../utils/ServiceEndpointUtils";
import {getOrganizationName} from "../../../utils/OrganizationUtils";
import {getCurrentProjectId, getCurrentProjectName} from "../../../utils/ProjectUtils";

interface IDockerAuthComponent {
    azureToken: string
}

export const DockerAuthComponent = ({azureToken}: IDockerAuthComponent) => {
//TODO : investigate more on finding a way to authenticate in Docker
    const [authorized, setAuthorized] = useState(false)
    //TODO add validation

    const [organizationName, setOrganizationName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [authorizationAttempt, setAuthorizationAttempt] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const {dockerState, dockerDispatch} = useContext(DockerAuthContext);
    const userNameRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const dockerHubRef: any = useRef(null);
    useEffect(() => {
        getOrganizationName().then(org => setOrganizationName(org));
        getCurrentProjectName().then(project => setProjectName(project));
        getCurrentProjectId().then(projectId => setProjectId(projectId));
    }, []);
    const authFeedback = () => {
        if (authorized)
            return (<h5><Badge variant="success">Success</Badge></h5>);
        return (
            <h5><Badge variant="danger">Failure</Badge></h5>);
    }
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
                <Form.Text className="text-muted">
                    Make sure dockerHub doesn't already exist.
                </Form.Text>
            </Form.Group>
            <Button variant="outline-success" onClick={() => {
                setAuthorizationAttempt(true);
                createDockerRegistry(azureToken, dockerHubRef.current.value, userNameRef.current.value, passwordRef.current.value).then(() => {
                    setAuthorized(true)
                    dockerDispatch(authenticateDocker({
                        dockerUsername: userNameRef.current.value,
                        dockerPassword: passwordRef.current.value,
                        dockerHubName: dockerHubRef.current.value
                    }))
                }).catch(() =>
                    setAuthorized(false));
            }
            }>
                <TiTick color="green"/>
            </Button>
            {authorizationAttempt && authFeedback()}
        </Form>
    );
}