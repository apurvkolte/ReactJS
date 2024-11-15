// react
import { Fragment, useEffect, useState, useMemo } from 'react';

// third-party
import classNames from 'classnames';
import Link from 'next/link';
// application
import AppLink from './AppLink';
import AsyncAction from './AsyncAction';
import Compare16Svg from '../../svg/compare-16.svg';
import CurrencyFormat from './CurrencyFormat';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import Rating from './Rating';
import Wishlist16Svg from '../../svg/wishlist-16.svg';
import { IProduct } from '../../interfaces/product';
import { useCompareAddItem } from '../../store/compare/compareHooks';
import { useWishlistAddItem } from '../../store/wishlist/wishlistHooks';
import { useCartAddItem } from '../../store/cart/cartHooks';
import ReadMore from "../admin/ReadMore ";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSession } from "next-auth/react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { NEW_ENQUIRY_RESET } from '../../store/constants/userConstants';
import { getProductDetails1 } from "../../store/action/productActions";
import { FaCartPlus, FaTimesCircle } from 'react-icons/fa';
import { addItemToCart, addBuyItem } from "../../store/action/cartActions";
import { removeBuyItem } from '../../store/action/cartActions'
import { toast } from "react-toastify";
import { newEnquiry, clearErrors } from "../../store/action/userActions";
import { useRouter } from 'next/router';
import { parse } from 'path';

export type ProductLayout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

export interface ProductProps {
    layout: ProductLayout;
    product1?: any;
}

