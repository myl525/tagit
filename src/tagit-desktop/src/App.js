import React, {useState} from 'react';
// import bootstrap elements
import 'bootstrap/dist/css/bootstrap.min.css';
// import components
import Sides from './components/sides/sides';
import Main from './components/main/main';

const App = () => {
    const [files, setFiles] = useState([]);

    const openDir = async () => {
        let data =await window.navAPIs.openDir();
        setFiles(data);
    }

    return(
        <>
            <Sides openDir={() => openDir()} />
            <Main files={files} />
        </>
    );
}

export default App;