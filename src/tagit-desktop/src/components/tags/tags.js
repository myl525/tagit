import React from "react";
import './tags.css'
import { X } from "react-bootstrap-icons";

const FileTag = (props) => {
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
                <X className="file-tag-delete-btn" size={16}/>
            </div>
        )
    }
}

export { FileTag }