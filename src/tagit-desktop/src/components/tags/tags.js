import React from "react";
import './tags.css'
import { X } from "react-bootstrap-icons";

const FileTag = (props) => {
    const handleClickDeleteBtn = (evt) => {
        props.deleteFileTag(props.fileId, props.tag);
    }

    if(props.type === 'modal'){
        return(
            <div className="file-tag-wrapper">
                <span className="file-tag">{props.tag}</span>
            </div>
        )
    }else if(props.type === 'file') {
        return(
            <div className="file-tag-wrapper">
                <span className="file-tag">{props.tag}</span>
                <X className="file-tag-delete-btn" size={16} onClick={handleClickDeleteBtn} />
            </div>
        )
    }else if(props.type === 'side') {
        const className = props.select ? 'file-tag-selected' : 'file-tag';
        
        const onClick = () => {
            props.handleClick(props.tag);
        }

        return(
            <div className="file-tag-wrapper">
                <span className={className} onClick={onClick} >{props.tag}</span>
            </div>
        )
    }
}

export { FileTag }