import React from 'react';
import ReactImageZoom from 'react-image-zoom';

const ZoomedImage = () => {
    // Image properties
    const imgProps = {
        width: 400,
        height: 300,
        src: '/path/to/image.jpg',
        alt: 'Image'
    };

    // Zoom properties
    const zoomProps = {
        width: 400,
        height: 300,
        zoomWidth: 500,
        scale: 1.5,
        offset: { vertical: 0, horizontal: 10 },
        zoomLensStyle: { backgroundColor: 'rgba(255,255,255,0.5)' }
    };

    return (
        <div>
            <ReactImageZoom {...imgProps} {...zoomProps} />
        </div>
    );
};

export default ZoomedImage;






// or


import React, { useState } from 'react';

const ZoomedImage = () => {
    const [zoomed, setZoomed] = useState(false);

    const toggleZoom = () => {
        setZoomed(!zoomed);
    };

    return (
        <div style={{ position: 'relative' }}>
            <img
                src="/path/to/image.jpg"
                alt="Image"
                style={{ width: zoomed ? '200%' : '100%', transition: 'width 0.5s' }}
                onClick={toggleZoom}
            />
        </div>
    );
};

export default ZoomedImage;
