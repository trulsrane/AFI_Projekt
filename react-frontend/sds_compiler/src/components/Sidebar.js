import React from "react";
import FileUploader from "./FileUploader";

const Sidebar = ({ uploadedFiles, setUploadedFiles, setSelectedFile }) => {
    const handleClearList = () => {
        setUploadedFiles([]);
        setSelectedFile(null);
    };

    return (
        <div className="sidebar">
            <FileUploader onFilesUpdate={setUploadedFiles} />

            <div className="file-list">
                {uploadedFiles.map((file, index) => (
                    <div
                        key={index}
                        className="file-card"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("application/pdf", JSON.stringify(file));
                        }}
                    >
                        {file.name}
                    </div>
                ))}
            </div>

            {uploadedFiles.length > 0 && (
                <button className="clear-button" onClick={handleClearList}>
                    Clear files
                </button>
            )}
        </div>
    );
};

export default Sidebar;
