import React, { useEffect, useState } from 'react';
// import bootstrap elements
import 'bootstrap/dist/css/bootstrap.min.css';
// import components
import Sides from './components/sides/sides';
import Main from './components/main/main';

const App = () => {
    const [files, setFiles] = useState({});
    const [tags, setTags] = useState({});
    const [filter, setFilter] = useState({tagFilters:[], keyword: ''});

    const handleTagFilters = (tagFilters) => {
        setFilter({
            ...filter,
            tagFilters: [...tagFilters]
        })
    }

    const handleKeyword = (keyword) => {
        setFilter({
            ...filter,
            keyword: keyword
        })
    }

    // open directory
    const openDir = async () => {
        let data = await window.sidesAPIs.openDir();
        setFiles(data.files);
        setTags(data.tags);
    }
    // reset 
    const resetFilter = () => {
        setFilter({tagFilters:[], keyword: ''});
    }

    // add tags for file
    const addFileTag = async (fileId, newTag) => {
        let data = await window.mainAPIs.addFileTag(Object.keys(files), fileId, newTag);
        setFiles(data.files);
        setTags(data.tags);
    }
    // delete tags of file
    const deleteFileTag = async (fileId, tag) => {
        let data = await window.mainAPIs.deleteFileTag(Object.keys(files), fileId, tag);
        if(!Object.keys(data.tags).includes(tag) && filter.tagFilters.includes(tag)) {
            // if this tag no longer exist and exist in filter, remove it from filter
            const updated = filter.tagFilters.filter(ele => ele !== tag);
            setFilter({
                ...filter,
                tagFilters: [...updated]
            })
        } else {
            searchFile(filter);
        }
        setFiles(data.files);
        setTags(data.tags);
    }
    
    // filter files by tag and filename
    const searchFile = async (filter) => {
        let data = await window.mainAPIs.searchFile(filter);
        setFiles(data);
    }

    useEffect(() => {
        searchFile(filter);
    }, [filter]);


    return(
        <>
            <Sides openDir={() => openDir()} />
            <Main tags={tags} files={files} filter={filter} addFileTag={addFileTag} deleteFileTag={deleteFileTag} handleKeyword={handleKeyword} handleTagFilters={handleTagFilters} resetFilter={resetFilter} />
        </>
    );
}

export default App;