import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Sidebar from './Sidebar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct, getProductDetails, getDiscount, getGstAmount, allCategory } from '../../redux/actions/productActions'
import { UPDATE_PRODUCT_RESET } from '../../redux/constants/productConstants'
import { useForm } from "react-hook-form";
import FiledView1 from "./FiledView1";
import { property } from './FiledList1'
import { Buffer } from 'buffer'

const UpdateProduct = () => {

    const router = useRouter()
    const [name, setName] = useState();
    const [original_price, setOriginal_price] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [gst, setGst] = useState(18);
    const [gstPrice, setGstPrice] = useState(0);
    const [sale_price, setSale_price] = useState(0);
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState();
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState();
    const [images, setImages] = useState([]);
    const [file, setFile] = useState();
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [productField, setProductField] = useState([])
    const [code, setCode] = useState("");
    const [properties1, setProperties1] = useState("");
    const [value1, setValue1] = useState("");
    const [properties2, setProperties2] = useState("");
    const [value2, setValue2] = useState("");
    const [properties3, setProperties3] = useState("");
    const [value3, setValue3] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();

    const dispatch = useDispatch();
    const { category } = useSelector(state => state.allCategory);
    const { error, product, productImages, productDetails } = useSelector(state => state.productDetails)
    const { loading, error: updateError, isUpdated, success } = useSelector(state => state.product);
    const productId = router.query.id;


    useEffect(() => {
        if (product && product.id !== productId) {
            dispatch(getProductDetails(productId));
        }
        dispatch(allCategory());
        setName(product.name ? product.name : "");
        setOriginal_price(product.original_price ? product.original_price : "");
        setDiscount(product.discount ? product.discount : "");
        setGst(product.tax_rate ? product.tax_rate : "");
        setSale_price(product.sale_price ? product.sale_price : "");
        setDescription(product.description ? product.description : "");
        setCategoryName(product.category ? product.category : "");
        setSeller(product.seller ? product.seller : "");
        setStock(product.stock ? product.stock : "");
        setOldImages(productImages ? productImages : "")
        setProductField(productDetails ? productDetails : "");
        setCode(product.product_code ? product.product_code : "");
        setProperties1(product.properties1 ? product.properties1 : "");
        setProperties2(product.properties2 ? product.properties2 : "");
        setProperties3(product.properties3 ? product.properties3 : "");
        setValue1(product.value1 ? product.value1 : "");
        setValue2(product.value2 ? product.value2 : "");
        setValue3(product.value3 ? product.value3 : "");


        if (success || isUpdated) {
            router.push('/admin/products');
            toast.success("Product updated successfully");
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }

        if (error) {
            toast.error(error);
        }

        if (updateError) {
            toast.error(updateError);
        }
    }, [dispatch, toast, router.push, error, isUpdated, success, product.id, updateError, productId])


    const submitHandler = (data, e) => {
        const productDetails1 = JSON.stringify(property)
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('original_price', original_price);
        formData.set('discount', discount);
        formData.set("gst", gst);
        formData.set("gstPrice", getGstAmount(getDiscount(original_price, discount), gst) - getDiscount(original_price, discount));
        formData.set("sale_price", getGstAmount(getDiscount(original_price, discount), gst));
        formData.set('description', description);
        formData.set('category', categoryName);
        formData.set('stock', stock);
        formData.set('seller', seller);
        formData.set("productDetails", productDetails1);
        formData.set("code", code);
        formData.set("properties1", properties1);
        formData.set("value1", value1);
        formData.set("properties2", properties2);
        formData.set("value2", value2);
        formData.set("properties3", properties3);
        formData.set("value3", value3);

        // console.log('name', name);
        // console.log('original_price', original_price);
        // console.log('discount', discount);
        // console.log('sale_price', getDiscount(original_price, discount));
        // console.log('description', description);
        // console.log('category', categoryName);

        // console.log('seller', seller);
        // console.log("productDetails", productDetails1);

        // images.forEach(image => {
        //     formData.append('images', image)
        // })
        if (file) {
            for (let i = 0; i < file.length; i++) {
                formData.append(`file`, file[i])
            }
        }

        // var object = {};
        // formData.forEach((value, key) => object[key] = value);
        // var json = object
        // console.log(json)

        dispatch(updateProduct(Buffer.from(`${product.id}`, 'binary').toString('base64'), formData));
        e.target.reset();
        reset();
    }

    const onChange = event => {
        const file = event.target.files;
        setFile(file)

        if (event.target.name === 'file') {
            if (file.length === 0) {
                window.alert("Please select a image");
                return false;
            }
            for (let i = 0; i < file.length; i++) {
                if (file[i].type !== "image/png" && file[i].type !== "image/jpg" && file[i].type !== "image/jpeg" && file[i].type !== "image/gif") {
                    window.alert("File does not support. You must use .png, .jpg. .Gif ");
                    return false;
                }
                if (file[i].size > 25000000) {
                    window.alert("Please upload a image smaller than 25 MB");
                    return false;
                }
            }
        }

        const files = Array.from(event.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    return (
        <Fragment>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row wrapper">
                            <form key={product && product.id} className="shadow-lg p-5" onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
                                <h1 className="mt-2 mb-5 heading">Update Product</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Product Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='row'>
                                    <div className="col-md-3 form-group">
                                        <label htmlFor="price_field">Original Price</label>
                                        <input
                                            type="number"
                                            id="price_field"
                                            onWheel={event => event.currentTarget.blur()}
                                            name="price_field"
                                            className={`form-control ${errors.price_field && "invalid"}`}
                                            {...register("price_field", {
                                                required: "Please enter the product price.",
                                                min: {
                                                    value: 1,
                                                    message: "The minimum price should be not less than 1 ",
                                                },
                                                max: {
                                                    value: 1000000,
                                                    message: "The maximum price should be not more than 1000000",
                                                },
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Only numbers are allowed",
                                                }
                                            })}
                                            oninvalid={() => {
                                                trigger("price_field");
                                            }}
                                            value={original_price}
                                            onChange={(e) => setOriginal_price(e.target.value)}
                                            required
                                        />
                                        {errors.price_field && (
                                            <small className="text-danger">
                                                {errors.price_field.message}
                                            </small>
                                        )}
                                    </div>

                                    <div className="col-md-3 form-group">
                                        <label htmlFor="discount_field">Discount in Percentage (%)</label>
                                        <input
                                            type="number"
                                            id="discount_field"
                                            onWheel={event => event.currentTarget.blur()}
                                            name="discount_field"
                                            className={`form-control ${errors.discount_field && "invalid"}`}
                                            {...register("discount_field", {
                                                min: {
                                                    value: 0,
                                                    message: "The minimum discount should be not less than 0%",
                                                },
                                                max: {
                                                    value: 99,
                                                    message: "The maximum discount should be not more than 99%",
                                                },
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Only numbers are allowed",
                                                }
                                            })}
                                            oninvalid={() => {
                                                trigger("discount_field");
                                            }}
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                        />
                                        {errors.discount_field && (
                                            <small className="text-danger">{errors.discount_field.message}</small>
                                        )}
                                    </div>

                                    <div className="col-md-3 form-group">
                                        <label htmlFor="discount_field">
                                            Tax Rate GST(%)
                                        </label>
                                        <input
                                            type="number"
                                            onWheel={(event) => event.currentTarget.blur()}
                                            id="gst_field"
                                            name="gst_field"
                                            className={`form-control ${errors.gst_field && "invalid"}`}
                                            {...register("gst_field", {
                                                min: {
                                                    value: 0,
                                                    message: "GST should be not less than 0%",
                                                },
                                                max: {
                                                    value: 99,
                                                    message: "GST should be not more than 99%",
                                                },
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Only numbers are allowed",
                                                }
                                            })}
                                            onInvalid={() => {
                                                trigger("gst_field");
                                            }}
                                            value={gst}
                                            onChange={(e) => setGst(e.target.value)}
                                        />
                                        {errors.gst_field && (
                                            <small className="text-danger">{errors.gst_field.message}</small>
                                        )}
                                    </div>

                                    <div className="col-md-3 form-group">
                                        <label htmlFor="discountPrice_field">Final Price</label>
                                        <input
                                            type="number"
                                            id="discountPrice_field"
                                            onWheel={event => event.currentTarget.blur()}
                                            className="form-control"
                                            value={getGstAmount(getDiscount(original_price, discount), gst)}
                                            onChange={(e) => setSale_price(e.target.value)}
                                            readOnly
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Key Features</label>
                                    <textarea
                                        name="description_field"
                                        className="form-control invalid"
                                        id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Select Category <small>(<Link href="/admin/category" target="_blank">Click here to add new categories</Link>)</small></label>
                                    <select
                                        className="form-control"
                                        id="category_field" value={categoryName}
                                        required
                                        onChange={(e) => setCategoryName(e.target.value)}>
                                        <option value="">Please select a category...</option>
                                        {category.map(cat => (
                                            <option key={cat.category} value={cat.category} required>{cat.category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 form-group">
                                        <label htmlFor="stock_field">Stock</label>
                                        <input
                                            type="number"
                                            id="stock_field"
                                            onWheel={event => event.currentTarget.blur()}
                                            name="stock_field"
                                            className={`form-control ${errors.stock_field && "invalid"}`}
                                            {...register("stock_field", {
                                                required: "Please enter the number of stock of the product",
                                                min: {
                                                    value: 0,
                                                    message: "The stock should be not less than 0",
                                                },
                                                max: {
                                                    value: 10000,
                                                    message: "The stock should be not more than 10000",
                                                },
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Only numbers are allowed",
                                                }
                                            })}
                                            oninvalid={() => {
                                                trigger("stock_field");
                                            }}
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                        />
                                        {errors.stock_field && (
                                            <small className="text-danger">{errors.stock_field.message}</small>
                                        )}
                                    </div>

                                    <div className="col-md-8 form-group">
                                        <label htmlFor="seller_field">Seller Name</label>
                                        <input
                                            type="text"
                                            id="seller_field"
                                            className="form-control"
                                            value={seller}
                                            onChange={(e) => setSeller(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='file'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                        </label>
                                    </div>

                                    {oldImages && oldImages.map(img => (
                                        <img key={img} src={`/uploads/product/${img.imageName}`} alt={img.imageName} className="mt-3 mr-2" width="75" height="75" />
                                    ))}

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="75" height="75" />
                                    ))}

                                </div>

                                <div className="form-group">
                                    <div class="accordion" id="accordionPanelsStayOpenExample">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                    Update Product Specification

                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                <div class="accordion-body">
                                                    <div className="row-fluid">
                                                        <FiledView1
                                                            productField={productField && productField} />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div class="accordion" id="accordionPanelsStayOpenExample">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="panelsStayOpen-headingOne1">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne1" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                    Add Product Group
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseOne1" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne1">
                                                <div class="accordion-body">
                                                    <div className="form-group">
                                                        <label htmlFor="code_field">Product Code <a>(<small>Please fill up the common value for simliar product</small>)</a></label>
                                                        <input
                                                            type="text"
                                                            id="code_field"
                                                            className="form-control upperCase1"
                                                            value={code}
                                                            onChange={(e) => setCode(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="accordion-inner">
                                                        <div>
                                                            <label htmlFor="headinf1">Heading 1</label>
                                                            <div className="row sizeProduct" >
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="properties"
                                                                        name="properties"
                                                                        value={properties1}
                                                                        onChange={(e) => setProperties1(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="value"
                                                                        name="value"
                                                                        value={value1}
                                                                        onChange={(e) => setValue1(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="headinf1">Heading 2</label>
                                                            <div className="row sizeProduct" >
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="properties"
                                                                        name="properties"
                                                                        value={properties2}
                                                                        onChange={(e) => setProperties2(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="value"
                                                                        name="value"
                                                                        value={value2}
                                                                        onChange={(e) => setValue2(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="headinf1">Heading 3</label>
                                                            <div className="row sizeProduct" >
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="properties"
                                                                        name="properties"
                                                                        value={properties3}
                                                                        onChange={(e) => setProperties3(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-5 wid">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control required upperCase"
                                                                        placeholder="value"
                                                                        name="value"
                                                                        value={value3}
                                                                        onChange={(e) => setValue3(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <button
                                        id="login_button"
                                        type="submit"
                                        className="btn btn-block py-3 d-flex justify-content-center"
                                        disabled={loading ? true : false}
                                    >
                                        UPDATE PRODUCT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default UpdateProduct
