import React, { useState } from 'react';
import './main.css'
// import components
import File from '../File/file';
import { AddTagModal } from '../Modals/modals';
// import bootstrap elements
import Navbar from 'react-bootstrap/Navbar';
import { Search } from 'react-bootstrap-icons';

// main-top
const SearchBar = () => {
    return(
        <div className='search-bar'>
            <input type="text" className='search-input' placeholder='Filename' />
            <Search size={18}  className='search-btn' />
        </div>
    )
}

const TopNavBar = () => {
    return(
        <Navbar className='top-navbar'>
            <button className='home-btn'>tagit</button>
            <SearchBar />
        </Navbar>
    )
}

// Files
const Files = (props) => {
    const filesObj = props.files;
    const listOfFiles = Object.keys(filesObj).map(
        (fileId) => <File key={fileId} file={filesObj[fileId]} handleShowModal={props.handleShowModal} />
    )
    return(
        <div className='files'>
            {listOfFiles}
        </div>
    )
}

const Main = (props) => {
    const [show, setShow] = useState(false);
    const [currentFile, setCurrentFile] = useState({});
    const handleShowModal = (evt) => {
        setShow(true);
        setCurrentFile({
            ...props.files[evt.target.id]
        });
    }

    const handleCloseModal = () => {
        setShow(false);
    }

    return(
        <div className='main'>
            <AddTagModal show={show} handleShowModal={handleShowModal} handleCloseModal={handleCloseModal} addFileTag={props.addFileTag} currentFile={currentFile} />
            <TopNavBar />
            <Files files = {props.files} handleShowModal={handleShowModal} />
        </div>
    )
}

export default Main;