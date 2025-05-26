import React from "react";
import PDFViewer from "./PDFViewer";

// Komponent f�r att visa, dra/sl�ppa och analysera en PDF
const ViewerSection = ({ selectedFile, uploadedFiles, setSelectedFile, setCompiledData, setCompiledPdfUrl, onClearPDF }) => {

    // Drag and drop funkion
    const handleDrop = (e) => {
        e.preventDefault();
        const fileData = e.dataTransfer.getData("application/pdf");
        if (fileData && !selectedFile) {
            const parsedFile = JSON.parse(fileData);
            setSelectedFile(parsedFile.data);
        }
    };

    const getFileNameFromData = (data) => {
        const match = uploadedFiles.find((file) => file.data === data);
        return match ? match.name : "Unnamed file";
    };

    // Skickar fil till backend f�r analys med gemeni
    const handleAnalyzePDF = async () => {
        if (!selectedFile) return alert("No file selected!");

        try {
            
            const res = await fetch(selectedFile); // H�mta PDF fr�n base64-url
            const blob = await res.blob(); // Konvertera till blob

            const formData = new FormData();
            formData.append("file", blob, "uploaded.pdf");

            // Backend anrop
            const response = await fetch("http://localhost:8000/process-pdf-and-analyze/", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            // Parsa json till text
            let readableData = result.SDB;
            if (typeof readableData === "string") {
                try {
                    readableData = JSON.parse(readableData);
                } catch (e) {
                    console.warn("Could not parse Gemini output as JSON, showing as text");
                }
            }

            setCompiledData(readableData);

        } catch (error) {
            console.error("API error:", error);
            alert("Something went wrong, is backend running?");
        }
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
                    <div className="drop-hint">Drag and drop your PDF-file here</div>
                )}
            </div>
            <button
                className="clear-button"
                onClick={onClearPDF}
                disabled={!selectedFile}
            >
                Clear PDF
            </button>
            <button
                className="analyze-button"
                onClick={handleAnalyzePDF}
                disabled={!selectedFile}
            >
                Analyze PDF
            </button>
        </div>
    );

};

export default ViewerSection;