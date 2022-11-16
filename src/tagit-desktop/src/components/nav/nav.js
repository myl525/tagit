import React from 'react';
import './nav.css'
// import bootstrap elements
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import { Search } from 'react-bootstrap-icons';
import { Moon } from 'react-bootstrap-icons';
import { FolderPlus } from 'react-bootstrap-icons';



// functions
const openDir = async () => {
    let data =await window.navAPIs.openDir();
    console.log(data);
}

// components
const SideBar = () => {
    return(
        <Navbar className='sidebar'>
            <FolderPlus size={24} className='select_dir_btn' onClick={openDir} />
            <Moon id='nightMode' size={20} className='night_mode_icon'/>
        </Navbar>
    )
}

const SearchBar = () => {
    return(
        <div className='search_bar'>
            <input type="text" className='search_input' placeholder='Filename' />
            <Search size={18}  className='search_btn' />
        </div>
    )
}

const TopNav = () => {
    return(
        <>
            <Navbar>
                <Container className="container">
                    <button className='home_btn'>tagit</button>
                    <SearchBar />
                </Container>
            </Navbar>
            <hr />
            <SideBar />
        </>
    )
}

export default TopNav;