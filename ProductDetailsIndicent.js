import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import ListReviews from "../review/ListReviews";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  newReview,
  getRelatedProducts,
  getProductReviews1
} from "../../actions/productActions";
import { addItemToCart, addBuyItem } from "../../actions/cartActions";
import { myOrders } from '../../actions/orderActions'
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import ReadMore from "./ReadMore ";
import RelatedItem from "./RelatedItem";
import "react-medium-image-zoom/dist/styles.css";
import Slider from "react-slick";
import { removeBuyItem } from '../../actions/cartActions'
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import ReactImageMagnify from 'react-image-magnify';
import { getDiscountUI } from '../../actions/productActions'
import { isMobile } from 'react-device-detect';


const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  // navigate('/home',{replace:true});
  // navigate(-1/1/-2);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [img, setImg] = useState([]);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, product, productImages, RelatedProductImages, productDetails, productProperties } = useSelector((state) => state.productDetails);
  const { reviews } = useSelector(state => state.productReviews);
  const { cartItems } = useSelector(state => state.cart);

  const { user } = useSelector((state) => state.auth);
  const { error: reviewError, success } = useSelector((state) => state.newReview);
  const { productsRelated } = useSelector((state) => state.productsRelated);
  const { buyItem } = useSelector(state => state.buy);
  const { orders } = useSelector(state => state.myOrders);
  const pCategory = product.category;
  const images = JSON.parse(JSON.stringify(productImages))
  var purchased = false

  // console.log("pCategory", history);
  // console.log("productsRelated", productsRelated);
  // console.log("productImages", productImages);
  // console.log("RelatedProductImages", RelatedProductImages);
  // console.log("params.id", params.id);

  if (orders) {
    orders.map((order) => {
      if (Buffer.from(order.product_id.toString(), 'binary').toString('base64') === params.id) {
        purchased = true;
      }
    })
  }


  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  var arr = [];
  if (productProperties) {
    productProperties.map((item) => {
      arr.push(item.properties1)
      arr.push(item.properties2)
      arr.push(item.properties3)
    })
  }
  // console.log("arr", arr);

  var arr1 = [];
  if (productProperties) {
    productProperties.map((item) => {
      arr1.push(item.value1)
    })
  }
  // console.log("arr1", arr1);

  var arr2 = [];
  if (productProperties) {
    productProperties.map((item) => {
      arr2.push(item.value2)
    })
  }
  // console.log("arr2", arr2);

  var arr3 = [];
  if (productProperties) {
    productProperties.map((item) => {
      arr3.push(item.value3)
    })
  }

  // console.log("arr3", arr2.filter(onlyUnique));

  var arrID = [];
  if (productProperties) {
    productProperties.map((item) => {
      arrID.push(item.id)
    })
  }
  // console.log("arrID", arrID);


  //find duplicate value in array
  const uniq = arr2
    .map((name) => {
      return {
        count: 1,
        name: name
      };
    })
    .reduce((result, b) => {
      result[b.name] = (result[b.name] || 0) + b.count;

      return result;
    }, {});

  // const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
  // console.log(duplicates[0]);
  // || (duplicates[0] === arr2[i]) 

  // For hiding table in product details
  const [r, setR] = useState('r');
  const hide = () => {
    if (r === "r") {
      setR("p");
    } else {
      setR("r");
    }
  }

  //image zoom
  const hoverHandler = (image, i) => {
    setImg(image);
    refs.current[i] && refs.current[i].classList.add('activeimg');
    for (var j = 0; j < images.length; j++) {
      if (i !== j) {
        refs.current[j] && refs.current[j].classList.remove('activeimg');
      }
    }
  };
  const refs = useRef([]);
  refs.current = [];
  const addRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };
  const ref = useRef(null);

  // const table = document.getElementById('#1');
  // document.querySelectorAll("#Table_id tr").style.display = 'none';
  // console.log("ddfwef", document.getElementById('#1'));
  // console.log("ddfwef", document.querySelectorAll("#Table_id tr").length);
  // console.log("ddfwef", document.getElementById('#1'));

  const EID = Buffer.from(`${product.id}`, 'binary').toString('base64')

  useEffect(() => {

    if (!EID || EID !== params.id) {
      dispatch(getProductDetails(params.id))
      dispatch(getProductReviews1(params.id))
    }
    if (images.length !== 0) {
      setImg([images[0].imageName]);
    }
    if (pCategory) {
      dispatch(getRelatedProducts(pCategory));
    }
    if (error) {
      if (error === 'Product not found') {
        navigate('/404', { replace: true });
      } else {
        alert.error(error);
      }
    }
    if (reviewError) {
      alert.error(reviewError);
    }
    if (success) {
      alert.success("Review posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(myOrders());

    const body = document.querySelector('#root');

    body.scrollIntoView({
      behavior: 'smooth'
    }, 500)

  }, [
    dispatch,
    pCategory,
    EID,
    alert,
    error,
    reviewError,
    params.id,
    success
  ]);

  const addToCart = () => {
    const paramID = Buffer.from(params.id.toString(), 'base64').toString('binary')
    if (cartItems.length < 10) {
      let count = 0;
      cartItems.map((item) => {
        if (Number(paramID) === item.product) {
          count = item.quantity;
        }
      });

      if (count) {
        dispatch(addItemToCart(params.id, (quantity + count)));
        alert.success("Item Added to Cart");
      } else {
        dispatch(addItemToCart(params.id, quantity));
        alert.success("Item Added to Cart");
      }

    } else {
      alert.success("Cart has touched the max limit. Please delete existing cart items to add a new item. ");
    }
  };

  const addToBuy = () => {
    remove();
    dispatch(addBuyItem(params.id, quantity));
    navigate('/shipping', { state: { prevPath: location.pathname } });
  }

  const remove = () => {
    // localStorage.removeItem("buyItem");
    if (buyItem) {
      buyItem.map(item => (
        dispatch(removeBuyItem(item.product))))
    }
  }
  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= 30) {
      alert.error("Maximum Orderable Quantity Should be 30")
    } else {
      if (count.valueAsNumber >= product.stock) {
        alert.error(`${product.name} available stock is ${product.stock}`);
        return;
      };
      const qty = count.valueAsNumber + 1;
      setQuantity(qty);

    }
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  function setUserRatings() {
    const stars = document.querySelectorAll(".star");
    stars && stars.forEach((star, index) => {
      star.starValue = index + 1;

      ["click", "mouseover", "mouseout"].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, index) => {
        if (e.type === "click") {
          if (index < this.starValue) {
            star.classList.add("orange");
            setRating(this.starValue);
          } else {
            star.classList.remove("orange");
          }
        }
        if (e.type === "mouseover") {
          if (index < this.starValue) {
            star.classList.add("yellow");
          } else {
            star.classList.remove("yellow");
          }
        }
        if (e.type === "mouseout") {
          star.classList.remove("yellow");
        }
      });
    }
  }
  const reviewHandler = () => {
    // console.log("rating", rating);
    // console.log("rating", comment.length);
    // console.log("rating", !rating && comment.length > 0);

    if (rating && comment.length !== 0) {
      const formData = new FormData();
      formData.set("rating", rating);
      formData.set("comment", comment);
      formData.set("productId", params.id);

      var object = {};
      formData.forEach((value, key) => object[key] = value);
      var json = object

      dispatch(newReview(json));
    } else {
      window.alert("Product Rating & Comment Cannot Empty...!!!")
    }
  }
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
  const currentURL = window.location.href;

  // var ImageUrl;
  // if (productImages) {
  //   productImages.map((productImage) => {
  //     if (EID === productImage.productid)
  //       ImageUrl = productImage.url;
  //     // console.log("productImage...", ImageUrl);
  //   })
  // }

  function stockZero() {
    if (product.stock === 0) {
      alert.error("Currently product out of stock")
    }
  }

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="container-fluid">

            <div className="container-fluid">
              <div className="row d-flex justify-content-around">
                <div className="col-sm-12 col-lg-5 img-fluid" id="product_image">
                  <div className="containerZoom">
                    <div className="leftZoom">
                      <div className="left_1Zoom">
                        {images && images.map((image, i) => (
                          <div
                            className={i === 0 ? 'img_wrapZoom activeimg' : 'img_wrapZoom'}
                            key={i}
                            id='classList'
                            onMouseOver={() => hoverHandler(image.imageName, i)}
                            ref={addRefs}
                          >
                            <img src={image.imageName} alt="" onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = "/images/box.png";
                            }} />
                          </div>
                        ))}
                      </div>
                      <div className="left_2Zoom ">
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: img.toString(),
                              src: img.toString(),
                              width: 450,
                              height: isMobile ? 200 : 400,
                              sizes: "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px"
                            },
                            largeImage: {
                              src: img.toString(),
                              isFluidWidth: true,
                              width: 1200,
                              height: 1180
                            },
                            enlargedImageContainerDimensions: {
                              width: '162%',
                              height: '120%'
                            },
                            enlargedImageContainerStyle: { background: '#fff', zIndex: 9 }
                          }}
                        />
                      </div>
                    </div>
                    <div className="right"></div>
                  </div>
                </div>

                <div className="col-sm-12 col-lg-6 mt-4">
                  <div className="social text-muted">
                    Share On&nbsp;

                    <FacebookShareButton
                      url={currentURL}
                      quote={"フェイスブックはタイトルが付けれるようです"}
                      hashtag={"#hashtag"}
                      description={"aiueo"}
                      className="Demo__some-network__share-button"
                    >
                      <FacebookIcon size={24} round />
                      &nbsp;
                    </FacebookShareButton>

                    <WhatsappShareButton
                      url={currentURL}
                      quote={"フェイスブックはタイトルが付けれるようです"}
                      hashtag={"#hashtag"}
                      description={"aiueo"}
                      className="Demo__some-network__share-button"
                    >
                      <WhatsappIcon size={24} round />
                      &nbsp;
                    </WhatsappShareButton>
                    <EmailShareButton
                      url={currentURL}
                      quote={"フェイスブックはタイトルが付けれるようです"}
                      hashtag={"#hashtag"}
                      description={"aiueo"}
                      className="Demo__some-network__share-button"
                    >
                      <EmailIcon size={24} round />
                      &nbsp;
                    </EmailShareButton>

                  </div>
                  <br />
                  <h4>{product.name}</h4>
                  <hr />
                  <p>
                    {" "}
                    <span className="sale_price" id="product_price">
                      &#8377;{Math.round((product.sale_price)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}{" "}
                    </span>
                    <span>
                      {product.discount > 0 ? (
                        <span className="text-secondary discount-label">
                          /-<del>&#8377;{getDiscountUI(product.sale_price, product.discount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</del>
                          <span className="text-success">
                            {" "}
                            {product.discount}% off
                          </span>
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </p>
                  <div className="stockCounter d-inline">
                    <span className="btn minus-btn" onClick={decreaseQty}>
                      -
                    </span>
                    <input
                      type="number"
                      className="form-control count d-inline"
                      value={quantity}
                      readOnly
                    />
                    <span className="btn plus-btn" onClick={increaseQty}>
                      +
                    </span>
                    <span>

                      {product.stock < 6 && product.stock > 0 ? (
                        <span className="inline-block mr-3">
                          <div className="text-danger d-inline  ml-4">Hurry, Only {product.stock} left</div>
                        </span>
                      ) : ("")}

                    </span>
                  </div>

                  <div className="row">
                    <button
                      type="button"
                      id="cart_btn"
                      className="btn btn-primary d-inline ml-3 mt-4"
                      disabled={product.stock === 0}
                      onClick={addToCart}
                    >
                      <span onClick={stockZero}>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      id="cart_btn"
                      className="btn btn-primary d-inline ml-3 mt-4"
                      disabled={product.stock === 0}
                      onClick={addToBuy}
                    >
                      <span onClick={stockZero}> Buy Now </span>
                    </button>
                  </div>

                  {product.product_code ? (
                    <div className="row">
                      <hr />
                      {
                        arr[0] &&
                        <div>
                          <h5 className="ml-3">Select {arr[0]}</h5>
                          <ul id="menu">
                            <div className="selected">
                              {arr1.filter(onlyUnique).map((ele, i = 0) => (
                                (arr1[i] && (<Link to={`/product/${Buffer.from(`${arrID[i]}`, 'binary').toString('base64')}`}>
                                  <li className={`${product.value1 === arr1[i] ? 'list-active' : ""}`}>{arr1[i++]}</li></Link>))
                              ))}
                            </div>
                          </ul><br /><br />
                        </div>
                      }

                      {
                        arr[1] &&
                        <div>
                          <h5 className="ml-3">Select {arr[1]}</h5>
                          <ul id="menu">
                            <div className="selected">
                              {arr2.filter(onlyUnique).map((ele, i = 0) => (
                                (arr2[i] && (<Link to={`/product/${Buffer.from(`${arrID[i]}`, 'binary').toString('base64')}`}>
                                  <li className={`${product.value2 === arr2[i] ? 'list-active' : ""}`}>{arr2[i++]}</li></Link>))
                              ))}
                            </div>
                          </ul><br /><br />
                        </div>
                      }

                      {
                        arr[2] &&
                        <div>
                          <h5 className="ml-3">Select {arr[2]}</h5>
                          <ul id="menu">
                            <div className="selected">
                              {arr3.filter(onlyUnique).map((ele, i = 0) => (
                                (arr3[i] && (<Link to={`/product/${Buffer.from(`${arrID[i]}`, 'binary').toString('base64')}`}>
                                  <li className={`${product.value3 === arr3[i] ? 'list-active' : ""}`}>{arr3[i++]}</li></Link>))
                              ))}
                            </div>
                          </ul>
                        </div>
                      }
                    </div>
                  ) : ("")}

                  <div>
                    <hr />
                    <ul className="list-unstyled list-group list-group-horizontal py-2">
                      <li className="inline-block mr-3">
                        Status:{" "}
                        <span
                          id="stock_status"
                          className={product.stock > 0 ? "greenColor" : "redColor"}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>

                      </li>
                      <li>
                        <Link to='/enquiry1' state={{ productName: product.name, quantity: quantity }} className="text-dark btn btn-light btn-bulk d-inline ml-4">Bulk Order</Link>
                      </li>
                    </ul>

                  </div>

                  {product.description ? (<div><hr /><h5 className="prod-heading mt-2">Key Features </h5>
                    <span>
                      <ReadMore text={(String(product.description))} />
                    </span>
                    <hr />
                  </div>) : ("")}

                  <div className="rating-outer">
                    <div
                      className="rating-inner"
                      style={{ width: `${(product.ratings / 5) * 100}%` }}
                    ></div>
                  </div>
                  <Link to="#" onClick={handleClick} id="no_of_reviews">({product.numOfReviews} Reviews)</Link>
                  <hr />

                  {product.seller ? (<p id="product_seller mb-3">
                    Sold by: <strong>{product.seller}</strong>
                  </p>) : ("")}
                  <br />
                  <div className="row mt-2 mb-5">
                    {productDetails.length ? (
                      <table className="table table-bordered " id="Table_id">
                        <thead>
                          <tr>
                            <th scope="col" colSpan="2"> <h5 className="prod-heading">Product Specification </h5></th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetails.length &&
                            productDetails.map((field, i) => (
                              <tr className={`${r}${i + 1}`} id={i + 1}>
                                <td className="text-muted">{field.title}</td>
                                <td >{field.description}</td>
                              </tr>
                            ))}
                          <tr>
                            <td colSpan="2" className="pt-2 pb-2" align="left"><a onClick={hide} className="text-muted">
                              {r === "r" ? (<div><small>SHOW MORE </small><b >&#8743;</b></div>) : (<div><small>SHOW LESS </small><b >&#8744;</b></div>)}</a></td>
                          </tr>
                        </tbody>
                      </table>
                    ) : ("")}
                  </div>
                  {/* {productDetails.length && (<CustomPaginationActionsTable productDetails={productDetails} />)} */}
                  <div><h5 className="prod-heading mt-2">Reviews </h5><hr />
                    {user ? (
                      purchased === true ? (<button
                        id="review_btn"
                        type="button"
                        className="glow-on-hover btn btn-primary"
                        data-toggle="modal"
                        data-target="#ratingModal"
                        onClick={setUserRatings}
                      >
                        Submit Your Review
                      </button>) : (
                        <div className="alert alert-warning mt-5" type="alert">
                          Haven't purchased this product?<br />
                          Sorry! You are not allowed to review this product since you haven't bought it on Industry Central.
                        </div>
                      )

                    ) : (
                      <div className="alert alert-danger mt-5" type="alert">
                        Login to post your review.
                      </div>
                    )}
                  </div>


                  <div className="row">
                    <div className="rating w-50">
                      <div
                        className="modal fade"
                        id="ratingModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="ratingModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="ratingModalLabel">
                                Submit Review
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                data-close
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <ul className="stars">
                                <li className="star">
                                  <i className="fa fa-star"></i>
                                </li>
                                <li className="star">
                                  <i className="fa fa-star"></i>
                                </li>
                                <li className="star">
                                  <i className="fa fa-star"></i>
                                </li>
                                <li className="star">
                                  <i className="fa fa-star"></i>
                                </li>
                                <li className="star">
                                  <i className="fa fa-star"></i>
                                </li>
                              </ul>
                              <textarea
                                name="review"
                                id="review"
                                className="form-control mt-3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              ></textarea>
                              <button
                                className="btn my-3 float-right review-btn px-4 text-white"
                                onClick={reviewHandler}
                                data-dismiss="modal"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div ref={ref}>
                {reviews && reviews.length > 0 && (
                  <ListReviews reviews={reviews} />
                )}
              </div>
              <div className="m-3 position-relative">
                <h3 className="text-muted">Similar products</h3>
                <hr />
                {Object.keys(product).length === 0 ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <Slider {...settings}>
                    {productsRelated &&
                      productsRelated.map((prod) => (
                        prod.id === EID ? ("") : (< RelatedItem key={prod.id} product={prod} RelatedProductImages={RelatedProductImages} />)

                      ))}
                  </Slider>
                )}
                <hr />
              </div>
            </div>
          </div>
          {/* {(products && products.map(product => (
                  <RelatedItem key={EID} product={product}  />
                )))} */}

          {/* {(productsRelated && productsRelated.map(rProduct => (
                  <RelatedItem key={rEID} rProduct={rProduct}  />
                )))} */}

          {/* {(productsRelated && <RelatedItem key={productsRelated.id} productsRelated={productsRelated}  />)} */}

          {/* <RelatedItem key={EID} product={product} /> */}
        </Fragment >
      )
      }
    </Fragment >
  );
};

export default ProductDetails;
