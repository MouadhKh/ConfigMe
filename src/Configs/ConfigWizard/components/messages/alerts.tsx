import * as React from "react";
import {Alert} from "react-bootstrap";

export interface IRepositoryImportFeedBackProps {
    show: boolean
    onClose?: Function
    success: boolean
    repositoryName: string
    link?: string
}

export const RepositoryImportAlert = ({show, success, repositoryName, link}: IRepositoryImportFeedBackProps) => {
    const variant = success ? "success" : "danger";
    const AlertMessage = () => success ? <div>Repository
            <Alert.Link href={link}>{repositoryName}</Alert.Link> Imported successfully</div>
        : <div>An Error occured while importing repository <b>repositoryName </b></div>;

    return (<Alert variant={variant} show={show}>
        <AlertMessage/>
    </Alert>);
}