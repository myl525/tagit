import React, { useState } from 'react';
import './main.css'
// import components
import File from '../File/file';
import { AddTagModal } from '../Modals/modals';
import FilterBar from '../filterBar/filterBar';
// import bootstrap elements
import Navbar from 'react-bootstrap/Navbar';
import { Search } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

// main-top
const TopNavBar = (props) => {
    const [inputVal, setInputVal] = useState('');
    
    const handleKeyword = props.handleKeyword;

    const onClickHomeBtn = () => {
        props.resetFilter();
        setInputVal('');
    }

    const handleInputChange = (evt) => {
        setInputVal(evt.target.value);
    }

    const handleEnterPress = (e) => {
        if(e.key === 'Enter') {
            if(inputVal) {
                handleKeyword(inputVal);
            }
        }
    }

    const onClickClearBtn = () => {
        setInputVal(''); // clear input
        handleKeyword(''); // clear keyword filter
    }
    
    return(
        <Navbar className='top-navbar'>
            <button className='home-btn' onClick={onClickHomeBtn} >tagit</button>
            <div className='search-bar'>
                <Search size={18}  className='search-btn' />
                <input type="text" className='search-input' placeholder='Filename' value={inputVal} onChange={handleInputChange} onKeyUp={(evt) => handleEnterPress(evt)}/>
                <XCircleFill size={18} className='search-input-clear-btn' onClick={onClickClearBtn} /> 
            </div>
        </Navbar>
    )
}

// Files
const Files = (props) => {
    const filesObj = props.files;
    const listOfFiles = Object.keys(filesObj).map(
        (fileId) => <File key={fileId} file={filesObj[fileId]} handleShowModal={props.handleShowModal} changeCurrentFile={props.changeCurrentFile} deleteFileTag={props.deleteFileTag} />
    )
    return(
        <div className='files'>
            {listOfFiles}
        </div>
    )
}

const Main = (props) => {
    // state of modal
    const [show, setShow] = useState(false); 
    // selected file (add its tag, delete its tag)
    const [currentFile, setCurrentFile] = useState({});
    const changeCurrentFile = (file) => {
        setCurrentFile({
            ...file
        })
    }
    const handleShowModal = () => {
        setShow(true);
    }
    const handleCloseModal = () => {
        setShow(false);
    }
    
    return(
        <div className='main'>
            <FilterBar tags={props.tags} filter={props.filter} handleTagFilters={props.handleTagFilters} />
            <AddTagModal show={show} handleCloseModal={handleCloseModal} addFileTag={props.addFileTag} currentFile={currentFile} />
            <TopNavBar handleKeyword={props.handleKeyword} resetFilter={props.resetFilter} />
            <Files files = {props.files} handleShowModal={handleShowModal} changeCurrentFile={changeCurrentFile} deleteFileTag={props.deleteFileTag} />
        </div>
    )
}

export default Main;