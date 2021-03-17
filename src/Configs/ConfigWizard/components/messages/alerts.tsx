import * as React from "react";
import {Alert} from "react-bootstrap";
import {IToastFeedBackProps} from "./toasts";


export const RepositoryImportAlert = ({show, success, repositoryName, link}: IToastFeedBackProps) => {
    const variant = success ? "success" : "danger";
    const AlertMessage = () => success ? <div>Repository
            <Alert.Link href={link}>{repositoryName}</Alert.Link> Imported successfully</div>
        : <div>An Error occured while importing repository <b>repositoryName </b></div>;

    return (<Alert variant={variant} show={show}>
        <AlertMessage/>
    </Alert>);
}