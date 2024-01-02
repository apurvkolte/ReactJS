import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allCategory } from '../../redux/actions/productActions'
import filtersContext from '../../contexts/filters/filtersContext';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Link from 'next/link';

const CategorySlider = () => {
    const dispatch = useDispatch();
    const { category } = useSelector(state => state.allCategory);


    const {
        categoryMenu,
        selectedPrice: { price, minPrice, maxPrice },
        mobFilterBar: { isMobSortVisible, isMobFilterVisible },
    } = useContext(filtersContext);

    useEffect(() => {
        dispatch(allCategory());
    }, [dispatch])
    return (
        <>
            <Carousel
                additionalTransfrom={0}
                arrows={false}
                autoPlaySpeed={3000}
                centerMode={false}
                className="center d-inline-flex p-2"
                containerClass="container-with-dots"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                spacing={90}
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
                        items: 8,
                        partialVisibilityGutter: 40
                    },
                    mobile: {
                        breakpoint: {
                            max: 464,
                            min: 0
                        },
                        items: 1,
                        partialVisibilityGutter: 30
                    },
                    tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 464
                        },
                        items: 2,
                        partialVisibilityGutter: 30
                    }
                }}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                ssr={true}
                shouldResetAutoplay
                showDots={false}
                sliderClass=""
                slidesToSlide={1}
                swipeable
            >
                {category && category.map((cat) => (
                    <div key={cat.id}>
                        <Link href={`/all-products`} onClick={() => categoryMenu(cat.category)}>
                            <img
                                src={`/uploads/category/${cat.img}`}
                                style={{
                                    display: 'inherit',
                                    height: '70px',
                                    margin: 'auto',
                                    padding: '4px',
                                    width: '70px',
                                    borderRadius: "100px",
                                    border: "2px solid #27aae1"

                                }}
                            />
                            <p className="legend" style={{
                                margin: 'auto',
                                marginTop: "5px",
                                width: '100px',
                            }}>{cat.category}</p>
                        </Link>
                    </div>
                ))}

            </Carousel>
        </>
    )
}

export default CategorySlider