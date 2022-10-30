import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
document.addEventListener('DOMContentLoaded', main);
// global variable
let localDir = undefined;
let localFiles = undefined;
let dataFiles = undefined;
let dataTags = undefined;

// main function
async function main(evt) {
    // check if there is stored directory (last directory)
    const recentDirBtn = document.getElementById('recentDirBtn');
    if(!await get('directory')) {
        recentDirBtn.style.visibility = 'hidden';
    }
    // use recent directory
    
    recentDirBtn.addEventListener('click', onClickRecentDirBtn);
	// select local directory
	const directorySelector = document.getElementById('selectDirBtn');
    directorySelector.addEventListener('click', onDirectorySelector);
    // click home button
    const homeBtn = document.getElementById('homeBtn');
    homeBtn.addEventListener('click', onClickHomeBtn);
    // click search button
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', onClickSearchBtn);
}

/** functions related to manipulate directory and files */
async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

const start = async () => {
    await getLocalFiles();
    await preprocess();
    await getDir();
    document.getElementById('homeBtn').disabled = false;
    document.getElementById('searchInput').disabled = false;
    document.getElementById('searchBtn').disabled = false;
};

// when user click use recent directory button
const onClickRecentDirBtn = async function(evt) {
    localDir = await get('directory');
    if(localDir) {
        const permission = await(verifyPermission(localDir));
        if(permission) {
            start();
        }
    }
}

// when user click directory selector
const onDirectorySelector = async function(evt) {
    localDir = await showDirectoryPicker();
    
    if(localDir) {
        await set('directory', localDir);
        start();
    }
};

// get all files from the chosen local directory
const getLocalFiles = async function() {
    // clear localFiles
    localFiles = {};

    // read all files from local directory and add them into localFiles
    for await (const entry of localDir.values()) {
        if (entry.kind === 'file'){
            const file = await entry.getFile();
            localFiles[file.name] = file;
        }
    // if (entry.kind === "directory") {
    //     const newHandle = await dirHandle.getDirectoryHandle( entry.name, { create: false } );
    //     const newFiles = files[entry.name] = {};
    //     await getLocalFiles( newHandle, newFiles );
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
        const currFiles = Object.keys(localFiles);

        const newFiles = currFiles.filter((currFile) => {
            return !prevFiles.includes(currFile);
        });

        if(newFiles.length > 0) {
            addDirFiles(newFiles);
        }
    }
};

/** functions related to directory */
// add dir
const addDir = async function() {
    // array of all files (file name)
    const files = Object.keys(localFiles);

    // send directory
    const res = await fetch('../api/addDir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `dirName=${encodeURIComponent(localDir.name)}&files=${encodeURIComponent(JSON.stringify(files))}`
    });
};

// update directory files
const addDirFiles = async function(newFiles) {
    const res = await fetch('../api/addDirFiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'dirName='+encodeURIComponent(localDir.name)+'&newFiles='+encodeURIComponent(JSON.stringify(newFiles))
    });
};

// update directory tags
const addDirTags = async function(fileName, newTag) {
    // send to the database
    const res = await fetch('../api/addDirTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'dirName='+encodeURIComponent(localDir.name)+'&fileName='+encodeURIComponent(fileName)+'&tagName='+encodeURIComponent(newTag)
    });
};

// get directory
const getDir = async function() {
    const dirName = encodeURIComponent(localDir.name);
    
    const url = `../api/getDir?dirName=${dirName}`;
    const res = await fetch(url);
    const resData = await res.json();
    dataFiles = resData.files;
    dataTags = resData.tags;
    displayAllTags(Object.keys(dataTags));
    displayAllFileCards(Object.keys(dataFiles));
};

// delete files' tags
const deleteDirTags = async function(fileName, tagName) {
    const res = await fetch('../api/deleteDirTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'dirName='+encodeURIComponent(localDir.name)+'&fileName='+encodeURIComponent(fileName)+'&tagName='+encodeURIComponent(tagName)
    });
};


/** DOM manipulations */
// clear all tags
const clearTags = function() {
    const tags = document.getElementById('tags');
    tags.remove();
    const newTags = document.createElement('div');
    newTags.id = 'tags';
    newTags.className = 'tags';
    document.getElementById('tagsResultsArea').appendChild(newTags);
};

