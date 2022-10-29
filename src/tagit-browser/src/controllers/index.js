const fs = require('fs');
const path = require('path');
// TODO will files updated? maybe require inside functions and use delete cache
const dirsData = require('../../data/directory.json');

/** functions related to directory */
// search directory, chekc whether required directory exist
const searchDirectory = async (req, res) => {
    const dirName = req.query.dirName;
    if(dirsData[dirName]) {
        res.json({newDir: false, files: Object.keys(dirsData[dirName].files)});
    }else {
        res.json({newDir: true});
    }
};

// get directory 
const getDirectory = async (req, res) => {
    const dirName = req.query.dirName;
    
    const files = dirsData[dirName].files;
    const tags = dirsData[dirName].tags;

    res.json({files, tags});
};

// add directory (add new directory and corresponding files)
const addDirectory = async (req, res) => {
    const dirName = req.body.dirName;
    const files = JSON.parse(req.body.files);
    
    // create object
    const obj = {
        files: {},
        tags: {},
    };
    files.forEach((file) => {
        obj.files[file] = {
            tags: []
        };
    });
    dirsData[dirName] = obj;

    try {
        const temp = path.join(process.cwd(), 'data/directory.json');
        fs.writeFileSync(temp, JSON.stringify(dirsData));
        res.json({success: true});
    }catch(err) {
        console.log(err);
    }
};

// update directory (new files detected)
const updateDirectoryFiles = async (req, res) => {
    const dirName = req.body.dirName;
    const newFiles = JSON.parse(req.body.newFiles);

    newFiles.forEach((newFile) => {
        dirsData[dirName].files[newFile] = {
            tags: []
        };
    });

    try {
        const temp = path.join(process.cwd(), 'data/directory.json');
        fs.writeFileSync(temp, JSON.stringify(dirsData));
        res.json({success: true});
    }catch(err) {
        console.log(err);
        res.json({success: false});
    }
};

// update tags (client add new tags for file)
const updateDirectoryTags = async (req, res) => {
    const dirName = req.body.dirName;
    const fileName = req.body.fileName;
    const tagName = req.body.tagName;

    dirsData[dirName].files[fileName].tags.push(tagName);

    let tags = dirsData[dirName].tags;
    if(tags[tagName]) {
        //already exist
        tags[tagName].files.push(fileName);
    }else {
        tags[tagName] = {
            files: [fileName]
        };
    }

    try {
        const temp = path.join(process.cwd(), 'data/directory.json');
        fs.writeFileSync(temp, JSON.stringify(dirsData));
        res.json({success: true});
    }catch(err) {
        console.log(err);
        res.json({success: false});
    }
};

// delete tags (client delete tag of a file)
const deleteDirectoryTags = async (req, res) => {
    const dirName = req.body.dirName;
    const fileName = req.body.fileName;
    const tagName = req.body.tagName;

    // remove this tag from selected file
    let file = dirsData[dirName].files[fileName];
    const indexOfTag = file.tags.indexOf(tagName);
    file.tags.splice(indexOfTag, 1);

    // remove this file from deleted tag
    let tag = dirsData[dirName].tags[tagName];
    const indexOfFile = tag.files.indexOf(fileName);
    tag.files.splice(indexOfFile, 1);

    // if there are no other files that have this tag, remove it from directory
    if(tag.files.length === 0) {
        delete dirsData[dirName].tags[tagName];
    }

    try {
        const temp = path.join(process.cwd(), 'data/directory.json');
        fs.writeFileSync(temp, JSON.stringify(dirsData));
        res.json({success: true});
    }catch(err) {
        console.log(err);
        res.json({success: false});
    }
};

module.exports = {
    searchDirectory,
    getDirectory,
    addDirectory,
    updateDirectoryFiles,
    updateDirectoryTags,
    deleteDirectoryTags
};