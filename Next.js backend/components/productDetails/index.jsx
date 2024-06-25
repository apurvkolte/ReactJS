import React, { Fragment, memo, useEffect, Suspense, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdStar, IoMdCheckmark, IoMdCloseCircle, IoMdChatbubbles, IoIosCart } from 'react-icons/io';
import { calculateDiscount, displayMoney } from '../../helpers/utils';
import useDocTitle from '../../hooks/useDocTitle';
import useActive from '../../hooks/useActive';
import SectionsHead from '../../components/common/SectionsHead';
import Services from '../../components/common/Services';
import { getAllUserCoupons } from '../../redux/actions/orderActions'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getProductDetails, newReview, getProductReviews1, getDiscountUI } from "../../redux/actions/productActions";
import { newEnquiry } from "../../redux/actions/userActions";
import { removeBuyItem, addItemToCart, addBuyItem } from "../../redux/actions/cartActions";
// import { myOrders } from '../../redux/actions/orderActions';
import { NEW_REVIEW_RESET } from "../../redux/constants/productConstants";
import ReadMore from "../../components/product/ReadMore ";
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProductReviews from '../../components/product/ProductReviews';
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import 'react-toastify/dist/ReactToastify.css';
import Slider from "react-slick";
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
const LazyRelatedSlider = React.lazy(() => import('../../components/sliders/RelatedSlider'));


