import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Navigation } from 'swiper';
import productsData from '../../data/productsData';
import ProductCard from '../product/ProductCard';

import 'swiper/scss';
import 'swiper/scss/pagination';

import "swiper/css/navigation";


const RelatedSlider = (props) => {
    const products = props.productsRelated;
    const productImages = props.RelatedProductImages;

    // console.log("products", products);
    // console.log("productImages", productImages);

    // const relatedProduct = productsData.filter(item => item.category === category);

    return (
        <Swiper
            modules={[Pagination, Navigation, A11y]}
            spaceBetween={10}
            slidesPerView={"auto"}
            pagination={{ clickable: true }}
            grabCursor={true}
            navigation={true}
            breakpoints={{
                480: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 4,
                },
            }}
            className="related_swiper"
        >
            {
                products && products.map(product => (
                    <SwiperSlide key={product.id}>
                        <ProductCard key={product.id} product={product} productImages={productImages} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default RelatedSlider;