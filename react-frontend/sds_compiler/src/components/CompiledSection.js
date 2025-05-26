import React from "react";

const CompiledSection = ({ /*compiledData, */compiledPdfUrl }) => {
    return (
        <div className="section">
            <div className="compiled-title">Compiled PDF:</div>
            <div className="compiled-window">
                {compiledPdfUrl ? (
                    <iframe
                        src={compiledPdfUrl}
                        width="100%"
                        height="100%"
                        title="Compiled PDF"
                    />
                ) : (
                    <p className="compiled-text">No data</p>
                )}
            </div>
            {/*<button className="regenerate-button">Re-generate</button>*/}
            <button
                className="download-button"
                onClick={() => {
                    if (compiledPdfUrl) {
                        const a = document.createElement("a");
                        a.href = compiledPdfUrl;
                        a.download = "compiled.pdf";
                        a.click();
                    }
                }}
                disabled={!compiledPdfUrl}
            >
                Download
            </button>
        </div>
    );
};

export default CompiledSection;
