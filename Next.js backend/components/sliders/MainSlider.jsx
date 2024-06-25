import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSiderImage } from "../../redux/actions/productActions";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const MainSlider = () => {
    const dispatch = useDispatch();
    const { siderImages } = useSelector((state) => state.allSiderImage);

    useEffect(() => {
        dispatch(getSiderImage())
    }, [dispatch])

    return (
        <div style={{ height: "600px" }} className='mobileImage'>
            {siderImages &&
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
                    {siderImages.map((item) => (
                        <div key={item.id}>
                            <img
                                src={`${item.url}`}
                                className='mobileImage'
                                loading='lazy'
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
            }
        </div>
    )
}

export default MainSlider