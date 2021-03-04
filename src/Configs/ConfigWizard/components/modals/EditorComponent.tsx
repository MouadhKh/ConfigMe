import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import * as React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-dockerfile";
// import "react-ace-builds/webpack-resolver-min";
import {useEffect, useRef, useState} from "react";
import {extractFileName, FileObject, pushFile, updateFile} from "../../../../utils/ContentUtils";
import {edit} from "ace-builds";
import {FaRegSave} from "react-icons/all";
import {FilePushToast, RepositoryImportToast} from "../messages/toasts";

interface IPipelineEditor {
    show: boolean,
    title: string,
    mode: string
    content: string,
    onHide: any,
    type: string,
    fileObj: FileObject,
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
        return <InputGroup>
            <InputGroup.Prepend>
                <InputGroup.Text>PPath</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                ref={refObject}
                placeholder="Path"
                aria-label="Path"
                aria-describedby="Path"
            />
        </InputGroup>
    }
    return <></>;

}
//TODO solve problem with onSave when creating
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
                                }: IPipelineEditor) => {


    const pathRef: any = useRef(null);
    const editorRef: any = useRef(null);
    const editorValue = useState("");
    const [operationSuccess, setOperationSuccess] = useState(false);
    const [showOperationToast, setShowOperationToast] = useState(false);
    //TODO feedback missing
    const saveFile = () => {
        if (type === "EDIT") {
            updateFile(fileObj, repositoryName, branchName, editorValue[0], azureToken).then((response: any) => {
                if (response.status == 200)
                    setOperationSuccess(true);
            });
        } else if (type === "ADD") {
            pushFile(repositoryName, branchName, pathRef.current.value, editorValue[0], azureToken).then((response: any) => {
                if (response.status == 200)
                    setOperationSuccess(true);
            });
        }
    }
    return (<Modal size="lg" centered show={show} onHide={onHide}>
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
            <PathComponent type={type} refObject={pathRef}/>
            <Button variant="outline-primary" onClick={() => {
                saveFile()
                setShowOperationToast(true);
                onHide;

            }}><FaRegSave/> Save</Button>
        </Modal.Footer>

        <FilePushToast show={showOperationToast}
                       onClose={() => setShowOperationToast(false)}
                       success={operationSuccess}
                       entityName={extractFileName(fileObj.path)}/>
    </Modal>);
}