import React, { Fragment, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allCategory } from '../../redux/actions/productActions';
import filtersContext from '../../contexts/filters/filtersContext';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Link from 'next/link';

const CategorySlider = () => {
    const dispatch = useDispatch();
    const { category } = useSelector(state => state.allCategory);
    const { categoryMenu } = useContext(filtersContext);

    useEffect(() => {
        dispatch(allCategory());
    }, [dispatch]);

    return (
        <Fragment>
            {category && (
                <Carousel
                    additionalTransfrom={0}
                    arrows={true}
                    autoPlay={false}
                    // autoPlaySpeed={3000}
                    centerMode={false}
                    className="center d-inline-flex p-3"
                    containerClass="container-with-dots"
                    dotListClass=""
                    // draggable
                    focusOnSelect={false}
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
                            partialVisibilityGutter: 0
                        },
                        tablet: {
                            breakpoint: {
                                max: 1024,
                                min: 464
                            },
                            items: 2,
                            partialVisibilityGutter: 0
                        }
                    }}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    ssr={true}
                    // shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                // swipeable
                >
                    {category.map((cat) => (
                        <div key={cat.id}>
                            <Link href={`/all-products?product=${encodeURIComponent(cat.category)}`}>
                                <a onClick={() => categoryMenu(cat.category)} style={{ textAlign: 'center', display: 'block' }}>
                                    <img
                                        src={`/uploads/category/${cat.img}`}
                                        loading="lazy"
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
                                </a>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            )}
        </Fragment>
    );
}

export default CategorySlider;
