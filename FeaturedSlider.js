import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, A11y, Autoplay } from 'swiper';
import { displayMoney } from '../../helpers/utils';
import productsData from '../../data/productsData';
import { getDiscountUI } from '../../redux/actions/productActions'

import { Buffer } from 'buffer';

import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';
import "swiper/scss/effect-coverflow";
import { colors } from '@mui/material';


const FeaturedSlider = (props) => {
    const productsTop = props.productsTop;
    const productImages = props.productImages;
    const featuredProducts = productsData.filter(item => item.tag === 'featured-product');

    return (
        <Swiper
            modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
            loop={true}
            speed={400}
            spaceBetween={180}
            slidesPerView={"auto"}
            pagination={{ clickable: true }}
            effect={"coverflow"}
            centeredSlides={true}
            initialSlide="1"
            coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 70,
                modifier: 3,
                slideShadows: false,
            }}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            breakpoints={{
                768: {
                    slidesPerView: 2,
                    spaceBetween: 100
                },
                992: {
                    slidesPerView: 4,
                    spaceBetween: 150
                },
            }}
            className="featured_swiper"
        >
            {
                productsTop && productsTop.map((product) => {
                    // const { id, images, title, finalPrice, originalPrice, path } = item;
                    const newPrice = displayMoney(product.sale_price);
                    const oldPrice = displayMoney(Math.round(getDiscountUI(product.sale_price, product.discount)));
                    var check = productImages.filter(p => p.product_id === product.id);

                    const EID = Buffer.from(`${product.id}`, 'binary').toString('base64')

                    return (
                        <SwiperSlide key={product.id} className="featured_slides">
                            <p style={{ fontWeight: "500", colors: "black" }} >{product.name}</p>
                            <figure className="featured_img">
                                <Link href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>
                                    <img src={`/uploads/product/${check[0]?.imageName}`} alt="" />
                                </Link>
                            </figure>
                            <h2 className="products_price">
                                {newPrice} &nbsp;
                                {/* <small><del>{oldPrice}</del></small> <small className='text-success'>({product.discount}% Off )</small> */}
                                <small><del>{oldPrice}</del></small>
                            </h2>
                        </SwiperSlide>
                    );
                })
            }
        </Swiper>
    );
};

export default FeaturedSlider;