function Product(props: ProductProps) {
    const { product1, layout } = props;

    const { loading, error, product: reduxProduct, relatedProduct, productProperties } = useSelector((state: RootStateOrAny) => state.productDetails);

    const product = product1 || reduxProduct;
    const currentUrl = window.location.href;

    const productImages = product?.images ? JSON.parse(product.images) : [];
    // const productDetails = product?.specifications ? JSON.parse(JSON.parse(product?.specifications)) : [];
    let productVariations = product?.variations ? JSON.parse(JSON.parse(product?.variations)) : [];

    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);



    const [r, setR] = useState('r');
    const hide = () => {
        setR(prevState => (prevState === "r" ? "p" : "r"));
    };

    const [quantity, setQuantity] = useState(0);
    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const id = router.query.id;

    const [user_id, setUser_id] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [user_name, setUser_name] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [productQuantity, setProductQuantity] = useState<number | string>(1);
    const cartAddItem = useCartAddItem();
    const wishlistAddItem = useWishlistAddItem();
    const compareAddItem = useCompareAddItem();
    const { success } = useSelector((state: RootStateOrAny) => state.enquiry);
    const { cartItems } = useSelector((state: RootStateOrAny) => state.cart);
    const { buyItem } = useSelector((state: RootStateOrAny) => state.buy);

    const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const ProductId = Buffer.from(`${product?.id}`, 'binary').toString('base64');



    useEffect(() => {
        if (product.bulk_qty) {
            setQuantity(product.bulk_qty);
        }
        if (success) {
            toast.success("Request has been send successfully");
            dispatch({ type: NEW_ENQUIRY_RESET })
            dispatch(clearErrors());
        }

        if (session?.user) {
            const user = session.user as { id: string; name?: string; mobile?: string; email?: string; };

            setUser_id(user.id);
            setName(user.name || '');
            setMobile(user.mobile || '');
            setUser_name(user.name || '');
            setEmail(user.email || '');
        }

        if (product) {
            setProductName(product?.name);
            setProductQuantity(Number(quantity));
        }

    }, [dispatch, success, session, product, reduxProduct, product.bulk_qty, productName, ProductId]);



    // Function to extract unique values for each column
    const getUniqueValuesForColumn = (index: number) => {
        return Array.from(
            new Set<string>(
                productVariations.slice(1)
                    .filter(row => row.columns && row.columns.split(',').length > index) // Filter out rows without enough columns
                    .map(row => row.columns.split(',')[index]?.trim()) // Use optional chaining to handle undefined cases
            )
        );
    };


    // Columns (header row) array
    const columns = productVariations[0]?.columns.split(',');

    // Initialize state for checkboxes, one for each column
    const uniqueValuesByColumn = useMemo(() => {
        return columns?.map((_, index) => getUniqueValuesForColumn(index));
    }, [productVariations]);

    // Handle checkbox changes
    const handleCheckboxChange = (columnIndex, value) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            if (!newFilters[columnIndex]) {
                newFilters[columnIndex] = [];
            }

            // Add or remove value from the selected filters
            if (newFilters[columnIndex].includes(value)) {
                newFilters[columnIndex] = newFilters[columnIndex].filter((v) => v !== value);
            } else {
                newFilters[columnIndex].push(value);
            }

            return newFilters;
        });
    };

    const resetFilters = () => {
        setSelectedFilters({});
    };

    const removeFilter = (columnIndex, value) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };
            newFilters[columnIndex] = newFilters[columnIndex].filter((v) => v !== value);
            if (newFilters[columnIndex].length === 0) {
                delete newFilters[columnIndex];
            }
            return newFilters;
        });
    };

    const filteredVariations = useMemo(() => {
        return productVariations.slice(1).filter((row) => {
            const rowValues = row.columns.split(',').map((value) => value.trim());
            return columns.every((_, index) => {
                const filterValues = selectedFilters[index] || [];
                if (filterValues.length === 0) return true; // No filter for this column
                return filterValues.includes(rowValues[index]);
            });
        });
    }, [productVariations, selectedFilters, columns]);



    const handleCartClick = (rowData) => {
        setSelectedRowData(rowData);
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
    };


    // interface Item {
    //     value: any;
    //     id: any[];
    // }

    // function groupByValue(arr: { value: any; id: any }[]): Item[] {
    //     const result: Item[] = [];

    //     arr.forEach(item => {
    //         const existingItem = result.find(t => t.value === item.value);

    //         if (existingItem) {
    //             existingItem.id.push(item.id);
    //         } else {
    //             result.push({ value: item.value, id: [item.id] });
    //         }
    //     });

    //     return result;
    // }

    // function transformAndGroup(propertyKey) {
    //     return productProperties
    //         ? groupByValue(productProperties.map(item => ({ value: item[propertyKey], id: item.id })))
    //         : [];
    // }

    // Create arrays using the transformAndGroup function
    // const arr1 = transformAndGroup('value1');
    // const arr2 = transformAndGroup('value2');
    // const arr3 = transformAndGroup('value3');
    // const arr4 = transformAndGroup('value4');
    // const arr5 = transformAndGroup('value5');
    // const arr6 = transformAndGroup('value6');
    // const arr7 = transformAndGroup('value7');
    // const arr8 = transformAndGroup('value8');

    // console.log("arr1", arr1);
    // console.log("arr2", arr2);
    // console.log("arr3", arr3);
    // console.log("arr4", arr4);
    // console.log("ar5", arr5);
    // console.log("arr6", arr6);

    // function findCommonId(arrays: Item[][], values: any[]): any[] {
    //     // Start with the first array's IDs that match the value
    //     let commonIds = arrays[0].find(item => item.value === values[0])?.id || [];

    //     // Intersect with the IDs from the remaining arrays
    //     for (let i = 1; i < arrays.length; i++) {
    //         const arrayItem = arrays[i].find(item => item.value === values[i]);
    //         if (arrayItem) {
    //             commonIds = commonIds.filter(id => arrayItem.id.includes(id));
    //         } else {
    //             return []; // No common ID if any array does not have the value
    //         }
    //     }

    //     return commonIds;
    // }


    // const handleItemClick = (value: any, ids: any, array: number) => {
    //     let arrVal1 = product.value1;
    //     let arrVal2 = product.value2;
    //     let arrVal3 = product.value3;
    //     let arrVal4 = product.value4;
    //     let arrVal5 = product.value5;
    //     let arrVal6 = product.value6;
    //     let arrVal7 = product.value7;
    //     let arrVal8 = product.value8;

    //     // Update the selected value based on the array number
    //     if (array == 1) arrVal1 = value;
    //     if (array == 2) arrVal2 = value;
    //     if (array == 3) arrVal3 = value;
    //     if (array == 4) arrVal4 = value;
    //     if (array == 5) arrVal5 = value;
    //     if (array == 6) arrVal6 = value;
    //     if (array == 7) arrVal7 = value;
    //     if (array == 8) arrVal8 = value;


    //     // Find the common ID based on selected values
    //     const commonIds = findCommonId(
    //         [arr1, arr2, arr3, arr4, arr5, arr6],
    //         [arrVal1, arrVal2, arrVal3, arrVal4, arrVal5, arrVal6]
    //     );

    //     console.log("commonIds:", commonIds);

    //     if (commonIds.length === 1) {
    //         const id = commonIds[0];
    //         console.log("Common ID found:", id);

    //         const base64Id = Buffer.from(`${id}`, 'binary').toString('base64');
    //         router.push(`/shop/products/${base64Id}`);
    //     } else if (commonIds.length > 1) {
    //         console.log("Multiple common IDs found:", commonIds);
    //         // Handle multiple IDs (if applicable)
    //     } else {
    //         console.log("No common ID found");
    //         console.log("ids", ids);
    //         const idActive = ids.filter((item: any) => item == product.id);

    //         if (!idActive.length) {
    //             console.log("idActive", idActive);
    //             console.log("ids[0]", ids[0]);

    //             const base64Id = Buffer.from(`${ids[0]}`, 'binary').toString('base64');
    //             router.push(`/shop/products/${base64Id}`);
    //         }

    //     }
    // };


    const handleQuantityChange = (newValue) => {
        if (newValue >= product.stock) {
            toast.warning(`${product.name} available stock is ${product.stock}`);
            return;
        };
        setQuantity(newValue);
    };

    const addToCart1 = () => {
        if (typeof quantity === 'string') {
            return Promise.resolve();
        }

        return cartAddItem(product, [], quantity);
    };


    const addToCart = () => {
        const paramID = product.id;

        if (!cartItems || cartItems.length === 0) {
            // Handle case where cartItems is undefined or empty
            dispatch(addItemToCart(ProductId, Number(quantity)));
            toast.success("Item Added to Cart");
            return;
        }

        if (cartItems.length < 10) {
            let count = 0;
            // Use Array.find() to find the item in cartItems
            const existingItem = cartItems.find(item => Number(paramID) === item.product);

            if (existingItem) {
                count = existingItem.quantity;
            }

            if ((Number(quantity) + Number(count)) <= 1000) {
                dispatch(addItemToCart(ProductId, ((Number(quantity)))));
                toast.success("Item Added to Cart");
            } else {
                toast.success("Maximum limit of add to cart exceeded");
            }
        } else {
            toast.success("Cart has reached the max limit. Please delete existing cart items to add a new item.");
        }
    };


    const addToBuy = () => {
        return new Promise<void>((resolve, reject) => {
            try {
                remove();
                dispatch(addBuyItem(ProductId, Number(quantity)));
                router.push('/shipping'); // Assuming router.push doesn't return a Promise
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };


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
        formData.set("quantity", `${productQuantity}`);
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
        setName("")
        setMobile("")
        setEmail("")
        setMessage("")
    }

    // To ensure the `arr` array also has unique values

    const remove = () => {
        if (buyItem?.length) {
            buyItem.map(item => (
                dispatch(removeBuyItem(item.product))))
        }
    }

    function stockZero() {
        if (product.stock === 0) {
            toast.error("Currently product out of stock")
        }
    }


    let prices;

    if (product.discount) {
        prices = (
            <Fragment>
                <span className="product__new-price"><CurrencyFormat value={product.sale_price - product.tax_amount} /></span>
                {' '}
                <span className="product__old-price"><CurrencyFormat value={product.original_price} /></span>
            </Fragment>
        );
    } else {
        prices = <span className="product__new-price"><CurrencyFormat value={product.sale_price - product.tax_amount} /></span>
    }

    return (
        <div className={`product product--layout--${layout}`}>
            {product &&
                <div className="product__content">
                    {productImages && <ProductGallery layout={layout} images={productImages} pdf={product?.pdf} />}

                    <div className="product__info my-5">
                        <div className="product__wishlist-compare">
                            <AsyncAction
                                action={() => wishlistAddItem(product)}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Wishlist"
                                        onClick={run}
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        })}
                                    >
                                        <Wishlist16Svg />
                                    </button>
                                )}
                            />
                            <AsyncAction
                                action={() => compareAddItem(product)}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Compare"
                                        onClick={run}
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        })}
                                    >
                                        <Compare16Svg />
                                    </button>
                                )}
                            />
                        </div>
                        <h1 className="product__name">{product.name}</h1>


                        <div className="product__sidebar">
                            <div className="product__availability">
                                Availability:
                                {' '}
                                {product.stock > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}
                            </div>

                            <div className="product__prices">
                                {prices}
                            </div>

                            {!productVariations?.length ?
                                <form className="product__options">
                                    {/* {product.product_code ? (
                                    <div className="row">
                                        <hr className="hr-productDetails" />

                                        {product.properties1 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties1}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr1.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr1[i].id, 1)} className={`${product.value1 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties2 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties2}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr2.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr2[i].id, 2)} className={`${product.value2 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties3 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties3}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr3.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr3[i].id, 3)} className={`${product.value3 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties4 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties4}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr4.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr4[i].id, 4)} className={`${product.value4 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties5 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties5}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr5.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr5[i].id, 5)} className={`${product.value5 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties6 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties6}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr6.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr6[i].id, 6)} className={`${product.value6 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties7 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties7}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr7.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr7[i].id, 7)} className={`${product.value7 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}

                                        {product.properties8 && (
                                            <div>
                                                <h5 className="product__option-label">Select {product.properties8}</h5>
                                                <ul id="menu">
                                                    <div className="selected">
                                                        {arr8.map((ele, i) => (
                                                            <Link href="javascript:void(0)" key={i}>
                                                                <li onClick={() => handleItemClick(ele.value, arr8[i].id, 8)} className={`${product.value8 === ele.value ? 'list-active' : ""}`}>
                                                                    {ele.value}
                                                                </li>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </ul>
                                                <br /><br />
                                            </div>
                                        )}



                                    </div>
                                ) : (
                                    ""
                                )} */}


                                    <div className="form-group product__option">
                                        <div
                                            className="product__option-header"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <label
                                                htmlFor="product-quantity"
                                                className="product__option-label"
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginRight: '15px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Quantity
                                            </label>
                                            {product.bulk_qty > 1 && (
                                                <div
                                                    className="bulk-message alert alert-secondary mb-3"
                                                    style={{
                                                        fontSize: '14px',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'nowrap',
                                                        marginRight: "150px"
                                                    }}
                                                >
                                                    Please note: Purchases must be in multiples of {product.bulk_qty}.
                                                </div>
                                            )}

                                        </div>



                                        <div className="product__actions">
                                            <div className="product__actions-item">

                                                <InputNumber
                                                    id="product-quantity"
                                                    aria-label="Quantity"
                                                    className="product__quantity"
                                                    size="lg"
                                                    min={product.bulk_qty}
                                                    bulk_qty={product.bulk_qty}
                                                    value={quantity}
                                                    onChange={handleQuantityChange} // Handle the change
                                                />

                                            </div>
                                            <div className="product__actions-item product__actions-item--addtocart">
                                                <AsyncAction
                                                    action={() => addToBuy()}
                                                    render={({ loading }) => (
                                                        <button
                                                            type="button"
                                                            onClick={addToBuy}
                                                            disabled={!quantity}
                                                            className={classNames('btn btn-success btn-lg', {
                                                                'btn-loading': loading,
                                                            })}
                                                        >
                                                            Buy Now
                                                        </button>
                                                    )}
                                                />
                                            </div>
                                            <div className="product__actions-item product__actions-item--wishlist">
                                                <AsyncAction
                                                    action={() => wishlistAddItem(product)}
                                                    render={({ run, loading }) => (
                                                        <button
                                                            type="button"
                                                            data-toggle="tooltip"
                                                            title="Wishlist"
                                                            onClick={run}
                                                            className={classNames('btn btn-secondary btn-svg-icon btn-lg', {
                                                                'btn-loading': loading,
                                                            })}
                                                        >
                                                            <Wishlist16Svg />
                                                        </button>
                                                    )}
                                                />
                                            </div>
                                            <div className="product__actions-item product__actions-item--compare">
                                                <AsyncAction
                                                    action={() => compareAddItem(product)}
                                                    render={({ run, loading }) => (
                                                        <button
                                                            type="button"
                                                            data-toggle="tooltip"
                                                            title="Compare"
                                                            onClick={run}
                                                            className={classNames('btn btn-secondary btn-svg-icon btn-lg', {
                                                                'btn-loading': loading,
                                                            })}
                                                        >
                                                            <Compare16Svg />
                                                        </button>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="product__footer">
                                        <div className="product__tags tags">
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Button variant="primary" onClick={handleShow}>
                                                    Bulk Order Enquiry
                                                </Button>

                                                <Button variant="primary" onClick={addToCart}>
                                                    Add to cart
                                                </Button>
                                            </div>


                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Bulk Order Inquiry Form</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <form onSubmit={handleSubmit(submit)} >
                                                        <ul className="sasw_list mb0" style={{ listStyleType: "none" }}>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label><b>Name :</b></label>
                                                                    <li className="search_area">
                                                                        <div className="form-group mb-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Your Name"
                                                                                required
                                                                                value={name}
                                                                                onChange={(e) => setName(e.target.value)} id="Name"
                                                                            />
                                                                        </div>
                                                                    </li>
                                                                </div>
                                                                <div className="col">
                                                                    <label><b>Mobile No :</b></label>
                                                                    <li className="search_area">
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
                                                                    </li>{" "}
                                                                </div>
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-sm-8">
                                                                    <label><b>Email Address :</b></label>
                                                                    <li className="search_area">
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
                                                                    </li>{" "}
                                                                    {/* End li */}
                                                                </div>
                                                                <div className="col">
                                                                    <label><b>Product Quantity :</b></label>
                                                                    <li className="search_area">
                                                                        <div className="form-group mb-3">
                                                                            <input
                                                                                type="number"
                                                                                placeholder="Enter quantity"
                                                                                min={0}
                                                                                required
                                                                                className="form-control"
                                                                                value={productQuantity}
                                                                                onChange={(e) => setProductQuantity(Number(e.target.value))}
                                                                            />
                                                                        </div>
                                                                    </li>{" "}
                                                                </div>
                                                            </div>

                                                            <label><b>Product Name :</b></label>
                                                            <li className="search_area">
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
                                                            </li>
                                                            {/* End li */}
                                                            <label><b>Your Message :</b></label>
                                                            <li className="search_area">
                                                                <div className="form-group mb-3">
                                                                    <textarea
                                                                        id="form_message"
                                                                        name="form_message"
                                                                        rows={5}
                                                                        placeholder="Your Message"
                                                                        className="form-control "
                                                                        value={message}
                                                                        onChange={(e) => setMessage(e.target.value)}
                                                                    ></textarea>
                                                                </div>

                                                            </li>{" "}

                                                        </ul>
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
                                            {/* <div className="tags__list">
                              <br />
                              <AppLink href="/">Mounts</AppLink>
                              <AppLink href="/">Electrodes</AppLink>
                              <AppLink href="/">Chainsaws</AppLink>
                          </div> */}
                                        </div>


                                    </div>
                                </form> : ""
                            }

                            <div className="product__share-links share-links" style={{ float: "right" }}>
                                <ul className="share-links__list">
                                    <li className="share-links__item share-links__item--type--like">
                                        <AppLink className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank">Like</AppLink>
                                    </li>
                                    <li className="share-links__item share-links__item--type--whatsapp">
                                        <AppLink className="whatsapp" href={`https://api.whatsapp.com/send?text=Check%20this%20out:%20${encodeURIComponent(currentUrl)}`} target="_blank">WhatsApp</AppLink>
                                    </li>
                                    <li className="share-links__item share-links__item--type--linkedin">
                                        <AppLink href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`} >LinkedIn</AppLink>
                                    </li>
                                    {/* <li className="share-links__item share-links__item--type--counter">
                                  <AppLink href="/">4K</AppLink>
                              </li> */}
                                </ul>
                            </div>

                        </div>


                        <ul className="product__meta">
                            <li className="product__meta-availability">
                                Availability:
                                {' '}
                                {product.stock > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}

                            </li>
                            <li>
                                Category :&nbsp;
                                {product.category}
                            </li>
                            {/* {product.product_code && <li>SKU:  {product.product_code}</li>} */}
                            <li>

                            </li>
                            <div className="product__rating">
                                <div className="product__rating-stars">
                                    <Rating value={product.ratings} />
                                </div>
                                <div className="product__rating-legend">
                                    <AppLink href="/">{`${product.ratings} Reviews`}</AppLink>
                                    {/* <span>/</span> */}
                                    {/* <AppLink href="/">Write A Review</AppLink> */}
                                </div>
                            </div>
                        </ul>


                        <div className="product__description">
                            <div className="spec">
                                {/* <div className="spec__section">

                                    <div className="row mt-2 mb-5">
                                        {productDetails?.length ? (
                                            <table className="table table-striped " id="Table_id">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" colSpan={2}> <h4 className="prod-heading">Product Specification </h4></th>
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
                                                        <td colSpan={2} className="pt-2 pb-2" align="left"><a onClick={hide} className="text-muted">
                                                            {r === "r" ? (<div><small>SHOW MORE </small><b >&#8743;</b></div>) : (<div><small>SHOW LESS </small><b >&#8744;</b></div>)}</a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ) : ("")}
                                    </div>
                                </div> */}
                                <div className="spec__disclaimer">

                                    <div className="product-table-container">
                                        {productVariations?.length ? (
                                            <div>
                                                <div>
                                                    <span className="display-6" style={{ fontSize: '1.9rem' }}>Product Specifications and Technical Metrics </span>
                                                    <hr className="hr-productDetails" />
                                                </div>

                                                {/* Render dropdowns with checkboxes for filtering */}
                                                <div className="filter-section">
                                                    {columns?.map((column, columnIndex) => (
                                                        <div key={columnIndex} className="filter-group">
                                                            <h5>{column.trim()}</h5>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="light" id={`dropdown-${columnIndex}`}>
                                                                    {column.trim()}
                                                                </Dropdown.Toggle>

                                                                <Dropdown.Menu className="dropdown-menu-checkbox">
                                                                    <div className="checkbox-group">
                                                                        {uniqueValuesByColumn[columnIndex].map((value, valueIndex) => (
                                                                            <div key={valueIndex} className="checkbox-item">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={`${columnIndex}-${valueIndex}`}
                                                                                    onChange={() => handleCheckboxChange(columnIndex, value)}
                                                                                    checked={
                                                                                        selectedFilters[columnIndex]
                                                                                            ? selectedFilters[columnIndex].includes(value)
                                                                                            : false
                                                                                    }
                                                                                />
                                                                                <label htmlFor={`${columnIndex}-${valueIndex}`}>{value}</label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Reset Filters Button */}
                                                <div className="reset-filters">
                                                    <Button variant="warning" onClick={resetFilters}>
                                                        Reset Filters
                                                    </Button>
                                                </div>

                                                {/* Show Applied Filters */}
                                                <div className="applied-filters">
                                                    {Object.keys(selectedFilters).map((columnIndex) =>
                                                        selectedFilters[columnIndex].map((value, valueIndex) => (
                                                            <span key={`${columnIndex}-${valueIndex}`} className="applied-filter">
                                                                {columns[columnIndex]}: {value}
                                                                <FaTimesCircle
                                                                    className="remove-filter-icon"
                                                                    onClick={() => removeFilter(columnIndex, value)}
                                                                />
                                                            </span>
                                                        ))
                                                    )}
                                                </div>


                                                <div>
                                                    <hr className="hr-productDetails" />
                                                    <h5 className="my-3" style={{ color: '#616161' }}>
                                                        Select the cart button in the table to purchase product
                                                    </h5>

                                                    {filteredVariations.length > 0 ? (
                                                        <div className="table-responsive">
                                                            <table className="table border">
                                                                <thead>
                                                                    <tr>
                                                                        {columns?.map((header, index) => (
                                                                            <th key={index} scope="col">
                                                                                {header.trim()}
                                                                            </th>
                                                                        ))}
                                                                        <th scope="col">
                                                                            <span className="badge text-bg-success">Buy Now</span>
                                                                        </th>{' '}
                                                                        {/* Add column for cart icon */}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {filteredVariations.map((row) => {
                                                                        const rowData = row.columns.split(',').map((data) => data.trim());
                                                                        return (
                                                                            <tr key={row.id}>
                                                                                {rowData.map((data, index) => (
                                                                                    <td key={index}>{data}</td>
                                                                                ))}
                                                                                <td>
                                                                                    <Button
                                                                                        variant="link"
                                                                                        onClick={() => handleCartClick(rowData)}
                                                                                        aria-label="Add to cart"
                                                                                    >
                                                                                        <FaCartPlus />
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p>No records match the current filters.</p> // Message when no data matches the filters
                                                    )}

                                                    {/* Modal */}
                                                    <Modal show={modalIsOpen} onHide={closeModal}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>{product.name}</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            {selectedRowData && (
                                                                <ul className="custom-bullet-list">
                                                                    {selectedRowData.map((data, index) => (
                                                                        <li key={index}>
                                                                            <strong>{columns[index].trim()}:</strong> {data}
                                                                        </li>
                                                                    ))}
                                                                </ul>

                                                            )}

                                                            <form className="product__options">
                                                                <div className="form-group product__option">
                                                                    <div
                                                                        className="product__option-header"
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            flexWrap: 'wrap',
                                                                            marginBottom: '10px'
                                                                        }}
                                                                    >
                                                                        <label
                                                                            htmlFor="product-quantity"
                                                                            className="product__option-label"
                                                                            style={{
                                                                                fontWeight: 'bold',
                                                                                marginRight: '15px',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                        >
                                                                            Quantity
                                                                        </label>
                                                                        {product.bulk_qty > 1 && (
                                                                            <div
                                                                                className="bulk-message alert alert-secondary mb-3"
                                                                                style={{
                                                                                    fontSize: '14px',
                                                                                    padding: '4px 8px',
                                                                                    borderRadius: '4px',
                                                                                    whiteSpace: 'nowrap',
                                                                                    marginRight: "150px"
                                                                                }}
                                                                            >
                                                                                Please note: Purchases must be in multiples of {product.bulk_qty}.
                                                                            </div>
                                                                        )}

                                                                    </div>



                                                                    <div className="product__actions">
                                                                        <div className="product__actions-item">

                                                                            <InputNumber
                                                                                id="product-quantity"
                                                                                aria-label="Quantity"
                                                                                className="product__quantity"
                                                                                size="lg"
                                                                                min={product.bulk_qty}
                                                                                bulk_qty={product.bulk_qty}
                                                                                value={quantity}
                                                                                onChange={handleQuantityChange} // Handle the change
                                                                            />

                                                                        </div>
                                                                        <div className="product__actions-item product__actions-item--addtocart">
                                                                            <AsyncAction
                                                                                action={() => addToBuy()}
                                                                                render={({ loading }) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={addToBuy}
                                                                                        disabled={!quantity}
                                                                                        className={classNames('btn btn-success btn-lg', {
                                                                                            'btn-loading': loading,
                                                                                        })}
                                                                                    >
                                                                                        Buy Now
                                                                                    </button>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="product__actions-item product__actions-item--wishlist">
                                                                            <AsyncAction
                                                                                action={() => wishlistAddItem(product)}
                                                                                render={({ run, loading }) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        data-toggle="tooltip"
                                                                                        title="Wishlist"
                                                                                        onClick={run}
                                                                                        className={classNames('btn btn-secondary btn-svg-icon btn-lg', {
                                                                                            'btn-loading': loading,
                                                                                        })}
                                                                                    >
                                                                                        <Wishlist16Svg />
                                                                                    </button>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="product__actions-item product__actions-item--compare">
                                                                            <AsyncAction
                                                                                action={() => compareAddItem(product)}
                                                                                render={({ run, loading }) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        data-toggle="tooltip"
                                                                                        title="Compare"
                                                                                        onClick={run}
                                                                                        className={classNames('btn btn-secondary btn-svg-icon btn-lg', {
                                                                                            'btn-loading': loading,
                                                                                        })}
                                                                                    >
                                                                                        <Compare16Svg />
                                                                                    </button>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="product__footer">
                                                                    <div className="product__tags tags">
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                            <Button variant="primary" onClick={handleShow}>
                                                                                Bulk Order Enquiry
                                                                            </Button>

                                                                            <Button variant="primary" onClick={addToCart}>
                                                                                Add to cart
                                                                            </Button>
                                                                        </div>


                                                                        <Modal show={show} onHide={handleClose}>
                                                                            <Modal.Header closeButton>
                                                                                <Modal.Title>Bulk Order Inquiry Form</Modal.Title>
                                                                            </Modal.Header>
                                                                            <Modal.Body>
                                                                                <form onSubmit={handleSubmit(submit)} >
                                                                                    <ul className="sasw_list mb0" style={{ listStyleType: "none" }}>
                                                                                        <div className="row">
                                                                                            <div className="col">
                                                                                                <label><b>Name :</b></label>
                                                                                                <li className="search_area">
                                                                                                    <div className="form-group mb-3">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="form-control"
                                                                                                            placeholder="Your Name"
                                                                                                            required
                                                                                                            value={name}
                                                                                                            onChange={(e) => setName(e.target.value)} id="Name"
                                                                                                        />
                                                                                                    </div>
                                                                                                </li>
                                                                                            </div>
                                                                                            <div className="col">
                                                                                                <label><b>Mobile No :</b></label>
                                                                                                <li className="search_area">
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
                                                                                                </li>{" "}
                                                                                            </div>
                                                                                        </div>


                                                                                        <div className="row">
                                                                                            <div className="col-sm-8">
                                                                                                <label><b>Email Address :</b></label>
                                                                                                <li className="search_area">
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
                                                                                                </li>{" "}
                                                                                                {/* End li */}
                                                                                            </div>
                                                                                            <div className="col">
                                                                                                <label><b>Product Quantity :</b></label>
                                                                                                <li className="search_area">
                                                                                                    <div className="form-group mb-3">
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            placeholder="Enter quantity"
                                                                                                            min={0}
                                                                                                            required
                                                                                                            className="form-control"
                                                                                                            value={productQuantity}
                                                                                                            onChange={(e) => setProductQuantity(Number(e.target.value))}
                                                                                                        />
                                                                                                    </div>
                                                                                                </li>{" "}
                                                                                            </div>
                                                                                        </div>

                                                                                        <label><b>Product Name :</b></label>
                                                                                        <li className="search_area">
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
                                                                                        </li>
                                                                                        {/* End li */}
                                                                                        <label><b>Your Message :</b></label>
                                                                                        <li className="search_area">
                                                                                            <div className="form-group mb-3">
                                                                                                <textarea
                                                                                                    id="form_message"
                                                                                                    name="form_message"
                                                                                                    rows={5}
                                                                                                    placeholder="Your Message"
                                                                                                    className="form-control "
                                                                                                    value={message}
                                                                                                    onChange={(e) => setMessage(e.target.value)}
                                                                                                ></textarea>
                                                                                            </div>

                                                                                        </li>{" "}

                                                                                    </ul>
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

                                                                    </div>

                                                                </div>
                                                            </form>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={closeModal}>
                                                                Close
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </div>
                                            </div>

                                        ) : null}

                                    </div>




                                    {/* Information on technical characteristics, the delivery set, the country of
              manufacture and the appearance of the goods is for reference only and is based on
              the latest information available at the time of publication. */}
                                </div>
                            </div>
                        </div>
                        {/* <div className="product__description">
                      <h4 className="spec__section-title">Product Description</h4>
                      <ReadMore text={(String(product.description))} />
                  </div> */}
                        {/* <ul className="product__features">
                      <li>Speed: 750 RPM</li>
                      <li>Power Source: Cordless-Electric</li>
                      <li>Battery Cell Type: Lithium</li>
                      <li>Voltage: 20 Volts</li>
                      <li>Battery Capacity: 2 Ah</li>
                  </ul> */}

                    </div >

                </div >
            }

        </div >
    );
}

export default Product;
