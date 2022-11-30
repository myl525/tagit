import React, { useState } from 'react';
import './sides.css'
// import components
import { FileTag } from '../tags/tags';
// import bootstrap elements
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Moon } from 'react-bootstrap-icons';
import { FolderPlus } from 'react-bootstrap-icons';
import { CaretRight } from 'react-bootstrap-icons';

// components
const SideMenu = (props) => {
    return(
        <Navbar className='side-menu'>
            <FolderPlus size={24} className='select-dir-btn' onClick={props.openDir} />
            <Moon id='nightMode' size={20} className='night-mode-icon'/>
        </Navbar>
    )
}

const SideTagsArea = (props) => {
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState([]);

    const sideTags = Object.keys(props.tags).filter(tag => !filters.includes(tag));

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleClickFilter = (tag) => {
        setFilters((filters) => {
            const copy = filters.slice();
            const filtered = copy.filter(ele => ele !== tag);
            props.filterByTag(filtered);
            return filtered;
        });
    }

    const handleClickSideTag = (tag) => {
        setFilters((filters) => {
            const copy = filters.slice();
            copy.push(tag);
            props.filterByTag(copy);
            return copy;
        })
    }

    const listOfFilters = filters.map((filter) =>
        <FileTag key={filter} tag={filter} select={true} type='side' handleClick={handleClickFilter} />
    )

    const listOfSideTags = sideTags.map((sideTag) => 
        <FileTag key={sideTag} tag={sideTag} type='side' handleClick={handleClickSideTag} />
    )

    return(
        <>
            <div className='open-side-tags-area-btn' onClick={handleShow}>
                <CaretRight size={24}/>
            </div>
            <Offcanvas show={show} onHide={handleClose} className='side-tags-area'>
                <Offcanvas.Body>
                    <div className='side-tags-selected'>
                        {listOfFilters}
                    </div>
                    {listOfSideTags}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

const Sides = (props) => {
    return(
        <div className='sides'>
            <SideMenu openDir={props.openDir} />
            <SideTagsArea tags={props.tags} filterByTag={props.filterByTag} />
        </div>
    )
}

export default Sides;