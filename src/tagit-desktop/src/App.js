import React, { useState } from 'react';
// import bootstrap elements
import 'bootstrap/dist/css/bootstrap.min.css';
// import components
import Sides from './components/sides/sides';
import Main from './components/main/main';

const App = () => {
    const [files, setFiles] = useState({});
    const [tags, setTags] = useState({});
    // open directory
    const openDir = async () => {
        let data = await window.sidesAPIs.openDir();
        setFiles(data.files);
        setTags(data.tags);
    }
    // reset 
    const reset = async () => {
        let data = await window.mainAPIs.reset();
        setFiles(data.files);
        setTags(data.tags);
    }

    // add tags for file
    const addFileTag = async (fileId, newTag) => {
        if(files[fileId].fileTags.includes(newTag)) {
            return false;
        }else {
            let data = await window.mainAPIs.addFileTag(Object.keys(files), fileId, newTag);
            setFiles(data.files);
            setTags(data.tags);
            return true;
        }
    }
    // delete tags of file
    const deleteFileTag = async (fileId, tag) => {
        let data = await window.mainAPIs.deleteFileTag(Object.keys(files), fileId, tag);
        setFiles(data.files);
        setTags(data.tags);
    }
    // search by file name
    const searchByFileName = async (fileName) => {
        let data = await window.mainAPIs.searchByFileName(fileName);
        setFiles(data);
    }
    // filter by tag
    const filterByTag = async (filters) => {
        let data = await window.sidesAPIs.filterByTag(filters);
        setFiles(data);
    };
    
    return(
        <>
            <Sides openDir={() => openDir()} tags={tags} filterByTag={filterByTag} />
            <Main files={files} addFileTag={addFileTag} reset={reset} deleteFileTag={deleteFileTag} searchByFileName={searchByFileName} />
        </>
    );
}

export default App;