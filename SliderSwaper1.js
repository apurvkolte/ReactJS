import { useEffect, useState } from "react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleProduct from "./../ecommerce/SingleProduct";
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from "../../redux/action/productActions";
import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';
import "swiper/scss/effect-coverflow";

SwiperCore.use([Navigation, Autoplay]);

const NewArrival = () => {
    const dispatch = useDispatch();
    const { loading, products, error, productsCount, productImages, resPerPage, filteredProductsCount, productsTop } = useSelector(state => state.productsOld)

    const fetchProducts = () => {
        dispatch(getProducts());
    };


    useEffect(() => {
        if (error) {
            alert.error(error);
        }

        fetchProducts();
    }, [dispatch]);


    return (
        <>
            <Swiper
                slidesPerView={4}
                slidesPerGroup={4}
                spaceBetween={15}
                loop={true}
                autoplay={{
                    delay: 5000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
                    loopFillGroupWithBlank: false
                }}
                effect={"coverflow"}
                navigation={{
                    prevEl: ".custom_prev_n",
                    nextEl: ".custom_next_n",
                }}
                className="carausel-6-columns carausel-arrow-center"
            >

                {productImages && products.slice(-50).map((product, i) => (
                    <SwiperSlide key={i}>
                        <SingleProduct product={product} productImages={productImages} />
                    </SwiperSlide>
                ))}

            </Swiper>

            <div
                className="slider-arrow slider-arrow-2 carausel-6-columns-arrow"
                id="carausel-6-columns-2-arrows"
            >
                <span className="slider-btn slider-prev slick-arrow custom_prev_n">
                    <i className="fi-rs-angle-left"></i>
                </span>
                <span className="slider-btn slider-next slick-arrow custom_next_n">
                    <i className="fi-rs-angle-right"></i>
                </span>
            </div>
        </>
    );
};

export default NewArrival;
