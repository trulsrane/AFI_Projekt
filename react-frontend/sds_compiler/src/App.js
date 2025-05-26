import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ViewerSection from "./components/ViewerSection";
import CompiledSection from "./components/CompiledSection";

export const App = () => {
    const [compiledPdfUrl, setCompiledPdfUrl] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [compiledData, setCompiledData] = useState(null);

    // Logik för rensa knappar
    const handleClearFiles = () => {
        setUploadedFiles([]);
        setSelectedFile(null);
        setCompiledData(null);
        setCompiledPdfUrl(null);
    };

    const handleClearPDF = () => {
        setSelectedFile(null);
        setCompiledData(null);
        setCompiledPdfUrl(null);
    };

    return (
        <div className="app-container">
            <Sidebar
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                setSelectedFile={setSelectedFile}
                onClearFiles={handleClearFiles}
            />

            <div className="main-content">              
                <div className="viewer-sections">
                    <ViewerSection
                        selectedFile={selectedFile}
                        uploadedFiles={uploadedFiles}
                        setSelectedFile={setSelectedFile}
                        setCompiledData={setCompiledData}
                        setCompiledPdfUrl={setCompiledPdfUrl}
                        onClearPDF={handleClearPDF}
                    />
                    <CompiledSection
                        compiledData={compiledData}
                        compiledPdfUrl={compiledPdfUrl}
                        setCompiledPdfUrl={setCompiledPdfUrl}
                    />

                </div>
            </div>

            <div className="footer">
                (C) 2025 MIT Solutions,
            </div>
            <div className="footer-lower">
                Jesper Olofsson and Truls Rane
            </div>

        </div>
    );
};

export default App;