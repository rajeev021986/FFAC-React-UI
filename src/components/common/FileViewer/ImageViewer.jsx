import React, { useEffect, useState } from "react";

const ImageViewer = ({ base64Data, mimeType }) => {
    const [imageData, setImageData] = useState(null);

    const displayImage = () => {
        const imageDataUrl = `data:${mimeType};base64,${base64Data}`;
        setImageData(imageDataUrl);
    };
    useEffect(() => {
        displayImage();
    }, [base64Data])

    return (
        <div>
            {imageData && <img src={imageData} alt="Uploaded" style={{ width: "100%", maxHeight: "400px" }} />}
        </div>
    );
};

export default ImageViewer;
