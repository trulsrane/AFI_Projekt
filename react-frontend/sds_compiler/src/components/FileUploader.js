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
        <div>
            <input type="file" accept="application/pdf" onChange={handleChange} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default FileUploader;
