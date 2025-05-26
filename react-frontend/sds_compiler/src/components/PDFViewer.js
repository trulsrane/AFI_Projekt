import React from 'react';

const PDFViewer = ({ file }) => {
    if (!file) return null;

    return (
        <iframe
            src={file}
            title="PDF Viewer"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
        />
    );
};

export default PDFViewer;
