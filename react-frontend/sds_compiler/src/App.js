import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import PDFViewer from './components/PDFViewer';


//const App = () => {
//    const [pdfData, setPdfData] = useState(null);

//    return (
//        <div style={{ padding: 20 }}>
//            <h2>Upload and view PDF</h2>
//            <FileUploader onFileSelect={setPdfData} />
//            <h2>View PDF</h2>
//            <PDFViewer file={pdfData} />
//        </div>
//    );
//};

//export default App;






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
*/

/*F�rslag*/

const App = () => {
    const [pdfData, setPdfData] = useState(null);

    return (
        <div className="app-container">
            <div className="sidebar"></div>
            <div className="text-white title">Your documents</div>
            <div className="text-white subtitle">Upload your PDFs here and click on �Process�<FileUploader onFileSelect={setPdfData} /></div>
            <div className="dropzone"></div>
            <div className="browse-button">Browse files</div>
            <div className="process-button">Process</div>
            <div className="text-white dropzone-text">Drag and drop files here</div>
            <div className="small-rect"></div>
            <div className="pdf-window"><PDFViewer file={pdfData} /></div>
            <div className="compiled-window"></div>
            <div className="pdf-title">Your PDF: {}</div>
            <div className="compiled-title">Compiled PDF:</div>
            <div className="regenerate-button">Re-generate</div>
            <div className="download-button">Download</div>
        </div>
    )
}

export default App