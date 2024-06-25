import React from 'react';
import Link from 'next/link'
import { getDiscountUI } from '../../redux/actions/productActions'
import { Buffer } from 'buffer'

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
    <div className="card card1 p-3 rounded cart-bg">
      <div className="text-center">
        <Link href={`/product/${EID}?${encodeURIComponent(product.name)}`}>
          <img
            className="card-img-top mx-auto"
            alt={product.category}
            src={imageName}
            title={product.name}
            loading="lazy"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "/images/box.png";
            }}
          />
        </Link>
      </div>
      <div className="card-body d-flex flex-column">
        <span className="card-title">
          <Link href={`/product/${EID}?${encodeURIComponent(product.name)}`} title={product.name}>{String(product.name).slice(0, 48)}</Link>
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
          href={`/product/${EID}?${encodeURIComponent(product.name)}`}
          id="view_btn"
          className="btn btn-block"

        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RelatedItem;
