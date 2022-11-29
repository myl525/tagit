import React, {useState} from 'react';
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
    // add tags for file
    const addFileTag = (fileId, newTag) => {
        if(files[fileId].fileTags.includes(newTag)) {
            return false;
        }else {
            setFiles({
                ...files,
                [fileId]: {
                    ...files[fileId],
                    fileTags: [...files[fileId].fileTags, newTag]
                }
            });
            if(tags[newTag]) {
                // tag exist
                setTags({
                    ...tags,
                    [newTag]: [...tags[newTag], fileId]
                })
            }else {
                // create new tag entry
                setTags({
                    ...tags,
                    [newTag]: [fileId]
                });
            }

            window.mainAPIs.addFileTag(fileId, newTag);
            return true;
        }
    }

    return(
        <>
            <Sides openDir={() => openDir()} tags={tags} />
            <Main files={files} addFileTag={addFileTag} />
        </>
    );
}

export default App;