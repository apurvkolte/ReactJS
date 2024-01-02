import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper';
import { displayMoney } from '../../helpers/utils';
import productsData from '../../data/productsData';
import { Buffer } from 'buffer';

import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';


const HeroSlider = (props) => {
    const products = props.products.slice(0, 6).map(item => item)
    const productImages = props.productImages.slice(0, 40).map(item => item)


    const tagline = ["Drink Pure Live Pure",
        "Flowing purity for your family",
        "Choose Quality in Purity in Every Drop",
        , "Purifying Agent", "Perfect Quality For perfect Living", "Building the Healthy Community"]

    const heroProducts = productsData.filter(item => item.tag === 'hero-product');

    return (
        <Swiper
            modules={[Pagination, A11y, Autoplay]}
            loop={true}
            speed={400}
            spaceBetween={100}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
        >
            {
                products && products.map((item, i) => {
                    const { id, name, sale_price, original_price } = item;
                    var imageName = productImages.filter((item) => item.product_id === id);
                    const EID = Buffer.from(`${id}`, 'binary').toString('base64')

                    const newPrice = displayMoney(sale_price);
                    const oldPrice = displayMoney(original_price);

                    return (
                        <SwiperSlide
                            key={id}
                            className={`wrapper hero_wrapper hero_slide-${i}`}
                        >
                            <div className="hero_item_txt">
                                <h3>{name}</h3>
                                <h1>{tagline[id]}</h1>
                                <h2 className="hero_price">
                                    {newPrice} &nbsp;
                                    <small><del>{oldPrice}</del></small>
                                </h2>
                                <Link href={`/product-details/${EID}?${encodeURIComponent(name)}`} className="btn btn-success">Shop Now</Link>
                            </div>
                            <figure className="hero_item_img">
                                <img src={`/uploads/product/${imageName && Object.keys(imageName).length != 0 ? imageName[0].imageName : ""}`} alt="product-img" />
                            </figure>
                        </SwiperSlide>
                    );
                })
            }
        </Swiper>
    );
};

export default HeroSlider;