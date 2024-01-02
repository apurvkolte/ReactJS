import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSiderImage } from "../../redux/actions/productActions";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
//https://react-multi-carousel.surge.sh/?selectedKind=Carousel&selectedStory=With%20dots%20rendered%20outside%20of%2Fafter%20list%20container%20within%20custom%20div%20for%20styling&full=0&addons=1&stories=1&panelRight=0&addonPanel=kadira%2Fjsx%2Fpanel
const MainSlider = () => {
    const dispatch = useDispatch();
    const { siderImages } = useSelector((state) => state.allSiderImage);


    useEffect(() => {
        dispatch(getSiderImage())
    }, [dispatch])


    // function createBubble() {
    //     const section =
    //         document.querySelector("div");
    //     const createElement =
    //         document.createElement("span");
    //     var size = Math.random() * 60;

    //     createElement.style.animation =
    //         "animation 6s linear infinite";
    //     createElement.style.width = 180 + size + "px";
    //     createElement.style.height = 180 + size + "px";
    //     createElement.style.left =
    //         Math.random() * innerWidth + "px";
    //     section.appendChild(createElement);

    //     setTimeout(() => {
    //         createElement.remove();
    //     }, 4000);
    // }
    // setInterval(createBubble, 100);

    return (
        <div style={{ height: "600px" }} className='mobileImage'>
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlay
                autoPlaySpeed={3000}
                centerMode={false}
                className=""
                containerClass="container-with-dots"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                    desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024
                        },
                        items: 1
                    },
                    mobile: {
                        breakpoint: {
                            max: 464,
                            min: 0
                        },
                        items: 1
                    },
                    tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 464
                        },
                        items: 1
                    }
                }
                }
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay
                showDots
                sliderClass=""
                slidesToSlide={1}
                swipeable
            >
                {siderImages && siderImages.map((item) => (
                    <div key={item.id}>
                        <img
                            src={`${item.url}`}
                            className='mobileImage'
                            style={{
                                display: 'block',
                                height: '600px',
                                margin: 'auto',
                                width: '100%'
                            }}
                        />

                    </div>
                ))}

            </Carousel >
        </div>
    )
}

export default MainSlider