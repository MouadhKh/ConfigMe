import {Alert, Toast} from "react-bootstrap";
import * as React from "react";
import {BiImport} from "react-icons/all";

export interface IToastFeedBackProps {
    show: boolean
    onClose?: Function
    success: boolean
    entityName: string
    link?: string
}

const toastStyle: any = {
    position: 'fixed',
    bottom: 0,
    left: 0
};

export const RepositoryImportToast = ({show, entityName, success}: IToastFeedBackProps) => {
    const header = success ? "Import successful" : "Import failed";
    const ToastMessage = () => success ? <div>Repository <b>{entityName}</b> Imported successfully</div> :
        <div>An Error occured while importing repository <b>{entityName} </b></div>;
    return (
        <Toast style={{
            position: 'fixed',
            bottom: 0,
            left: 0
        }} show={show} autohide delay={3000}>
            <Toast.Header>
                <strong className="mr-auto"><BiImport/>{header}</strong>
                <small>1 sec ago</small>
            </Toast.Header>
            <Toast.Body><ToastMessage/></Toast.Body>
        </Toast>
    );
}

export const FilePushToast = ({show, onClose, success, entityName}: IToastFeedBackProps) => {
    const header = success ? "Push Successful" : "Push Failed";
    const ToastMessage = () => success ? <div>pushed <b>{entityName}</b> successfully</div> :
        <div>An Error occured while pushing <b>{entityName} </b></div>;

    return (<Toast style={toastStyle} show={show} autohide delay={3000}>
        <Toast.Header>
            <strong className="mr-auto"><BiImport/>{header}</strong>
            <small>1 sec ago</small>
        </Toast.Header>
        <Toast.Body><ToastMessage/></Toast.Body>
    </Toast>);
}