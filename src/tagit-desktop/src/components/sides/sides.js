import React from 'react';
import './sides.css'
// import bootstrap elements
import Navbar from 'react-bootstrap/Navbar';
import { Moon } from 'react-bootstrap-icons';
import { FolderPlus } from 'react-bootstrap-icons';

// components
const SideMenu = (props) => {
    return(
        <Navbar className='side-menu'>
            <FolderPlus size={24} className='select-dir-btn' onClick={props.openDir} />
            <Moon id='nightMode' size={20} className='night-mode-icon'/>
        </Navbar>
    )
}

const Sides = (props) => {
    return(
        <div className='sides'>
            <SideMenu openDir={props.openDir} />
        </div>
    )
}

export default Sides;