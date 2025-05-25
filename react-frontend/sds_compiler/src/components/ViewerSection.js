import React from "react";
import PDFViewer from "./PDFViewer";

const ViewerSection = ({ selectedFile, uploadedFiles, setSelectedFile }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const fileData = e.dataTransfer.getData("application/pdf");
        if (fileData && !selectedFile) {
            const parsedFile = JSON.parse(fileData);
            setSelectedFile(parsedFile.data);
        }
    };

    const handleClearPDF = () => {
        setSelectedFile(null);
    };

    const getFileNameFromData = (data) => {
        const match = uploadedFiles.find((file) => file.data === data);
        return match ? match.name : "Unnamed file";
    };

    return (
        <div className="section">
            <div className="pdf-title">
                Your PDF: {selectedFile && <span className="pdf-filename">{getFileNameFromData(selectedFile)}</span>}
            </div>

            <div
                className="pdf-viewer-container"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <PDFViewer file={selectedFile} />
                {!selectedFile && (
                    <div className="drop-hint">Drag and drop your PDF-file</div>
                )}
            </div>

            {selectedFile && (
                <button className="clear-button" onClick={handleClearPDF}>
                    Clear PDF
                </button>
            )}
        </div>
    );
};

export default ViewerSection;
