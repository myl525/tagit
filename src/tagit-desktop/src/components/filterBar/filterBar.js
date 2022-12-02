import React, { useState } from 'react';
import './filterBar.css'
// import components
import { FilterBarTag } from '../tags/tags';
// import bootstrap elements
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CaretRight } from 'react-bootstrap-icons';
import { PlusLg } from 'react-bootstrap-icons';

const AddFilterBar = (props) => {
    const filterBarTags = props.filterBarTags;
    const [inputVal, setInputVal] = useState('');
    const [error, setError] = useState(false);

    const handleInputChange = (evt) => {
        setInputVal(evt.target.value);
    }
    const handleClickAddBtn = () => {
        if(inputVal && filterBarTags.includes(inputVal)) {
            props.handleClickFilterBarTag(inputVal);
            setError(false);
            setInputVal('');
        }else {
            setError(true);
        }
    }
    const handleInputFocusOut = () => {
        if(error) {
            setError(false);
        }
    }

    const handleEnterPress = (evt) => {
        if(evt.key === 'Enter') {
            handleClickAddBtn();
        }
    }

    return(
        <div className={error?"add-filter-bar-error":"add-filter-bar"}>
            <PlusLg />
            <input value={inputVal} onChange={handleInputChange} className={"add-filter-input"} type='text' onKeyUp={(evt) => handleEnterPress(evt)} onBlur={handleInputFocusOut} />
        </div>
    )
}


const FilterBar = (props) => {
    const [show, setShow] = useState(false);
    const allTags = Object.keys(props.tags);
    const filters = props.filter.tagFilters;
    
    const filterBarTags = allTags.filter(tag => !filters.includes(tag));
    const handleTagFilters = props.handleTagFilters;

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleClickFilter = (tag) => {
        const copy = filters.slice();
        const filtered = copy.filter(ele => ele !== tag);
        handleTagFilters(filtered);
    }

    const handleClickFilterBarTag = (tag) => {
        const copy = filters.slice();
        copy.push(tag);
        handleTagFilters(copy);
        return copy;
    }

    const listOfFilters = filters.map((filter) =>
        <FilterBarTag key={filter} tag={filter} select={true} handleClick={handleClickFilter} />
    )

    const listOfFilterBarTags = filterBarTags.map((sideTag) => 
        <FilterBarTag key={sideTag} tag={sideTag} handleClick={handleClickFilterBarTag} />
    )

    return(
        <>
            <div className='open-filter-bar-btn' onClick={handleShow}>
                <CaretRight size={24}/>
            </div>
            <Offcanvas show={show} onHide={handleClose} className='filter-bar'>
                <Offcanvas.Header>
                    <AddFilterBar filterBarTags={filterBarTags} handleClickFilterBarTag={handleClickFilterBarTag} />
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='filters-selected'>
                        {listOfFilters}
                    </div>
                    {listOfFilterBarTags}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default FilterBar;