// display all tags
const displayAllTags = function(tags) {
    clearTags();
    const tagsArea = document.getElementById('tags');
    const tagsArr = tags.map((tagName) => {
        const tag = document.createElement('button');
        tag.className = 'tag';
        tag.textContent = tagName;
        tag.addEventListener('click', onClickTag);
        return tag;
    });
    tagsArea.append(...tagsArr);
};

// clear all cards
const clearCards = function() {
    const cards = document.getElementById('cards');
    cards.remove();
    const newCards = document.createElement('div');
    newCards.id = 'cards';
    newCards.className = 'cards';
    document.getElementById('cardsResultsArea').appendChild(newCards);
};

// create file card
const createFileCard = function(fileName, tags) {
    const card = document.createElement('div');
    card.className = 'card';

    const file = document.createElement('div');
    file.className = 'file';

    const cardFileName = document.createElement('span');
    cardFileName.className = 'file_name';
    cardFileName.textContent = fileName;
    cardFileName.addEventListener('click', onClickFileName);

    const cardTags = document.createElement('div');
    cardTags.className = 'file_tags';
    const tagArr = tags.map((ele) => {
        const tagWrapper = document.createElement('div');
        tagWrapper.className = 'tag_wrapper';
        const tag = document.createElement('button');
        tag.className = 'tag';
        tag.textContent = ele;
        tag.addEventListener('click', onClickTag);
        const deleteTagBtn = document.createElement('iconify-icon');
        deleteTagBtn.className = 'delete_tag';
        deleteTagBtn.icon = 'ep:remove-filled';
        deleteTagBtn.addEventListener('click', onClickDeleteTagBtn);
        tagWrapper.append(tag, deleteTagBtn);
        return tagWrapper;
    });    

    const addTagBtn = document.createElement('button');
    addTagBtn.className = 'add_tag';
    addTagBtn.textContent = '+';
    addTagBtn.id = fileName;
    addTagBtn.addEventListener('click', onClickAddTagButton);
    tagArr.push(addTagBtn);

    file.appendChild(cardFileName);
    cardTags.append(...tagArr);
    card.append(file, cardTags);
    return card;
};

// display all file Cards
const displayAllFileCards = function(files) {
    clearCards();
    const cardsArea = document.getElementById('cards');
    const cards = [];

    files.forEach((file) => {
        const card = createFileCard(file, dataFiles[file].tags);
        cards.push(card);
    });
    cardsArea.append(...cards);
};


/** event handler */
// handle click home button
const onClickHomeBtn = async function(evt) {
    if(localDir) {
       await getDir(); 
    }
};

// handle click search button
const onClickSearchBtn = async function(evt) {
    const searchInput = document.getElementById('searchInput');
    if(searchInput.value) {
        const tagName = searchInput.value;
        const filtered = dataTags[tagName].files;
        displayAllFileCards(filtered);
    }
};

// handle click tag
const onClickTag = function(evt) {
    const tagName = evt.target.textContent;
    const filtered = dataTags[tagName].files;
    displayAllFileCards(filtered);
};

// handle click file name
const onClickFileName = async function(evt) {
    const file = localFiles[evt.target.textContent];
    const URL = window.URL || window.webkitURL; 
    const fileURL = URL.createObjectURL(file);
    window.open(`../videoPlayer?fileURL=${fileURL}&fileName=${evt.target.textContent}`);
};

// handle click add tag button
const onClickAddTagButton = async function(evt) {
    const fileName = evt.target.id;
    let newTag = prompt('Enter your tag: ');
    if(newTag) {
        if(!dataFiles[fileName].tags.includes(newTag)) {
            addDirTags(fileName, newTag);
            getDir();
        }
    }
};

// handle click delete tag button
const onClickDeleteTagBtn = async function(evt) {
    const fileName = evt.target.parentNode.parentNode.lastChild.id;
    const tagName = evt.target.parentNode.firstChild.textContent;
    deleteDirTags(fileName, tagName);
    getDir();
};