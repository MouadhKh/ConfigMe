import {Toast} from "react-bootstrap";
import * as React from "react";
import {BiImport} from "react-icons/all";
import {toast, ToastOptions} from "react-toastify";


export interface IToastFeedBackProps {
    show: boolean
    onClose?: Function
    success: boolean
    repositoryName: string
    link?: string
}

const toastStyle: any = {
    position: 'fixed',
    bottom: 0,
    left: 0
};

export const RepositoryImportToast = ({show, repositoryName, success}: IToastFeedBackProps) => {
    const header = success ? "Import successful" : "Import failed";
    const ToastMessage = () => success ? <div>Repository <b>{repositoryName}</b> Imported successfully</div> :
        <div>An Error occured while importing repository <b>{repositoryName} </b></div>;
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

export const toastOptions: ToastOptions = {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
};
export const FilePushToast = ({show, onClose, success, repositoryName}: IToastFeedBackProps) => {

    const header = success ? "Push Successful" : "Push Failed";
    const ToastMessage = () => success ? <div>pushed <b>{repositoryName}</b> successfully</div> :
        <div>An Error occured while pushing <b>{repositoryName} </b></div>;

    return (
        <Toast style={toastStyle} show={show} autohide delay={1000}>
            <Toast.Header>
                <strong className="mr-auto"><BiImport/>{header}</strong>
                <small>1 sec ago</small>
            </Toast.Header>
            <Toast.Body><ToastMessage/></Toast.Body>
        </Toast>
    );
}