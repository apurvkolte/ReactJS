// ImageZoom.js
import React, { useState } from 'react';
import './ImageZoom.css'; // Import your CSS file

const ImageZoom = ({ imageUrl }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleZoomToggle = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div className={`image-zoom-container ${isZoomed ? 'zoomed' : ''}`}>
            <img
                src={imageUrl}
                alt="Zoomable Image"
                onClick={handleZoomToggle}
            />
        </div>
    );
};

export default ImageZoom;





// /* ImageZoom.css */
// .image-zoom-container {
//     overflow: hidden;
//     cursor: zoom-in;
//   }

//   .image-zoom-container.zoomed {
//     cursor: zoom-out;
//   }

//   .image-zoom-container img {
//     transition: transform 0.3s ease-in-out;
//   }

//   .image-zoom-container.zoomed img {
//     transform: scale(2); /* Adjust the scale factor as needed */
//   }




// App.js
import React from 'react';
import ImageZoom from './ImageZoom';

const App = () => {
    const imageUrl = 'path-to-your-image.jpg'; // Replace with your image URL

    return (
        <div>
            <h1>Image Zoom Example</h1>
            <ImageZoom imageUrl={imageUrl} />
        </div>
    );
};

export default App;
