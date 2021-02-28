import {Alert, Toast} from "react-bootstrap";
import * as React from "react";
import {IRepositoryImportFeedBackProps} from "./alerts";
import {BiImport} from "react-icons/all";

export const RepositoryImportToast = ({show, repositoryName, success}: IRepositoryImportFeedBackProps) => {
    const header = success ? "Import successful" : "Import failed";
    const ToastMessage = () => success ? <div>Repository <b>{repositoryName}</b> Imported successfully</div> :
        <div>An Error occured while importing repository <b>{repositoryName} </b></div>;
    return (
        <Toast style={{
            position: 'fixed',
            bottom: 0,
            left: 0
        }} show={show} autohide delay={3000} >
            <Toast.Header>
                <strong className="mr-auto"><BiImport/>{header}</strong>
                <small>1 sec ago</small>
            </Toast.Header>
            <Toast.Body><ToastMessage/></Toast.Body>
        </Toast>
    );
}