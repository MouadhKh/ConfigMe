import {useState} from "react";
import * as React from 'react';
import {GrEdit, IoLogoDocker, MdDelete, SiAzurepipelines} from "react-icons/all";
import FileUtility from "../../../../utils/FileUtility";
import {Button, ButtonGroup} from "react-bootstrap";
import {EditorComponent} from "../modals/EditorComponent";
import {FileObject} from "../../../../utils/types";

// import dockerIcon from '../../../../../static/dockerIcon.png';

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
// const isFileUpdatable = (fileObj: FileObject): boolean => {
//TODO implement if you want to fully automatize updates
// }
const getFileType = (fileObj: FileObject): string => {
    const fileName: string = FileUtility.extractFileName(fileObj.path);
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
    const fileUtility: FileUtility = new FileUtility(azureToken);
    const onDelete = (fileObj: FileObject, repositoryName: string, branchName: string) => {
        fileUtility.deleteFile(repositoryName, branchName, fileObj)
            .then(response => console.log("delete_single_file_response:", response));
    }
    const onEdit = async (repositoryName: string, fileObj: FileObject) => {
        const fileData = await fileUtility.getFileData(repositoryName, fileObj);
        setFileContent(fileData);
    }


    return (<div className="row">
            <FileIcon type={getFileType(fileObj)}/>
            <b className="mr-2"><i>{FileUtility.extractFileName(fileObj.path)}</i></b>
            {withButtons &&
            <div>
                <ButtonGroup>
                    <Button onClick={() => {
                        onEdit(repositoryName, fileObj);
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
        </div>
    );
}