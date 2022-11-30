import React, { useState } from 'react';
import './main.css'
// import components
import File from '../File/file';
import { AddTagModal } from '../Modals/modals';
// import bootstrap elements
import Navbar from 'react-bootstrap/Navbar';
import { Search } from 'react-bootstrap-icons';

// main-top
const SearchBar = (props) => {
    const [inputVal, setInputVal] = useState('');
    const handleInputChange = (evt) => {
        setInputVal(evt.target.value);
    }
    const handleClickSearchBtn = (evt) => {
        if(inputVal) {
            props.searchByFileName(inputVal);
        }
    }

    return(
        <div className='search-bar'>
            <input type="text" className='search-input' placeholder='Filename' value={inputVal} onChange={handleInputChange} />
            <Search size={18}  className='search-btn' onClick={handleClickSearchBtn} />
        </div>
    )
}

const TopNavBar = (props) => {
    return(
        <Navbar className='top-navbar'>
            <button className='home-btn' onClick={props.reset} >tagit</button>
            <SearchBar searchByFileName={props.searchByFileName} />
        </Navbar>
    )
}

// Files
const Files = (props) => {
    const filesObj = props.files;
    const listOfFiles = Object.keys(filesObj).map(
        (fileId) => <File key={fileId} file={filesObj[fileId]} handleShowModal={props.handleShowModal} deleteFileTag={props.deleteFileTag} />
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
    const handleShowModal = (evt) => {
        setShow(true);
        setCurrentFile({
            ...props.files[evt.target.id]
        });
    }

    const handleCloseModal = () => {
        setShow(false);
        setCurrentFile({});
    }

    return(
        <div className='main'>
            <AddTagModal show={show} handleCloseModal={handleCloseModal} addFileTag={props.addFileTag} currentFile={currentFile} />
            <TopNavBar searchByFileName={props.searchByFileName} reset={props.reset} />
            <Files files = {props.files} handleShowModal={handleShowModal} deleteFileTag={props.deleteFileTag} />
        </div>
    )
}

export default Main;