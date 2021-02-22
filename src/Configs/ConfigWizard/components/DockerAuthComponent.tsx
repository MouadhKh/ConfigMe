import * as React from "react";
import {SiDocker} from 'react-icons/si';
import {Form} from "react-bootstrap";

export default class DockerAuthComponent extends React.Component<{}, {}> {
    render() {
        return (
            <Form>
                <div className="row">
                    <label className="m-2" style={{color: "#0078d4"}}>DockerHub</label>
                    <SiDocker/>
                </div>
                <Form.Group controlId="dockerHubUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Dockerhub Username"/>
                    <Form.Text className="text-muted">
                        Make sure the logins are correct.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="dockerHubPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"/>
                </Form.Group>
                <Form.Group controlId="dockerHubName">
                    <Form.Label>DockerHub Service Connection</Form.Label>
                    <Form.Control placeholder="Service Connection"/>
                </Form.Group>
            </Form>
        );

    }
}