import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';

const WordViewer = ({ base64Data, mimeType }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const loadWordDoc = async () => {
            // Decode base64 data
            const binaryData = atob(base64Data);
            const uint8Array = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            try {
                const result = await mammoth.convertToHtml({ arrayBuffer: uint8Array });
                setHtmlContent(result.value);
            } catch (error) {
                console.error("Error converting Word document:", error);
            }
        };

        loadWordDoc();
    }, [base64Data]);

    return (
        <div>
            {htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
                <p>Loading Word Document...</p>
            )}
        </div>
    );
};

export default WordViewer;
