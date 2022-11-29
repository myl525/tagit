const { shell, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
// import files
const dirsData = require('../data/data.json');

/** help functions */
// browse directory
function readFilesSync(dir) {
    const files = [];
  
    fs.readdirSync(dir).forEach(filename => {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();
  
        if(ext){ //file
            files.push({ filepath, name, ext});
        }else if(!isFile){ //directory
            let tempFiles = [];
            tempFiles = readFilesSync(filepath);
            const dirName = path.basename(filepath);
            for(let i=0; i<tempFiles.length; i++) {
                tempFiles[i].name = dirName + '/' + tempFiles[i].name;
            }

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
        const dirName = path.basename(filePaths[0]);
        const files = readFilesSync(filePaths[0]);
        if(dirsData[dirName]) {
            // check whether there is new file
            const dirFiles = dirsData[dirName].files;
            files.forEach((file) => {
                if(!dirFiles[file.name]) {
                    // create new file entry
                    dirFiles[file.name] = {
                        filepath: file.filepath,
                        name: file.name,
                        ext: file.ext,
                        fileTags: []
                    }
                }
            })
            fs.writeFileSync(path.resolve(process.cwd(), 'data/data.json'), JSON.stringify(dirsData));
            return dirsData[dirName];
        }else {
            const obj = {
                files: {},
                tags: {}
            };
            files.forEach((file) => {
                obj.files[file.name] = {
                    filepath: file.filepath,
                    name: file.name,
                    ext: file.ext,
                    fileTags: []
                };
            });
            dirsData[dirName] = obj;
            fs.writeFileSync(path.resolve(process.cwd(), 'data/data.json'), JSON.stringify(dirsData));
            return obj;
        }
    }
}

module.exports = {
    handleDirOpen: handleDirOpen,
}

