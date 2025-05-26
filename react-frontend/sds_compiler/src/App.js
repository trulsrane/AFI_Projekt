import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ViewerSection from "./components/ViewerSection";
import CompiledSection from "./components/CompiledSection";

export const App = () => {
    const [compiledPdfUrl, setCompiledPdfUrl] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    /*const [compiledData, setCompiledData] = useState(null);*/


    return (
        <div className="app-container">
            <Sidebar
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                setSelectedFile={setSelectedFile}
                
            />

            <div className="main-content">
                <div className="viewer-sections">
                    <ViewerSection
                        selectedFile={selectedFile}
                        uploadedFiles={uploadedFiles}
                        setSelectedFile={setSelectedFile}
                        /*setCompiledData={setCompiledData}*/
                        setCompiledPdfUrl={setCompiledPdfUrl}
                    />
                    <CompiledSection
                        /*compiledData={compiledData}*/
                        compiledPdfUrl={compiledPdfUrl}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;