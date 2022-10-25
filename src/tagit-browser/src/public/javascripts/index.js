document.addEventListener('DOMContentLoaded', main);

// global variable
let localDir = undefined;
let localFiles = undefined;


// main function
function main(evt) {
	// select local directory
	const directorySelector = document.getElementById('selectDirBtn');
    directorySelector.addEventListener('click', onDirectorySelector);

}

/** functions related to manipulate directory and files */
// when user click directory selector
const onDirectorySelector = async function(evt) {
    localDir = await showDirectoryPicker();
    if(localDir) {
        await getLocalFiles();
        await preprocess();
    }
};

// get all files from the chosen local directory
const getLocalFiles = async function() {
    // clear localFiles
    localFiles = {};

    // read all files from local directory and add them into localFiles
    for await (const entry of localDir.values()) {
        if (entry.kind === "file"){
            const file = await entry.getFile();
            localFiles[file.name] = file;
        }
    // if (entry.kind === "directory") {
    //     const newHandle = await dirHandle.getDirectoryHandle( entry.name, { create: false } );
    //     const newFiles = files[entry.name] = {};
    //     await getAllFiles( newHandle, newFiles );
    // }
    }
};

// preprocess (will be called only if user select directory)
const preprocess = async function() {
    // search dir
    const dirName = encodeURIComponent(localDir.name);
    const url = `../api/searchDir?dirName=${dirName}`;
    const res = await fetch(url);
    const resData = await res.json();

    if(resData.newDir) {
        await addDir();
    } else {
        // not new directory, check whether user added new files to this directory
        const prevFiles = resData.files;
        const newFiles = [];
        for(const key in localFiles) {
            //new file
            if(!prevFiles.includes(key)) {
                newFiles.push(key);
            }
        }
        if(newFiles.length > 0) {
            addFiles(newFiles);
        }
    }
};

/** functions related to directory */
// add dir
const addDir = async function() {
    // array of all files (file name)
    const newFiles = [];
    for(const key in localFiles) {
        newFiles.push(key);
    }

    // create data
    const newDir = {
        name: localDir.name,
        files: newFiles,
        tags: []
    };

    // send directory
    const res = await fetch('../api/addDir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'newDir='+encodeURIComponent(JSON.stringify(newDir))
    });
    
};

/** functions related to files */
// add new files
const addFiles = async function(newFiles) {
    const res = await fetch('../api/addFiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'dirName='+encodeURIComponent(localDir.name)+'&newFiles='+encodeURIComponent(JSON.stringify(newFiles))
    });
}






/** DOM manipulations */
