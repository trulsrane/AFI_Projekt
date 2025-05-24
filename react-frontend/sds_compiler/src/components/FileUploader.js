import React, { useState } from 'react';

const FileUploader = ({ onFileSelect }) => {
    const [error, setError] = useState('');
    const fileType = ['application/pdf'];

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file && fileType.includes(file.type)) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setError('');
                onFileSelect(reader.result);
            };
        } else {
            setError('Please select a valid PDF file');
            onFileSelect(null);
        }
    };

    return (
        <div className="file-uploader">
            <h2>Upload and view PDF-file</h2>
            <div className="file-upload-row">
                <label htmlFor="file-upload" className="browse-button">Browse</label>
                <span className="upload-instruction">Browse and upload file</span>
            </div>
            <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                onChange={handleChange}
                className="file-input"
            />
            {error && <div className="file-error">{error}</div>}
        </div>
    );
};

export default FileUploader;
