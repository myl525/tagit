import React, { useState } from "react";
import './modals.css';
import { FileTag } from "../tags/tags";
import { Modal } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

const AddTagModal = (props) => {
    const [addedTags, setAddedTags] = useState([]);
    const [inputVal, setInputVal] = useState('');

    const currentFile = props.currentFile;
    const onModalShow = () => {
        setInputVal('');
        setAddedTags([]);
    }

    const handleInputChange = (evt) => {
        setInputVal(evt.target.value);
    }

    const handleClickAddBtn = (evt) => {
        if(inputVal) {
            const success = props.addFileTag(currentFile.id, inputVal);
            if(success) {
                setAddedTags((addedTags) => {
                    const copy = addedTags.slice();
                    copy.push(inputVal);
                    return copy;
                });
                setInputVal(''); 
            }
            
        }
    }

    const listOfAddedTags = addedTags.map((addedTag, index) => 
        <FileTag key={index} type='modal' tag={addedTag} />
    )

    return(
        <Modal show={props.show} onShow={onModalShow} onHide={props.handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.currentFile.name}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="add-file-tag-bar">
                    <input value={inputVal} onChange={handleInputChange} className="add-file-tag-input" type='text' />
                    <PlusLg size={18} className="add-file-tag-btn" onClick={handleClickAddBtn} />
                </div>
                <div className="added-file-tags">
                    {listOfAddedTags}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseModal} >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export { AddTagModal };
