import React from 'react';

const PDFViewer = ({ file }) => {
    if (!file) return null;

    return (
        <embed
            src={file}
            type="application/pdf"
            width="100%"
            height="600px"
        />
    );
};

export default PDFViewer;
