import React from "react";
import './file.css';
import { FileEarmarkPlay } from "react-bootstrap-icons";
import { FileEarmarkMusic } from "react-bootstrap-icons";
import { FileEarmarkImage } from "react-bootstrap-icons";
import { FileEarmark } from "react-bootstrap-icons";

const FileCover = (props) => {
    const fileExtension = props.ext;
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv'];
    const audioExtensions = ['mp3', 'flac', 'aac', 'alac'];
    const imageExtensions = ['jpeg', 'png', 'jpg'];

    if(videoExtensions.includes(fileExtension)) {
        return(
            <div className="file-cover">
                <FileEarmarkPlay size={24}/>
            </div> 
        )
    }else if(audioExtensions.includes(fileExtension)) {
        return(
            <div className="file-cover">
                <FileEarmarkMusic />
            </div> 
        )
    }else if(imageExtensions.includes(fileExtension)) {
        return(
            <div className="file-cover">
                <FileEarmarkImage />
            </div> 
        )
    }else {
        return(
            <div className="file-cover">
                <FileEarmark size={24} />
            </div> 
        )
    }
}

const File = (props) => {
    return(
        <div className="file-card">
            <FileCover ext={props.file.ext} />
            <div className="file-info">
                <div className="file-info-tags">
                    <span className="file-info-tag">tag1</span>
                    <span className="file-info-tag">tag2</span>
                    <span className="file-info-tag">tag3</span>
                </div>
                <div className="file-info-name">
                    <span>{props.file.name}</span>
                </div>
            </div>
        </div>
    )
}

export default File;