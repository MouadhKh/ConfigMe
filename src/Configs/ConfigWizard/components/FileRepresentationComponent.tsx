import {ReactPropTypes, useEffect, useState} from "react";
import * as React from 'react';
import {GrEdit, IoLogoDocker, MdDelete, SiAzurepipelines} from "react-icons/all";
import {deleteFile, extractFileName, FileObject, getFileData, pushFile, updateFile} from "../../../utils/ContentUtils";
import {Button, ButtonGroup} from "react-bootstrap";
import {EditorComponent} from "./modals/EditorComponent";

// import dockerIcon from '../../../../../static/dockerIcon.png';

interface IFileRepresentation {
    fileObj: FileObject
    repositoryName: string,
    azureToken: string
    branchName: string
}

//https://react-bootstrap.github.io/components/list-group/
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
    const fileName: string = extractFileName(fileObj.path);
    const extension: string = fileName.substring(fileName.indexOf(".") + 1);
    if (extension === "yml") return "Pipeline";
    return "DockerFile";
}
const getMode = (fileObj: FileObject) => {
    if (getFileType(fileObj) === "Pipeline") return "yaml";
    return "dockerfile";
}

export const FileRepresentationComponent = ({
                                                fileObj, repositoryName,
                                                azureToken,
                                                branchName
                                            }: IFileRepresentation) => {
    const [fileContent, setFileContent] = useState("");
    const [showEditor, setShowEditor] = useState(false)

    const onDelete = (fileObj: FileObject, repositoryName: string, branchName: string, azureToken: string) => {
        deleteFile(repositoryName, branchName, fileObj, azureToken
        ).then(response => console.log("del_resp:", response));
    }
    const onEdit = async (repositoryName: string, fileObj: FileObject, azureToken: string) => {
        const fileData = await getFileData(repositoryName, fileObj, azureToken);
        setFileContent(fileData);
        console.log("fileData", fileData)
    }


    return (<div className="row">
        <div className="mr-2 col-2">
            <FileIcon type={getFileType(fileObj)}/>
        </div>
        <b className="mr-2"><i>{extractFileName(fileObj.path)}</i></b>
        <ButtonGroup>
            <Button onClick={() => {
                onEdit(repositoryName, fileObj, azureToken);
                setShowEditor(true);
            }} size="sm" variant="outline-primary"><GrEdit/></Button>
            <Button onClick={() => onDelete(fileObj, repositoryName, branchName, azureToken)} size="sm"
                    variant="outline-danger"><MdDelete/></Button>
        </ButtonGroup>
        <EditorComponent show={showEditor} content={fileContent} onHide={() => setShowEditor(false)}
                         type="EDIT" title={`${getFileType(fileObj)} Editor`} mode={getMode(fileObj)}
                         repositoryName={repositoryName}
                         fileObj={fileObj} branchName={branchName} azureToken={azureToken}/>
    </div>);
}