import React, { useState, useEffect } from 'react';

const TextViewer = ({ base64Data, mimeType }) => {
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        const loadTextFile = async () => {
            const binaryData = atob(base64Data);
            const blob = new Blob([binaryData], { type: 'text/plain' });
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target.result);
            };
            reader.readAsText(blob);
        };
        loadTextFile();
    }, [base64Data, mimeType]);

    return (
        <div>
            {textContent ? (
                <pre>{textContent}</pre>
            ) : (
                <p>Loading Text File...</p>
            )}
        </div>
    );
};

export default TextViewer;
