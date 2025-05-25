import React from "react";

const CompiledSection = () => {
    return (
        <div className="section">
            <div className="compiled-title">Compiled PDF:</div>
            <div className="compiled-window"></div>
            <button className="regenerate-button">Re-generate</button>
            <button className="download-button">Download</button>
        </div>
    );
};

export default CompiledSection;
