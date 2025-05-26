import React from "react";
import PDFViewer from "./PDFViewer";

const ViewerSection = ({ selectedFile, uploadedFiles, setSelectedFile, /*setCompiledData,*/ setCompiledPdfUrl}) => {
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
        /*setCompiledData(null); // Rensa kompilerad data när PDF rensas*/
    };

    const getFileNameFromData = (data) => {
        const match = uploadedFiles.find((file) => file.data === data);
        return match ? match.name : "Unnamed file";
    };

    const handleAnalyzePDF = async () => {
        if (!selectedFile) return alert("No file selected!");

        try {
            const res = await fetch(selectedFile);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append("file", blob, "uploaded.pdf");

            // Test för pdf extract
            //const response = await fetch("http://localhost:8000/test/extract-pdf4llm/", {
            //    method: "POST",
            //    body: formData,
            //});

            // Skicka anrop till Gemeni
            const response = await fetch("http://localhost:8000/process-pdf-and-analyze/", {
                method: "POST",
                body: formData,
            });

            const extractedData = await response.json();

            // Skicka till PDF-generator
            const pdfResponse = await fetch("http://localhost:8000/generate-pdf/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(extractedData),
            });

            const pdfBlob = await pdfResponse.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Skicka till App
            setCompiledPdfUrl(pdfUrl);
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
                onClick={handleClearPDF}
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