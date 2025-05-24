import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import PDFViewer from "./components/PDFViewer";

export const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="app-container">
            <h2>Ladda upp och visa PDF</h2>

            <FileUploader onFileSelect={setSelectedFile} />

            {selectedFile && (
                <>
                    <div className="pdf-info">
                        <span className="pdf-filename">{selectedFile.name}</span>
                    </div>
                    <div className="pdf-viewer-container">
                        <PDFViewer file={selectedFile} />
                    </div>
                    
                </>
            )}
        </div>
    );
};

export default App;







/* logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

//Förslag
//import React from 'react'

//const App = () => {
//    const pdf_name = "example.pdf"

//    return (
//        <div className="app-container">
//            <div className="sidebar"></div>
//            <div className="text-white title">Your documents</div>
//            <div className="text-white subtitle">Upload your PDFs here and click on ‘Process’</div>
//            <div className="dropzone"></div>
//            <div className="browse-button">Browse files</div>
//            <div className="process-button">Process</div>
//            <div className="text-white dropzone-text">Drag and drop files here</div>
//            <div className="small-rect"></div>
//            <div className="pdf-window"></div>
//            <div className="compiled-window"></div>
//            <div className="pdf-title">Your PDF: {pdf_name}</div>
//            <div className="compiled-title">Compiled PDF:</div>
//            <div className="regenerate-button">Re-generate</div>
//            <div className="download-button">Download</div>
//        </div>
//    )
//}

//export default App
*/