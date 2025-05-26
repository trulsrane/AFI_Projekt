import React, { useState } from "react";

// visa sammanst�ld data i text eller pdf
const CompiledSection = ({ compiledData, compiledPdfUrl, setCompiledPdfUrl }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePdf = async () => {
        if (!compiledData) return;

        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Skicka data till backend f�r att generera en PDF-fil
            const response = await fetch("http://localhost:8000/generate-pdf/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(compiledData),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            // H�mta PDF som blob (binary large object)
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setCompiledPdfUrl(pdfUrl);

        } catch (error) {

            console.error("PDF generation failed:", error);
            alert("PDF could not be generated.");

        } finally {
            setIsGenerating(false);
        }
    };

    // Visa JSON-data fr�n backend i l�sbar text
    const renderReadableData = (data) => {
        if (typeof data !== "object" || data === null) {
            return <p>{String(data)}</p>;
        }

        return (
            <div style={{ textAlign: "left", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: "1rem" }}>
                        <strong>{key}</strong>:<br />
                        {Array.isArray(value) ? (
                            value.map((item, i) => <div key={i}>- {item}</div>)
                        ) : typeof value === "object" ? (
                            renderReadableData(value)
                        ) : (
                            <span>{String(value)}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="section">
            <div className="compiled-title">Extracted data: </div>
            <div className="compiled-window">
                {compiledPdfUrl ? (
                    /* Visa PDF med iFrame */
                    <iframe
                        src={compiledPdfUrl}
                        width="100%"
                        height="500px"
                        title="Compiled PDF"
                    />
                ) : compiledData ? (
                    renderReadableData(compiledData)
                ) : (
                    <p className="compiled-text">No data yet</p>
                )}
            </div>

            <button
                className="regenerate-button"
                onClick={handleGeneratePdf}
                disabled={!compiledData || isGenerating}
            >
                {/* Byt utseende p� knapp beroende p� state */}
                {isGenerating ? "Generating..." : "Generate PDF"}
            </button>
            <button
                className="download-button"
                onClick={() => {

                    // G�r PDF-filen nerladdningsbar
                    if (compiledPdfUrl) {
                        const a = document.createElement("a");
                        a.href = compiledPdfUrl;
                        a.download = "compiled_sds.pdf";
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