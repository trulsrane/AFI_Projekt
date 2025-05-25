import React from 'react';

const FileUploader = ({ onFilesUpdate }) => {
    const fileType = ['application/pdf'];

    const handleChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => fileType.includes(file.type));

        const readers = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve({ name: file.name, data: reader.result });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(pdfFiles => {
            onFilesUpdate((prev) => [...prev, ...pdfFiles]);
        });
    };

    return (
        <div className="file-uploader">
            <h2>Upload and view PDF-files</h2>
            <div className="file-upload-row">
                <label htmlFor="file-upload" className="browse-button">Browse</label>
                <span className="upload-instruction">Browse and upload file(s)</span>
            </div>
            <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                onChange={handleChange}
                className="file-input"
                multiple
            />
        </div>
    );
};

export default FileUploader;