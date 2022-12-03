const { shell, dialog } = require('electron')
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const data = new Store();

/** help functions */
// browse directory
function readFilesSync(dir) {
    const files = [];
  
    fs.readdirSync(dir).forEach(filename => {
        const name = filename;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();
        const id = path.basename(dir) + '/' + name;

        if(ext){ //file
            files.push({ id, filepath, name, ext });
        }else if(!isFile){ //directory
            let tempFiles = [];
            tempFiles = readFilesSync(filepath);
            files.push(...tempFiles);
        }
    });
  
    return files;
}

/** event handlers */
// open directory
async function handleDirOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog(
        {properties: ['openDirectory']}
    )
    if(canceled) {
        return;
    }else {
        // update currentDir
        const currentDir = path.basename(filePaths[0]);
        data.set('currentDir', currentDir);
        const files = readFilesSync(filePaths[0]);

        const currentDirData = data.get(currentDir);
        if(currentDirData) {
            // check whether there is new file
            const dirFiles = currentDirData.files;
            files.forEach((file) => {
                if(!dirFiles[file.id]) {
                    // create new file entry
                    dirFiles[file.id] = {
                        id: file.id,
                        filepath: file.filepath,
                        name: file.name,
                        ext: file.ext,
                        fileTags: []
                    }
                }
            })
            // fs.writeFileSync(dataFilePath, JSON.stringify(dirsData));
            data.set(currentDir, currentDirData);
            return currentDirData;
        }else {
            const obj = {
                files: {},
                tags: {}
            };
            files.forEach((file) => {
                obj.files[file.id] = {
                    id: file.id,
                    filepath: file.filepath,
                    name: file.name,
                    ext: file.ext,
                    fileTags: []
                };
            });
            data.set(currentDir, obj)
            // fs.writeFileSync(dataFilePath, JSON.stringify(dirsData));
            return obj;
        }
    }
}

// add file tag
const handleAddFileTag = (event, obj) => {
    const files = obj.files;
    const fileId = obj.fileId;
    const newTag = obj.newTag;
    const currentDir = data.get('currentDir');
    const currentDirData = data.get(currentDir);
    const dirFiles = currentDirData.files;
    const dirTags = currentDirData.tags;

    dirFiles[fileId].fileTags.push(newTag);
    if(dirTags[newTag]) {
        dirTags[newTag].push(fileId);
    }else {
        dirTags[newTag] = [fileId];
    }

    // fs.writeFileSync(dataFilePath, JSON.stringify(dirsData));
    data.set(currentDir, currentDirData);
    let retFiles = {};
    files.forEach((file) => {
        retFiles[file] = {
            ...dirFiles[file]
        };
    })

    return {files: retFiles, tags: dirTags};
}

// delete file tag
const handleDeleteFileTag = (event, obj) => {
    const files = obj.files;
    const fileId = obj.fileId;
    const tagName = obj.tag;
    const currentDir = data.get('currentDir');
    const currentDirData = data.get(currentDir);
    const dirFiles = currentDirData.files;
    const dirTags = currentDirData.tags;

    // remove this tag from selected file
    let file = dirFiles[fileId];
    const indexOfTag = file.fileTags.indexOf(tagName);
    file.fileTags.splice(indexOfTag, 1);
    // remove this file from deleted tag
    let tag = dirTags[tagName];
    const indexOfFile = tag.indexOf(fileId);
    tag.splice(indexOfFile, 1);
    // if there are no other files that have this tag, remove it from directory
    if(tag.length === 0) {
        delete dirTags[tagName];
    }

    // fs.writeFileSync(dataFilePath, JSON.stringify(dirsData));
    data.set(currentDir, currentDirData);
    let retFiles = {};
    files.forEach((file) => {
        retFiles[file] = {
            ...dirFiles[file]
        };
    })

    return {files: retFiles, tags: dirTags};
}

// search file
const handleSearchFile = (event, filter) => {
    const currentDir = data.get('currentDir');
    const currentDirData = data.get(currentDir);
    if(currentDir) {
        const dirFiles = currentDirData.files;
        const tagFilters = filter.tagFilters;
        const keyword = filter.keyword;

        //first search by file name
        if(keyword && tagFilters.length > 0) {
            let filteredByKeyword = handleSearchByFileName(dirFiles, keyword);
            let filteredByTags = handleFilterByTag(filteredByKeyword, tagFilters);

            return filteredByTags;
        }else if(keyword) {

            return handleSearchByFileName(dirFiles, keyword);
        }else if(tagFilters.length > 0) {

            return handleFilterByTag(dirFiles, tagFilters);
        }else {
            return dirFiles;
        }
    }
}

// search by file name
const handleSearchByFileName = (dirFiles, fileName) => {
    let filtered = {};

    for(key in dirFiles) {
        if(dirFiles[key].name.includes(fileName)) {
            filtered[key] = {
                ...dirFiles[key]
            };
        }
    }

    return filtered;
}

// filter by tag
const handleFilterByTag = (dirFiles, filters) => {
    const currentDir = data.get('currentDir');
    const currentDirData = data.get(currentDir);
    const dirTags = currentDirData.tags;
    let filtered = [];

    for(let i=0; i<filters.length; i++) {
        let filter = filters[i];
        if(i<1) {
            filtered = dirTags[filter];
        }else {
            let temp = dirTags[filter];
            filtered = intersection(filtered, temp);
        }
        // if no result, return
        if(filtered.length === 0) {
            return {};
        }
    }
    let results = {};

    filtered.forEach((fileId) => {
        if(dirFiles[fileId]) {
            results[fileId] = {
                ...dirFiles[fileId]
            };
        }
    });
    return results;
}

// open file
const handleOpenFile = (event, filepath) => {
    shell.openPath(filepath);
}

// helper functions
const intersection = function(arr1, arr2) {
    const filtered = arr1.filter(ele => arr2.includes(ele));
    return filtered;
};


module.exports = {
    handleDirOpen: handleDirOpen,
    handleAddFileTag: handleAddFileTag,
    handleDeleteFileTag: handleDeleteFileTag,
    handleSearchFile: handleSearchFile,
    handleOpenFile: handleOpenFile
}

