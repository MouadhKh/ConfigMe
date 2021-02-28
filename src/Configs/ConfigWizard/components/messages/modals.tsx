import {Button, Modal} from "react-bootstrap";
import * as React from "react";

interface IDeleteConfirmation {
    show: boolean
    onHide: Function
    //Investigate
    onConfirm: any
}

export const DeleteConfirmationModal = ({show, onHide, onConfirm}: IDeleteConfirmation) => {
    return (<Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Repository Deletion</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <p>Target Repository already exists and is not empty</p>
            <p><b>Please confirm repository deletion</b></p>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </Modal.Footer>
    </Modal>);
}