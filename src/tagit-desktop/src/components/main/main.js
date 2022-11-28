import React from 'react';
import './main.css'
// import components
import File from '../File/file';
// import bootstrap elements
import Container from 'react-bootstrap/Container'
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
        <Navbar>
            <Container className="container">
                <button className='home-btn'>tagit</button>
                <SearchBar />
            </Container>
        </Navbar>
    )
}

// Files
const Files = (props) => {
    const files = props.files.map((file) => <File key={file.name} file={file} />)

    return(
        <div className='files'>
            {files}
        </div>
    )
}

const Main = (props) => {
    return(
        <div className='main'>
            <TopNavBar />
            <Files files = {props.files}/>
        </div>
    )
}

export default Main;