import * as React from 'react';
import {GrEdit, IoLogoDocker, MdDelete, SiAzurepipelines} from "react-icons/all";
import FilesUtility from "../../../../utils/FilesUtility";
import {Button, ButtonGroup} from "react-bootstrap";
import {EditorComponent} from "../modals/EditorComponent";
import {FileObject} from "../../../../utils/types";
import {ToastContainer, toast} from "react-toastify";
import {useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {toastOptions} from "../messages/toasts";


interface IFileRepresentation {
    fileObj: FileObject
    repositoryName: string,
    withButtons: boolean,
    azureToken: string
    branchName: string
}

interface IFileIconProps {
    type: string
}

const FileIcon = ({type}: IFileIconProps) => {
    if (type === "Pipeline") {
        return (<SiAzurepipelines className="mr-2" color="#0078d4"/>);
    }
    return (<IoLogoDocker className="mr-2" color="#0078d4"/>)
}
const getFileType = (fileObj: FileObject): string => {
    const fileName: string = FilesUtility.extractFileName(fileObj.path);
    const extension: string = fileName.substring(fileName.indexOf(".") + 1);
    if (extension === "yml") return "Pipeline";
    return "DockerFile";
}
const getMode = (fileObj: FileObject) => {
    if (getFileType(fileObj) === "Pipeline") return "yaml";
    return "dockerfile";
}

export const FileRepresentationComponent = ({
                                                fileObj, repositoryName, withButtons,
                                                azureToken,
                                                branchName
                                            }: IFileRepresentation) => {
    const [fileContent, setFileContent] = useState("");
    const [showEditor, setShowEditor] = useState(false)
    const fileUtility: FilesUtility = new FilesUtility(azureToken);
    const onDelete = (fileObj: FileObject, repositoryName: string, branchName: string) => {
        fileUtility.deleteFile(repositoryName, branchName, fileObj)
            .then(response => {
                if (response.status == 201) {
                    toast.success(`File ${FilesUtility.extractFileName(fileObj.path)} deleted successfully`, toastOptions);
                } else {
                    toast.error(`File ${FilesUtility.extractFileName(fileObj.path)} couldn't be deleted`, toastOptions);
                }
            });
    }
    const onEdit = async (repositoryName: string, fileObj: FileObject) => {
        const fileData = await fileUtility.getFileData(repositoryName, fileObj);
        setFileContent(fileData);
    }


    return (<div className="row">
            <FileIcon type={getFileType(fileObj)}/>
            <b className="mr-2"><i>{FilesUtility.extractFileName(fileObj.path)}</i></b>
            {withButtons &&
            <div>
                <ButtonGroup>
                    <Button onClick={async () => {
                        await onEdit(repositoryName, fileObj);
                        setShowEditor(true);
                    }} size="sm" variant="outline-primary"><GrEdit/></Button>
                    <Button onClick={() => onDelete(fileObj, repositoryName, branchName)} size="sm"
                            variant="outline-danger"><MdDelete/></Button>
                </ButtonGroup>
                <EditorComponent show={showEditor} content={fileContent} onHide={() => setShowEditor(false)}
                                 type="EDIT" title={`${getFileType(fileObj)} Editor`} mode={getMode(fileObj)}
                                 repositoryName={repositoryName}
                                 fileObj={fileObj} branchName={branchName} azureToken={azureToken}/>
            </div>}
            <ToastContainer/>
        </div>
    );
}