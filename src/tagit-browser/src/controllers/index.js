const fs = require('fs');
// TODO will files updated? maybe require inside functions and use delete cache
const dirsData = require('../../data/directory.json');
const filesData = require('../../data/file.json');
const tagsData = require('../../data/tag.json');

/** functions related to directory */
// search directory, chekc whether required directory exist
const searchDirectory = async (req, res) => {
    const dirName = req.query.dirName;
    let result;
    // TODO maybe search from end to start because user tends to use recent directory
    for(let i=0; i<dirsData.length; i++) {
        const curr = dirsData[i];
        if(curr.name === dirName) {
            result = {newDir: false, files: curr.files};
            break;
        }
    }
    // if not new directory, send files back
    if(result) {
        res.json(result);
    }else {
        res.json({newDir: true});
    }
};

// get directory 
const getDirectory = async (req, res) => {
    const dirName = req.query.dirName;
    let result;
    for(let i=0; i<dirsData.length; i++) {
        const curr = dirsData[i];
        if(curr.name === dirName) {
            result = {files: curr.files, tags: curr.tags};
            break;
        }
    }
    res.json(result);
};

// add directory (add new directory and corresponding files)
const addDirectory = async (req, res) => {
    // const dirName = req.body.dirName;
    // const files = JSON.parse(req.body.files).newFiles;
    // // add new directory
    // let newDir = {
    //     name: dirName,
    //     files: files,
    //     tags: []
    // };
    if(req.body.newDir) {
        dirsData.push(JSON.parse(req.body.newDir));
        fs.writeFileSync(__dirname+'/../../data/directory.json', JSON.stringify(dirsData));
        res.json({success: true});  
    } else {
        res.json({success: false});
    }
};

/** functions related to files */
const addFiles = async (req, res) => {
    const dirName = req.body.dirName;
    const newFiles = JSON.parse(req.body.newFiles);
    console.log(newFiles[0]);
    res.send({ok:true})
}







module.exports = {
    searchDirectory,
    getDirectory,
    addDirectory,
    addFiles
};