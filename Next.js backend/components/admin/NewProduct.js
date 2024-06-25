import React, { Fragment, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from 'next/link'
import MetaData from "../layout/MetaData";
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import {
  newProduct,
  clearErrors,
  getDiscount,
  getGstAmount,
  allCategory,
  getProductDetails,
  getAdminProducts
} from "../../redux/actions/productActions";
import { NEW_PRODUCT_RESET } from "../../redux/constants/productConstants";
import { useForm } from "react-hook-form";
import FiledView from "./FiledView";
import FiledView1 from "./FiledView1";
import { property } from './FiledList1'
import { productSpecification } from './FiledList'
import { Buffer } from 'buffer'
import { useRouter } from "next/router";

const NewProduct = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [original_price, setOriginal_price] = useState();
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);
  const [gstPrice, setGstPrice] = useState(0);
  const [sale_price, setSale_price] = useState();
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState();
  const [stock, setStock] = useState();
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [file, setFile] = useState();
  const [code, setCode] = useState("");
  const [properties1, setProperties1] = useState("");
  const [value1, setValue1] = useState("");
  const [properties2, setProperties2] = useState("");
  const [value2, setValue2] = useState("");
  const [properties3, setProperties3] = useState("");
  const [value3, setValue3] = useState("");
  const [productID, setProductID] = useState("");
  const [productField, setProductField] = useState();

  const { category } = useSelector(state => state.allCategory);
  const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.newProduct);
  const { product } = useSelector(state => state.productDetails)
  const productImages = product?.images ? JSON.parse(product.images) : [];
  const productDetails = product?.specifications ? JSON.parse(JSON.parse(product?.specifications)) : [];
  const { products } = useSelector(state => state.products);
  var commonCode = []
  var commonID = [];
  const myObject = [];
  const pid = products?.at(0)?.id;

  if (products) {
    products.map((product) => {
      if (product.product_code) {
        if (!commonCode.includes(product.product_code)) {
          commonID.push(product.id)
        }
        commonCode.push(product.product_code)
      }
    })
  }

  const unique = commonCode.filter(onlyUnique);
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  if (commonCode && commonID) {
    let i;
    for (i = 0; i < unique.length; i++) {
      myObject.push({ id: commonID[i], product_code: unique[i] }
      )
    }
  }

  const onChangePCode = (e) => {
    setProductID(e.target.value);
    dispatch(getProductDetails(Buffer.from((e.target.value).toString(), 'binary').toString('base64')));
  }

  useEffect(() => {
    dispatch(allCategory());
    dispatch(getAdminProducts());
    if (productID) {
      setName(product.name ? product.name : "");
      setOriginal_price(product.original_price ? product.original_price : "");
      setDiscount(product.discount ? product.discount : "");
      setGst(product.tax_rate ? product.tax_rate : "");
      setSale_price(product.sale_price ? product.sale_price : "");
      setDescription(product.description ? product.description : "");
      setCategoryName(product.category ? product.category : "");
      setSeller(product.seller ? product.seller : "");
      setStock(product.stock ? product.stock : "");
      setOldImages(productImages ? productImages : "");
      setProductField(productDetails ? productDetails : "");
      setCode(product.product_code ? product.product_code : "");
      setProperties1(product.properties1 ? product.properties1 : "");
      setProperties2(product.properties2 ? product.properties2 : "");
      setProperties3(product.properties3 ? product.properties3 : "");
      setValue1(product.value1 ? product.value1 : "");
      setValue2(product.value2 ? product.value2 : "");
      setValue3(product.value3 ? product.value3 : "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      router.push('/admin/products');
      toast.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, product.id, productID]);


  const submitHandler = (data, e) => {
    var productDetails1;
    if (property) {
      productDetails1 = JSON.stringify(property)

    } else {
      productDetails1 = JSON.stringify(productSpecification);
    }
    e.preventDefault();

    // console.log("productDetails1", productDetails1);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("original_price", original_price);
    formData.set("discount", discount);
    formData.set("gst", gst);
    formData.set("gstPrice", getGstAmount(getDiscount(original_price, discount), gst) - getDiscount(original_price, discount));
    formData.set("sale_price", getGstAmount(getDiscount(original_price, discount), gst).toFixed(2));
    formData.set("description", description);
    formData.set("category", categoryName);
    formData.set("stock", stock);
    formData.set("seller", seller);
    formData.set("productDetails", productDetails1);
    formData.set("code", code ? code : `SGSRO${pid + 1}`);
    formData.set("properties1", properties1);
    formData.set("value1", value1);
    formData.set("properties2", properties2);
    formData.set("value2", value2);
    formData.set("properties3", properties3);
    formData.set("value3", value3);

    // formData.append("file", file);

    // images.forEach((image) => {
    //   formData.append("images", image);
    // }); 

    for (let i = 0; i < file.length; i++) {
      formData.append(`file`, file[i]);
    }


    dispatch(newProduct(formData));
    reset();

  };

  const sidebar = useMemo(() => <MemoizedSidebar />, []);

  const onChange = (event) => {
    const file = event.target.files;
    setFile(file);
    setOldImages("");

    if (event.target.name === "file") {
      if (file.length === 0) {
        window.alert("Please select a product images/video");
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

    const files = Array.from(event.target.files);
    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <Fragment>
      <MetaData title={"New Product"} />
      <div className="row">
        <div className="col-12 col-md-2">
          {sidebar}
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="row wrapper">
              <form
                className="shadow-lg p-5"
                onSubmit={handleSubmit(submitHandler)}
                enctype="multipart/form-data"
              >
                <div className="row">
                  <div className="col-md-7">
                    <h1 className="mt-2 mb-5 heading">New Product</h1>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="category_field">If Product Code Available </label>
                      <select
                        id="category_field"
                        className="form-control "
                        defaultValue={{ label: "Select Product Code", value: 0 }}
                        value={productID}
                        onChange={onChangePCode}
                      >
                        <option value="">Select a product code...</option>
                        {myObject && myObject.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.product_code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name_field">Product Name</label>
                  <input
                    type="text"
                    id="name_field"
                    name="name"
                    className={`form-control ${errors.name && "invalid"}`}
                    {...register("name",
                      { required: productID ? false : "Please enter the product name" })}
                    onInvalid={() => {
                      trigger("name");
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name.message}</small>
                  )}
                </div>

                <div className="row">

                  <div className="col-md-3 form-group">
                    <label htmlFor="price_field">Original Price</label>
                    <input
                      type="text"
                      id="price_field"
                      onWheel={(event) => event.currentTarget.blur()}
                      name="price_field"
                      className={`form-control ${errors.price_field && "invalid"}`}
                      {...register("price_field", {
                        required: productID ? false : "Please enter the product price.",
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
                      onInvalid={() => {
                        trigger("price_field");
                      }}
                      value={original_price}
                      onChange={(e) => setOriginal_price(e.target.value)}
                    />
                    {errors.price_field && (
                      <small className="text-danger">
                        {errors.price_field.message}
                      </small>
                    )}
                  </div>

                  <div className="col-md-3 form-group">
                    <label htmlFor="discount_field">
                      Discount in Percentage (%)
                    </label>
                    <input
                      type="number"
                      onWheel={(event) => event.currentTarget.blur()}
                      id="discount_field"
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
                      onInvalid={() => {
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
                    <label htmlFor="sale_price_field">Final Price</label>
                    <input
                      type="number"
                      onWheel={(event) => event.currentTarget.blur()}
                      id="sale_price_field"
                      className="form-control"
                      value={getGstAmount(getDiscount(original_price, discount), gst).toFixed(2)}
                      onChange={(e) => setSale_price(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Key Features</label>
                  <textarea
                    name="description_field"
                    className="form-control invalid"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-8 form-group">
                    <label htmlFor="category_field">Select Category <small>(<Link href="/admin/category" target="_blank">Click here to add new categories</Link>)</small></label>
                    <select
                      id="category_field"
                      className={`form-control ${errors.category_field && "invalid"}`}
                      {...register("category_field", { required: productID ? false : "Please select one category of options" })}
                      onInvalid={() => {
                        trigger("category_field");
                      }}
                      defaultValue={{ label: "Select Dept", value: 0 }}
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    >
                      <option value="">Please select a category...</option>
                      {category.map((cat) => (
                        <option key={cat.category} value={cat.category}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                    {errors.category_field && (
                      <small className="text-danger">{errors.category_field.message}</small>
                    )}

                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="stock_field">Stock Quantity</label>
                    <input
                      type="text"
                      onWheel={(event) => event.currentTarget.blur()}
                      id="stock_field"
                      name="stock_field"
                      className={`form-control ${errors.stock_field && "invalid"}`}
                      {...register("stock_field", {
                        required: productID ? false : "Please enter the number of stock of the product",
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
                      onInvalid={() => {
                        trigger("stock_field");
                      }}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                    {errors.stock_field && (
                      <small className="text-danger">{errors.stock_field.message}</small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                      required
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                    </label>
                  </div>

                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="75"
                      height="75"
                    />
                  ))}

                  {oldImages && oldImages.map(img => (
                    <img key={img} src={`/uploads/product/${img}`} alt={img} className="mt-3 mr-2" width="75" height="75" />
                  ))}

                </div>
                <br />

                <div className="form-group">
                  <div class="accordion" id="accordionPanelsStayOpenExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                          Add Product Specification

                        </button>
                      </h2>
                      <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                        <div class="accordion-body">
                          {productField ? (
                            <div className="row-fluid">
                              <FiledView1
                                productField={productField && productField} />
                            </div>
                          ) : (
                            <div className="row-fluid">
                              <FiledView />
                            </div>
                          )}

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
                            <label htmlFor="code_field">Product Code <a href="javascript:void(0)">(<small>Use the common code for simliar product</small>)</a></label>
                            <input
                              type="text"
                              id="code_field"
                              className="form-control upperCase1"
                              value={code ? code : `SGSRO${pid + 1}`}
                              // onChange={(e) => setCode(e.target.value)}
                              readOnly
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
                    className="btn btn-primary py-3"
                    disabled={loading ? true : false}
                  >
                    ADD PRODUCT
                  </button>
                </div>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default NewProduct;
