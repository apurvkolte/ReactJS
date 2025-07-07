import React, { useState } from 'react';

const MovableZoomImage = ({ mainImage }) => {
    const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center center' });

    // Handle mouse move to zoom and pan image
    const handleMouseMove = (e) => {
        const container = e.currentTarget;
        const { width, height, left, top } = container.getBoundingClientRect();

        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        const xPercent = (mouseX / width) * 100;
        const yPercent = (mouseY / height) * 100;

        const scale = 2;
        const xOffset = (xPercent - 50) * scale;
        const yOffset = (yPercent - 50) * scale;

        // Apply transformation and update state
        setZoomStyle({
            transform: `scale(${scale})`,
            transformOrigin: `${xPercent}% ${yPercent}%`,
            left: `-${xOffset}px`,
            top: `-${yOffset}px`,
        });
    };

    // Reset zoom when mouse leaves the image
    const handleMouseLeave = () => {
        setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '500px',
                height: '500px',
                overflow: 'hidden',
                margin: 'auto',
                background: '#F8F9FA',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={mainImage}
                alt="Zoomable"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                    ...zoomStyle,
                }}
            />
        </div>
    );
};

export default MovableZoomImage;
