import {Button, Form, FormControl, InputGroup, Modal} from "react-bootstrap";
import * as React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-dockerfile";
import {useEffect, useRef, useState} from "react";
import {FaRegSave} from "react-icons/all";
import "react-toastify/dist/ReactToastify.css";
import {toastOptions} from "../messages/toasts";
import {toast, ToastContainer} from "react-toastify";
import {BLUE} from "../../styleConstants";
import {FileObject} from "../../../../utils/types";
import FilesUtility from "../../../../utils/FilesUtility";


interface IFileEditor {
    show: boolean,
    title: string,
    mode: string
    content: string,
    onHide: any,
    type: string,
    fileObj?: FileObject,
    repositoryName: string,
    branchName: string,
    azureToken: string
}

interface IRenderPath {
    type: string
    refObject: any
}

const PathComponent = ({type, refObject}: IRenderPath) => {
    if (type === "CREATE") {
        return (
            <div>
                <InputGroup hasValidation>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Path </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" required
                                  ref={refObject}
                                  placeholder="Path"
                                  aria-label="Path"
                                  aria-describedby="Path"
                    />
                    <Form.Text className="ml-2 text-muted"><i style={BLUE}> Make
                        sure the given path exists.</i></Form.Text>
                </InputGroup>
            </div>);
    }
    return <></>;
}
export const EditorComponent = ({
                                    content,
                                    title,
                                    mode,
                                    show,
                                    onHide,
                                    type,
                                    fileObj,
                                    repositoryName,
                                    branchName,
                                    azureToken
                                }: IFileEditor) => {
    const pathRef: any = useRef(null);
    const editorRef: any = useRef(null);
    const editorValue = useState("");
    const showFeedBack = (saveFileResult: boolean, path: string) => {
        if (saveFileResult) {
            const Message = () => (<div>pushed <b>{FilesUtility.extractFileName(path)}</b> successfully</div>);
            toast.success(
                <Message/>, {...toastOptions, toastId: '201'});
        } else {
            const Message = () => (
                <div>An Error occured while pushing <b>{FilesUtility.extractFileName(path)} </b></div>);
            toast.error(<Message/>, ({...toastOptions, toastId: '409'}))
        }
    }
    const saveFile = async () => {
        const fileUtility: FilesUtility = await new FilesUtility(azureToken);
        if (type === "EDIT") {
            const status = await fileUtility.updateFile(fileObj!, repositoryName, branchName, editorValue[0])
            return status == 201
        } else if (type === "CREATE") {

            const status = await fileUtility.pushFile(repositoryName, branchName, pathRef.current.value, editorValue[0]);
            return status == 201;
        }
        return false;
    }

    function getPath() {
        return fileObj === undefined ? pathRef.current.value : fileObj!.path;
    }

    return (
        <div>
            <Modal size="lg" centered show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="offset-3">
                        <AceEditor
                            ref={editorRef}
                            width="80%"
                            mode={mode}
                            theme="github"
                            name="Editor"
                            fontSize={14}
                            onChange={(value) => editorValue[0] = value}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={content}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }}/>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <div className="row">
                        <PathComponent type={type} refObject={pathRef}/>
                        <Button variant="outline-primary" onClick={async () => {
                            const save = await saveFile()
                            showFeedBack(save, getPath());
                            onHide();
                        }}><FaRegSave/> Save</Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </div>
    );
}