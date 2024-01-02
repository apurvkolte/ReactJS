import Slider from "react-slick";
//https://react-multi-carousel.surge.sh/?selectedKind=Carousel&selectedStory=With%20dots%20rendered%20outside%20of%2Fafter%20list%20container%20within%20custom%20div%20for%20styling&full=0&addons=1&stories=1&panelRight=0&addonPanel=kadira%2Fjsx%2Fpanel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


let settings = {
    infinite: false,
    speed: 1000,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 4,
    responsive: [
        {
            breakpoint: 960,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 2,
            },
        },
    ],
};

<Slider {...settings}>
    {productsRelated &&
        productsRelated.map((prod) => (
            prod.id === EID ? ("") : (< RelatedItem key={prod.id} product={prod} RelatedProductImages={RelatedProductImages} />)

        ))}
</Slider>






//related item

import React from 'react';
import "../../App.css";
import { Link } from "react-router-dom";
import { getDiscountUI } from '../../actions/productActions'

const RelatedItem = ({ product, RelatedProductImages }) => {
    // console.log("product", product);
    // console.log("RelatedProductImages", RelatedProductImages);
    const EID = Buffer.from(`${product.id}`, 'binary').toString('base64')
    var imageName;
    if (RelatedProductImages) {
        RelatedProductImages.map((pimg) => {
            if (pimg.product_id === product.id) {
                imageName = pimg.imageName;
                // console.log("imageName", imageName);
            }
            return imageName;
        })
    }
    return (
        <div className="">
            <div className="card card1 p-3 rounded cart-bg">
                <div className="text-center">
                    <Link to={`/product/${EID}?${encodeURIComponent(product.name)}`}>
                        <img
                            className="card-img-top mx-auto"
                            alt={product.category}
                            src={imageName}
                            title={product.name}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "/images/box.png";
                            }}
                        />
                    </Link>
                </div>
                <div className="card-body d-flex flex-column">
                    <span className="card-title">
                        <Link to={`/product/${EID}?${encodeURIComponent(product.name)}`} title={product.name}>{String(product.name).slice(0, 48)}</Link>
                    </span>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div
                                className="rating-inner"
                                style={{ width: `${(product.ratings / 5) * 100}%` }}
                            ></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    </div>
                    <p></p>
                    <p>
                        <span className="card-text">
                            &#8377;{Math.round(product.sale_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}{" "}
                        </span>
                        {product.discount > 0 ? (
                            <sub className="text-secondary discount-label">/-<del>&#8377;{Math.round(getDiscountUI(product.sale_price, product.discount)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</del>,
                                <span className="text-success"> {product.discount}% off</span>
                            </sub>
                        ) : (
                            ""
                        )}
                    </p>

                    <Link
                        to={`/product/${EID}?${encodeURIComponent(product.name)}`}
                        id="view_btn"
                        className="btn btn-block"

                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RelatedItem;
