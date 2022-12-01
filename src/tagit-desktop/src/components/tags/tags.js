import React from "react";
import './tags.css'
import { X } from "react-bootstrap-icons";

const FileTag = (props) => {
    const handleClickDeleteBtn = (evt) => {
        props.deleteFileTag(props.fileId, props.tag);
    }
    return(
        <div className="tag-wrapper">
            <span className="tag">{props.tag}</span>
            <X className="tag-delete-btn" size={16} onClick={handleClickDeleteBtn} />
        </div>
    )
}

const ModalTag = (props) => {
    return(
        <div className="tag-wrapper">
            <span className="tag">{props.tag}</span>
        </div>
    )
}

const FilterBarTag = (props) => {
    const className = props.select ? 'tag-selected' : 'tag';
        
    const onClick = () => {
        props.handleClick(props.tag);
    }

    return(
        <div className="tag-wrapper">
            <span className={className} onClick={onClick} >{props.tag}</span>
        </div>
    )
}

export { FileTag, ModalTag, FilterBarTag }