const index = () => {
    const router = useRouter()
    const id = router.query.id;
    const { data: session } = useSession();

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showAllReview, setShowAllReview] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();
    const { loading, error, product, relatedProduct, productProperties } = useSelector((state) => state.productDetails);
    const selecproductReviews = state => state.productReviews;
    const { reviews } = useSelector(selecproductReviews, shallowEqual);
    const MemoizedRelatedSlider = memo(LazyRelatedSlider);
    const productImages = product?.images ? JSON.parse(product.images) : [];
    const productDetails = product?.specifications ? JSON.parse(JSON.parse(product?.specifications)) : [];

    const { cartItems } = useSelector(state => state.cart);
    const { coupons } = useSelector(state => state.allUserCoupons);
    const { error: reviewError, success } = useSelector((state) => state.newReview);
    // const { productsRelated } = useSelector((state) => state.productsRelated);
    const { buyItem } = useSelector(state => state.buy);
    // const { orders } = useSelector(state => state.myOrders);
    const pCategory = product.category;
    var purchased = false
    useDocTitle('Product Details');


    const [name, setName] = useState();
    const [mobile, setMobile] = useState();
    const [email, setEmail] = useState();
    const [user_id, setUser_id] = useState(0);
    const [user_name, setUser_name] = useState(0);
    const [productName, setProductName] = useState("");
    const [message, setMessage] = useState();
    const [productQuantity, setProductQuantity] = useState();
    const [previewImg, setPreviewImg] = useState(productImages);


    const EID = Buffer.from(`${product.id}`, 'binary').toString('base64')
    // setting the very-first image on re-render
    useEffect(() => {
        if (productImages.length) {
            setPreviewImg(productImages[0]);
        }
        handleActive(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (!EID || EID !== id) {
            if (id) {
                dispatch(getProductDetails(id))
                dispatch(getProductReviews1(id))
            }
        }
        dispatch(getAllUserCoupons());

        // if (pCategory) {
        //     dispatch(getRelatedProducts(pCategory));
        // }
        if (error) {
            if (error === 'Product not found') {
                router.push('/404', { replace: true });
            } else {
                toast.error(error);
            }
        }
        if (reviewError) {
            toast.error(reviewError);
        }
        if (success) {
            toast.success("Review posted successfully");
            dispatch(getProductReviews1(id))
            dispatch({ type: NEW_REVIEW_RESET });
        }

        if (session?.user) {
            setUser_id(session.user.id)
            setName(session.user.name)
            setMobile(session.user.mobile)
            setUser_name(session.user.name)
            setEmail(session.user.email)
        }

        if (product) {
            setProductName(product?.name);
            setProductQuantity(quantity)
        }
        setComment("");
        setRating("");

        // const body = document.querySelector('#root');

        // body.scrollIntoView({
        //     behavior: 'smooth'
        // }, 500)
    }, [EID, error, id, reviewError, success, reviews]);


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { handleActive, activeClass } = useActive(0);

    // For hiding table in product details
    const [r, setR] = useState('r');
    const hide = () => {
        if (r === "r") {
            setR("p");
        } else {
            setR("r");
        }
    }


    // Function to filter unique values
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // Arrays to hold properties and values
    var arr = [];
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    var arrID = [];

    // Loop through productProperties to populate arrays
    if (productProperties) {
        productProperties.forEach((item) => {
            arr.push(item.properties1, item.properties2, item.properties3);
            arr1.push(item.value1);
            arr2.push(item.value2);
            arr3.push(item.value3);
            arrID.push(item.id);
        });
    }

    // Count occurrences of values in arr2
    const uniq = arr2.reduce((result, name) => {
        result[name] = (result[name] || 0) + 1;
        return result;
    }, {});


    //buy now buttion
    const addToBuy = () => {
        remove();
        dispatch(addBuyItem(id, quantity));
        // router.push('/shipping', { state: { prevPath: router.pathname } });
        router.push('/shipping');;
    }
    const enquiry = (id, productName, productQuantity) => {
        router.push('/shipping', { state: { id, productName, productQuantity } });;
    }

    const remove = () => {
        // localStorage.removeItem("buyItem");
        if (buyItem) {
            buyItem.map(item => (
                dispatch(removeBuyItem(item.product))))
        }
    }

    function stockZero() {
        if (product.stock === 0) {
            toast.error("Currently product out of stock")
        }
    }

    const increaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber >= 30) {
            toast.error("Maximum Orderable Quantity Should be 30")
        } else {
            if (count.valueAsNumber >= product.stock) {
                toast.error(`${product.name} available stock is ${product.stock}`);
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
    // handling Add-to-cart
    const handleAddItem = () => {
        addToCart(EID);
    };

    const addToCart = (id) => {
        const BID = Buffer.from(`${id}`, 'base64').toString('binary');
        if (cartItems.length < 10) {
            let count = 0;

            const check = cartItems.filter((item) => item.product === Number(BID));
            if (check.length) {
                count = check[0].quantity;
                if (check[0].quantity + quantity > check[0].stock) {
                    return toast.error("no stock available for this product");
                }
            }

            if (count) {
                toast.success("Item Added to Cart");
                dispatch(addItemToCart(id, (quantity + count)));
            } else {
                toast.success("Item Added to Cart");
                dispatch(addItemToCart(id, quantity));
            }

        } else {
            toast.success("Cart has touched the max limit. Please delete existing cart items to add a new item. ");
        }
    };

    //enquiry submit
    function submit(data, e) {
        handleClose();
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", name);
        formData.set("mobile", mobile);
        formData.set("email", email);
        formData.set("message", message);
        formData.set("product_id", product.id);
        formData.set("productName", productName);
        formData.set("productQuantity", productQuantity);
        formData.set("user_id", user_id);
        formData.set("user_name", user_name);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object

        dispatch(newEnquiry(json));
        reset();
        restefiled();
    }

    function restefiled() {
        toast.success("Request has been send successfully");
        setName("")
        setMobile()
        setEmail("")
        setMessage("")
    }


    // handling Preview image
    const handlePreviewImg = (i) => {
        setPreviewImg(productImages[i]);
        handleActive(i);
    };


    //review
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

        if (rating && comment.length !== 0) {
            const formData = new FormData();
            formData.set("rating", rating);
            formData.set("comment", comment);
            formData.set("productId", id);

            var object = {};
            formData.forEach((value, key) => object[key] = value);
            var json = object

            dispatch(newReview(json));
        } else {
            toast.error("Product Rating Stars & Comment Cannot Empty...!!!")
        }
    }


    function getUniqueValues(arr1, arr2, arr3, index) {
        switch (index) {
            case 0:
                return arr1.filter(onlyUnique);
            case 1:
                return arr2.filter(onlyUnique);
            case 2:
                return arr3.filter(onlyUnique);
            default:
                return [];
        }
    }


    // calculating Prices
    // const discountedPrice = originalPrice - finalPrice;
    // const newPrice = displayMoney(finalPrice);
    // const oldPrice = displayMoney(originalPrice);
    // const savedPrice = displayMoney(discountedPrice);
    // const savedDiscount = calculateDiscount(discountedPrice, originalPrice);
    const options = {
        arrowPrev: true,
        arrowNext: true,
        zoom: true,
        close: true,
        counter: true,
        // bgOpacity: 0.2,
        padding: { top: 20, bottom: 40, left: 100, right: 100 },
    }

    return (
        <Fragment>
            <div className='pd'>
                {Object.keys(product).length !== 0 &&
                    <Fragment>
                        <section id="product_details" className="section">
                            <div className="container py-2">
                                <div className="wrapper prod_details_wrapper">

                                    <div className="prod_details_left_col">
                                        <Gallery options={options}>
                                            <div className="prod_details_tabs">
                                                {
                                                    productImages.map((img, i) => (
                                                        <div
                                                            key={i}
                                                            className={`tabs_item bg-white ${activeClass(i)}`}
                                                            onMouseOver={() => handlePreviewImg(i)}
                                                        >

                                                            <Item
                                                                original={`/uploads/product/${img}`}
                                                                thumbnail={`/uploads/product/${img}`}
                                                                width="1280" height="1280"
                                                            >
                                                                {({ ref, open }) => (
                                                                    <img ref={ref} onClick={open} src={`/uploads/product/${img}`} loading="lazy" alt={product?.name} />
                                                                )}
                                                            </Item>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            <Item
                                                original={`/uploads/product/${previewImg}`}
                                                thumbnail={`/uploads/product/${previewImg}`}
                                                width="1280" height="1280"
                                            >
                                                {({ ref, open }) => (
                                                    <figure className="prod_details_img bg-white zoom" >
                                                        <img ref={ref} onClick={open} src={`/uploads/product/${previewImg}`} loading="lazy" alt={product?.name} />
                                                    </figure>
                                                )}
                                            </Item>

                                        </Gallery>

                                    </div>


                                    {/*=== Product Details Right-content ===*/}
                                    <div className="prod_details_right_col">
                                        <h1 className="prod_details_title" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}> {product.name} </h1>
                                        <h4 className="prod_details_info">{product.category}</h4>

                                        <div className="prod_details_ratings">
                                            <span className="rating_star">
                                                {
                                                    [...Array(product.ratings)].map((_, i) => <IoMdStar key={i} />)
                                                }
                                            </span>
                                            <span>|</span>
                                            <Link href="#"><>{product.numOfReviews} Ratings</></Link>
                                        </div>

                                        <div className="separator"></div>
                                        <div className="prod_details_price">
                                            <div className="price_box">
                                                <h2 className="price">
                                                    {displayMoney(product.sale_price)} &nbsp;
                                                    <small className="del_price"><del>{displayMoney(Math.round(getDiscountUI(product.sale_price, product.discount)))}</del></small>
                                                </h2>
                                                <p className="saved_price">You save: {displayMoney(Math.ceil(product.sale_price - getDiscountUI(product.sale_price, product.discount)))} ({product.discount}%)</p>
                                                <span className="tax_txt">(Inclusive of all taxes)</span>
                                            </div>


                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <a href="#" onClick={handleShow}>
                                                    <div style={{
                                                        marginRight: '10px',
                                                        padding: '5px 10px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        borderRadius: '5px',
                                                        fontSize: '14px',
                                                        lineHeight: '20px',
                                                        cursor: 'pointer' // Add pointer cursor for better UX
                                                    }}>
                                                        <IoMdChatbubbles style={{ marginRight: '5px' }} />Enquire Now
                                                    </div>
                                                </a>


                                                <Modal show={show} onHide={handleClose}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title><b>Bulk Order Inquiry Form</b></Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <form onSubmit={handleSubmit(submit)}>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label>Name :</label>
                                                                    <div className="form-group mb-3">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Your Name"
                                                                            required
                                                                            value={name}
                                                                            onChange={(e) => setName(e.target.value)}
                                                                            id="Name"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <label>Mobile No :</label>
                                                                    <div className="form-group mb-3">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Phone"
                                                                            required
                                                                            className={`form-control  ${errors.mobile && "invalid"}`}
                                                                            {...register("mobile", {
                                                                                pattern: {
                                                                                    value: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/g,
                                                                                    message: "Invalid Mobile Number",
                                                                                },
                                                                                maxLength: {
                                                                                    value: 15,
                                                                                    message: "Invalid Mobile Number",
                                                                                }
                                                                            })}
                                                                            onSubmit={() => {
                                                                                trigger("mobile");
                                                                            }}
                                                                            value={mobile}
                                                                            onChange={(e) => setMobile(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {errors.mobile && (
                                                                        <small className="text-danger">{errors.mobile.message}</small>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col">
                                                                    <label>Email Address :</label>
                                                                    <div className="form-group mb-3">
                                                                        <input
                                                                            type="email"
                                                                            placeholder="Email"
                                                                            required
                                                                            className={`form-control  ${errors.email_field && "invalid"}`}
                                                                            {...register("email", {
                                                                                pattern: {
                                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                                    message: "Invalid Email ID",
                                                                                }
                                                                            })}
                                                                            onKeyUp={() => {
                                                                                trigger("email");
                                                                            }}
                                                                            value={email}
                                                                            onChange={(e) => setEmail(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {errors.email && (
                                                                        <small className="text-danger">{errors.email.message}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col">
                                                                    <label>Product Quantity :</label>
                                                                    <div className="form-group mb-3">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Enter quantity"
                                                                            min={0}
                                                                            required
                                                                            className="form-control"
                                                                            value={productQuantity}
                                                                            onChange={(e) => setProductQuantity(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <label>Product Name :</label>
                                                            <div className="form-group mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Product Name"
                                                                    required
                                                                    value={productName}
                                                                    onChange={(e) => setProductName(e.target.value)} id="Name"
                                                                />
                                                            </div>

                                                            <label>Your Message :</label>
                                                            <div className="form-group mb-3">
                                                                <textarea
                                                                    id="form_message"
                                                                    name="form_message"
                                                                    rows="5"
                                                                    placeholder="Your Message"
                                                                    className="form-control "
                                                                    value={message}
                                                                    onChange={(e) => setMessage(e.target.value)}
                                                                ></textarea>
                                                            </div>

                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleClose}>
                                                                    Close
                                                                </Button>
                                                                <Button type="submit" variant="primary">
                                                                    Send
                                                                </Button>
                                                            </Modal.Footer>
                                                        </form>
                                                    </Modal.Body>
                                                </Modal>
                                                {product.stock === 0 ? (
                                                    <div style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        borderRadius: '5px',
                                                        fontSize: '14px',
                                                        lineHeight: '20px'
                                                    }}>
                                                        <span><IoMdCloseCircle /> Out Of Stock</span>
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: 'green',
                                                        color: 'white',
                                                        borderRadius: '5px',
                                                        fontSize: '14px',
                                                        lineHeight: '20px'
                                                    }}>
                                                        <span><IoMdCheckmark /> In Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="separator1"></div>
                                        <h5 style={{ color: '#333', fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px' }}>Select Quantity</h5>
                                        <div className="stockCounter d-inline">
                                            <span className="btn minus-btn" onClick={decreaseQty}>
                                                <i class="fa fa-minus" aria-hidden="true"></i>
                                            </span>
                                            <input
                                                type="number"
                                                className="form-control count d-inline"
                                                value={quantity}
                                                readOnly
                                            />
                                            <span className="btn plus-btn" onClick={increaseQty}>
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                            </span>
                                            <span>
                                                {product.stock < 6 && product.stock > 0 ? (
                                                    <span className="inline-block ml-13">
                                                        <div className="text-danger d-inline  ml-4">Hurry Up, Only {product.stock} left</div>
                                                    </span>
                                                ) : ("")}
                                            </span>
                                        </div>

                                        <div className="separator1"></div><br />
                                        <div className="prod_details_buy_btn">

                                            <div className='row'>
                                                <div className="col-6 col-sm-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={handleAddItem}
                                                        disabled={product.stock === 0}
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                                <div className="col-6 col-sm-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={addToBuy}
                                                        disabled={product.stock === 0}
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>



                                        </div>
                                        <br />
                                        <br />
                                        <div className="prod_details_buy_btn">
                                            {product.product_code && (
                                                <div className="row">
                                                    {arr.map((propertyName, index) => {
                                                        if (propertyName) {
                                                            return (
                                                                <div key={index}>
                                                                    <h5 className="ml-3">Select {propertyName}</h5><br />
                                                                    <ul id="menu">
                                                                        <div className="selected">
                                                                            {getUniqueValues(arr1, arr2, arr3, index).map((value, i) => (
                                                                                <Link key={i} href={`/product-details/${Buffer.from(`${arrID[i]}`, 'binary').toString('base64')}`}>
                                                                                    <li className={`${product[`value${index + 1}`] === value ? 'list-active' : ''}`}>{value}</li>
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    </ul><br /><br />
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {product.description &&
                                            <div className="prod_overview ">
                                                <h4 style={{ color: '#333', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Product Description</h4>
                                                <ul className='par desc-bg'>
                                                    <ReadMore text={(String(product.description))} />
                                                </ul>
                                            </div>
                                        }


                                        {productDetails.length > 0 && (
                                            <>
                                                <div className="prod_specs">
                                                    <h4 style={{ color: '#333', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Product Specification</h4>
                                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                        {productDetails.map((field, i) => (
                                                            <li key={i} style={{ marginBottom: '10px' }} className={`${r}${i + 1}`} id={i + 1}>
                                                                <span style={{ marginRight: '10px', color: '#6c757d' }}>{field.title}</span>
                                                                <span>{field.description}</span>
                                                            </li>
                                                        ))}
                                                        {productDetails.length > 7 && (
                                                            <li>
                                                                <a onClick={hide} style={{ cursor: 'pointer', color: '#6c757d' }}>
                                                                    {r === "r" ? (
                                                                        <div style={{ display: 'inline' }}><small>Show More </small><b>&#8743;</b></div>
                                                                    ) : (
                                                                        <div style={{ display: 'inline' }}><small>Hide </small><b>&#8744;</b></div>
                                                                    )}
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>

                                                </div>
                                            </>
                                        )}

                                        <div className="separator1"></div>
                                        <div className="prod_details_offers">
                                            {coupons && coupons.length ? (<h4 style={{ color: '#333', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Offers and Discounts</h4>) : ""}
                                            <ul>
                                                {coupons && coupons.length ? (
                                                    coupons.map((coupon) => {
                                                        const currentTime = new Date().getTime();
                                                        const couponLastDate = new Date(coupon.lastDate).getTime();

                                                        if (currentTime < couponLastDate) {
                                                            return (
                                                                <li key={coupon.id}>
                                                                    Apply coupon "{coupon.coupon_code}" to Get Rs. {coupon.cashback} on Rs. {coupon.minValue} minimum order product
                                                                </li>
                                                            );
                                                        } else {
                                                            return null; // Return null for expired coupons to avoid rendering
                                                        }
                                                    })
                                                ) : (
                                                    <li>Currently no offers available</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="separator1"></div>
                                        <div className="py-3">
                                            <h4 style={{ color: '#333', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Review</h4>
                                            {session?.user ? (
                                                1 === 1 ? (
                                                    <div className="modal-body ">
                                                        <div className='row'>

                                                            <ul className="stars" onMouseOver={setUserRatings}>
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

                                                            <ul className="stars">
                                                                <li >
                                                                    <textarea
                                                                        name="review"
                                                                        id="review"
                                                                        className="form-control textAeraBorder"
                                                                        value={comment}
                                                                        rows="2"
                                                                        cols="45"
                                                                        placeholder='Write a review...'
                                                                        onChange={(e) => setComment(e.target.value)}
                                                                    ></textarea>
                                                                </li>
                                                                <li >
                                                                    <button
                                                                        style={{
                                                                            backgroundColor: '#007bff',
                                                                            color: 'white',
                                                                            padding: '0',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            fontSize: '16px',
                                                                            fontWeight: 'bold',
                                                                            height: '40px',
                                                                            width: '150px',
                                                                            display: 'inline-block',
                                                                            textAlign: 'center',
                                                                            lineHeight: '40px',
                                                                            textDecoration: 'none'
                                                                        }}
                                                                        onClick={reviewHandler}
                                                                    >
                                                                        Submit Review
                                                                    </button>

                                                                </li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="alert alert-warning mt-5" type="alert">
                                                        Haven't purchased this product?<br />
                                                        Sorry! You are not allowed to review this product since you haven't bought it on SGSRO .
                                                    </div>
                                                )
                                            ) : (
                                                <div className="alert alert-danger mt-5" type="alert">
                                                    Login to post your review.
                                                </div>
                                            )}

                                            <ul>
                                                {reviews && reviews.slice(0, showAllReview ? reviews.length : 5).map(review => (
                                                    <div className='mt-3' key={review.id}>
                                                        <ProductReviews reviews={review} />
                                                    </div>
                                                ))}
                                                {reviews && reviews.length > 5 && !showAllReview && (
                                                    <button className='text-white p-3 bg-success ' onClick={() => setShowAllReview(true)}>Show More</button>
                                                )}
                                            </ul>

                                        </div>


                                    </div>

                                </div>
                            </div>
                        </section>




                        <section id="related_products" className="section">
                            <div className="container">
                                <SectionsHead heading="Related Products" />
                                <Suspense fallback={<div>Loading...</div>}>
                                    <MemoizedRelatedSlider productsRelated={relatedProduct} />
                                </Suspense>
                            </div>
                        </section>

                        <Services />
                        <ToastContainer />
                    </Fragment>
                }
            </div>
        </Fragment >
    )
}

export default index