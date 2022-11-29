import React from "react";
import './file.css';
import { FileTag } from "../tags/tags";

import { FileEarmarkPlay } from "react-bootstrap-icons";
import { FileEarmarkMusic } from "react-bootstrap-icons";
import { FileEarmarkImage } from "react-bootstrap-icons";
import { FileEarmark } from "react-bootstrap-icons";
import { Plus } from "react-bootstrap-icons";

const FileIcon = (props) => {
    const fileExtension = props.ext;
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv'];
    const audioExtensions = ['mp3', 'flac', 'aac', 'alac'];
    const imageExtensions = ['jpeg', 'png', 'jpg'];

    if(videoExtensions.includes(fileExtension)) {
        return(
            <FileEarmarkPlay className="file-info-icon" /> 
        )
    }else if(audioExtensions.includes(fileExtension)) {
        return(
            <FileEarmarkMusic className="file-info-icon" />
        )
    }else if(imageExtensions.includes(fileExtension)) {
        return(
            <FileEarmarkImage className="file-info-icon" />
        )
    }else {
        return(
            <FileEarmark className="file-" />
        )
    }
}

const FileTags = (props) => {
    const listOfFileTags = props.file.fileTags.map((fileTag) =>
        <FileTag key={fileTag} tag={fileTag} type='file' />
    )

    return(
        <div className="file-tags">
            {listOfFileTags}
            <Plus className="open-addFileTagModal-btn" onClick={props.handleShowModal} id={props.file.id} />
        </div>
    )
}

const File = (props) => {
    const file = props.file;
    return(
        <div className="file-card">
            <div className="file-info">
                <FileIcon ext={file.ext} />
                <span className="file-info-name">
                    {file.name}
                </span>
            </div>
            <FileTags handleShowModal={props.handleShowModal} file={file} />
        </div>
    )
}

export default File;