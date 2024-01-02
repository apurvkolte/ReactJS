
import ReactImageMagnify from 'react-image-magnify';
import "react-medium-image-zoom/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

<div className="containerZoom">
    <div className="leftZoom">
        <div className="left_1Zoom">
            {images && images.map((image, i) => (
                <div
                    className={i === 0 ? 'img_wrapZoom activeimg' : 'img_wrapZoom'}
                    key={i}
                    id='classList'
                    onMouseOver={() => hoverHandler(image.imageName, i)}
                    ref={addRefs}
                >
                    <img src={image.imageName} alt="" onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/images/box.png";
                    }} />
                </div>
            ))}
        </div>
        <div className="left_2Zoom ">
            <ReactImageMagnify
                {...{
                    smallImage: {
                        alt: img.toString(),
                        src: img.toString(),
                        width: 450,
                        height: isMobile ? 200 : 400,
                        sizes: "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px"
                    },
                    largeImage: {
                        src: img.toString(),
                        isFluidWidth: true,
                        width: 1200,
                        height: 1180
                    },
                    enlargedImageContainerDimensions: {
                        width: '162%',
                        height: '120%'
                    },
                    enlargedImageContainerStyle: { background: '#fff', zIndex: 9 }
                }}
            />
        </div>
    </div>
    <div className="right"></div>
















    {/* Example 3 */}














</div>