import React, { useState, useEffect } from 'react'
import PageHeader from '../../../shared/layout-components/page-header/page-header'
import { Accordion, Card, Breadcrumb, Col, FormGroup, Row, Form, Button, Collapse } from "react-bootstrap";

import Link from 'next/link';
import { FilePond } from 'react-filepond';
import dynamic from 'next/dynamic';
const Editer = dynamic(() => import('../../../shared/data/e-commerce/editer'), { ssr: false })
import Contentlayout from '../../../shared/layout-components/layout/content-layout'

import { useDispatch, useSelector } from "react-redux";
import {
  newProduct,
  clearErrors,
  getDiscount,
  getGstAmount,
  allCategory,
  getProductDetails,
  getAdminProducts
} from "../../../store/action/productActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NEW_PRODUCT_RESET } from "../../../store/constants/productConstants";
import { useForm } from "react-hook-form";
import FiledView from "../../../components/admin/FiledView";
import FiledView1 from "../../../components/admin/FiledView1";
import { property } from '../FiledList1'
import { productSpecification } from '../FiledList'


import FiledTableVariationsView from "../../../components/admin/FiledTableVariationsView";
import FiledTableVariationsView1 from "../../../components/admin/FiledTableVariationsView1";
import { variation } from '../FiledListVariations1'
import { productTableVariation } from '../FiledListVariations'

import { Buffer } from 'buffer'
import { useRouter } from "next/router";


const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [filesimade, setFilesimage] = useState([]);


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
  const [filespdf, setFilespdf] = useState([]);
  const [pdfsPreview, setPdfsPreview] = useState([]);
  const [oldPdfs, setOldPdfs] = useState([]);
  const [file, setFile] = useState();
  const [code, setCode] = useState("");
  const [properties1, setProperties1] = useState("");
  const [value1, setValue1] = useState("");
  const [properties2, setProperties2] = useState("");
  const [value2, setValue2] = useState("");
  const [properties3, setProperties3] = useState("");
  const [value3, setValue3] = useState("");
  const [properties4, setProperties4] = useState("");
  const [value4, setValue4] = useState("");
  const [properties5, setProperties5] = useState("");
  const [value5, setValue5] = useState("");
  const [properties6, setProperties6] = useState("");
  const [value6, setValue6] = useState("");
  const [properties7, setProperties7] = useState("");
  const [value7, setValue7] = useState("");
  const [properties8, setProperties8] = useState("");
  const [value8, setValue8] = useState("");
  const [productID, setProductID] = useState("");
  const [productField, setProductField] = useState([]);
  const [productFieldVariation, setProductFieldVariation] = useState([]);
  const [bulk_qty, setBulk_qty] = useState(1);


  const handleContentChange = (content) => {
    setDescription(content);
  };


  const { category } = useSelector(state => state.allCategory);
  const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const { product } = useSelector(state => state.productDetails)
  const productImages = product?.images ? JSON.parse(product.images) : [];
  const productDetails = product?.specifications ? JSON.parse(JSON.parse(product?.specifications)) : [];
  const productVariation = product?.variations ? JSON.parse(JSON.parse(product?.variations)) : [];
  const { products } = useSelector(state => state.productsOld);
  const myObject = [];
  const productMap = {};

  // Iterate over products to build the product map
  (products || []).forEach(product => {
    const { id, product_code } = product;
    if (product_code && !productMap[product_code]) {
      productMap[product_code] = id;
    }
  });

  // Create an array of unique product codes
  const uniqueProductCodes = Object.keys(productMap);

  // Populate myObject array with unique product codes and their corresponding IDs
  uniqueProductCodes.forEach(product_code => {
    myObject.push({ id: productMap[product_code], product_code });
  });



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
      setBulk_qty(product.bulk_qty ? product.bulk_qty : 1);
      setSeller(product.seller ? product.seller : "");
      setStock(product.stock ? product.stock : "");
      setOldImages(productImages ? productImages : "")
      setProductField(productDetails ? productDetails : "");
      setProductFieldVariation(productVariation ? productVariation : "");
      setCode(product.product_code ? product.product_code : "");
      setProperties1(product.properties1 ? product.properties1 : "");
      setProperties2(product.properties2 ? product.properties2 : "");
      setProperties3(product.properties3 ? product.properties3 : "");
      setProperties4(product.properties4 ? product.properties4 : "");
      setProperties5(product.properties5 ? product.properties5 : "");
      setProperties6(product.properties6 ? product.properties6 : "");
      setProperties7(product.properties7 ? product.properties7 : "");
      setProperties8(product.properties8 ? product.properties8 : "");
      setValue1(product.value1 ? product.value1 : "");
      setValue2(product.value2 ? product.value2 : "");
      setValue3(product.value3 ? product.value3 : "");
      setValue4(product.value4 ? product.value4 : "");
      setValue5(product.value5 ? product.value5 : "");
      setValue6(product.value6 ? product.value6 : "");
      setValue7(product.value7 ? product.value7 : "");
      setValue8(product.value8 ? product.value8 : "");
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      router.push('/admin/ecommerce/products');
      toast.success("Product added successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, product.id, productID]);

  useEffect(() => {
    const previews = filespdf.map(fileItem => URL.createObjectURL(fileItem.file));
    setPdfsPreview(previews);

    // Cleanup URLs after component unmounts
    return () => previews.forEach(preview => URL.revokeObjectURL(preview));
  }, [filespdf]);


  const submitHandler = (data, e) => {
    var productDetails1;
    if (property) {
      productDetails1 = JSON.stringify(property)

    } else {
      productDetails1 = JSON.stringify(productSpecification);
    }

    var variations1;
    if (variation) {
      variations1 = JSON.stringify(variation)

    } else {
      variations1 = JSON.stringify(productTableVariation);
    }



    e.preventDefault();

    if (filesimade.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("original_price", original_price);
    formData.set("discount", discount);
    formData.set("gst", gst);
    formData.set("gstPrice", getGstAmount(getDiscount(original_price, discount), gst) - getDiscount(original_price, discount));
    formData.set("sale_price", getGstAmount(getDiscount(original_price, discount), gst));
    formData.set("description", description);
    formData.set("category", categoryName);
    formData.set("stock", stock);
    formData.set("seller", seller);
    formData.set("bulk_qty", bulk_qty);
    formData.set("productDetails", productDetails1);
    formData.set("variations", variations1);
    formData.set("code", code);
    formData.set("properties1", properties1);
    formData.set("value1", value1);
    formData.set("properties2", properties2);
    formData.set("value2", value2);
    formData.set("properties3", properties3);
    formData.set("value3", value3);
    formData.set("properties4", properties4);
    formData.set("value4", value4);
    formData.set("properties5", properties5);
    formData.set("value5", value5);
    formData.set("properties6", properties6);
    formData.set("value6", value6);
    formData.set("properties7", properties7);
    formData.set("value7", value7);
    formData.set("properties8", properties8);
    formData.set("value8", value8);


    filesimade.forEach(file => {
      formData.append('file', file.file);
    });

    filespdf.forEach(file => {
      formData.append('pdf', file.file);
    });

    dispatch(newProduct(formData));
    reset();

  };

  // const onChange = (event) => {
  //   const file = event.target.files;
  //   setFile(file);
  //   setOldImages("");

  //   if (event.target.name === "file") {
  //     if (file.length === 0) {
  //       window.alert("Please select a product images/video");
  //       return false;
  //     }
  //     for (let i = 0; i < file.length; i++) {
  //       if (file[i].type !== "image/png" && file[i].type !== "image/jpg" && file[i].type !== "image/jpeg" && file[i].type !== "image/gif") {
  //         window.alert("File does not support. You must use .png, .jpg. .Gif ");
  //         return false;
  //       }
  //       if (file[i].size > 25000000) {
  //         window.alert("Please upload a image smaller than 25 MB");
  //         return false;
  //       }
  //     }
  //   }

  //   const files = Array.from(event.target.files);
  //   setImagesPreview([]);
  //   setImages([]);

  //   files.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setImagesPreview((oldArray) => [...oldArray, reader.result]);
  //         setImages((oldArray) => [...oldArray, reader.result]);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const handleAdd = (newFiles) => {
  //   newFiles = newFiles.filter(
  //     (file) => !files.find((f) => f.data === file.data)
  //   );
  //   setFiles([...files, ...newFiles]);
  // };

  // const handleDelete = (deleted) => {
  //   setFiles(files.filter((f) => f !== deleted));
  // };

  return (
    <Contentlayout>

      <PageHeader title="Add Product" item="Ecommerce" active_item="Add Product" />

      <div>
        {/* <!-- Row --> */}
        <Row className="row-sm">
          <Col lg={12} md={12}>
            <Form onSubmit={handleSubmit(submitHandler)}>

              <Card className="custom-card">
                <Card.Body>
                  <div className='row'>
                    <div className='col-8'>
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Product Name</Form.Label>
                        <input type="text" className="form-control"
                          id="name_field"
                          name="name"
                          {...register("name",
                            { required: productID ? false : "Please enter the product name" })}
                          onInvalid={() => {
                            trigger("name");
                          }}
                          value={name}
                          onChange={(e) => setName(e.target.value)} />
                        {errors.name && (
                          <small className="text-danger">{errors.name.message}</small>
                        )}
                      </FormGroup>
                    </div>
                    {/* <div className='col-4'>
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Product Code (if available)</Form.Label>
                        <select
                          id="category_field"
                          className="form-control select2-no-search"
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
                      </FormGroup>

                    </div> */}
                  </div>
                  <FormGroup className="form-group">
                    <Form.Label className="tx-medium">Category <small>(<Link href="/admin/ecommerce/category" target="_blank">Click here to add new categories</Link>)</small></Form.Label>
                    <select className="form-control select2-no-search"
                      id="category_field"
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
                  </FormGroup>
                  <div className="row">
                    {/* Price */}
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Price</Form.Label>
                        <input type="text" className="form-control"
                          id="price_field"
                          onWheel={(event) => event.currentTarget.blur()}
                          name="price_field"
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
                      </FormGroup>
                    </div>

                    {/* Discount in Percentage */}
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Discount (%)</Form.Label>
                        <input type="text" className="form-control" placeholder="Discount (%)"
                          onWheel={(event) => event.currentTarget.blur()}
                          id="discount_field"
                          name="discount_field"
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
                      </FormGroup>
                    </div>

                    {/* Tax Rate GST (%) */}
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Tax Rate GST (%)</Form.Label>
                        <input type="text" className="form-control" placeholder="Tax Rate GST (%)"
                          onWheel={(event) => event.currentTarget.blur()}
                          id="gst_field"
                          name="gst_field"
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
                      </FormGroup>
                    </div>

                    {/* Final Price */}
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Final Price</Form.Label>
                        <input type="text" className="form-control" placeholder="Final Price"
                          onWheel={(event) => event.currentTarget.blur()}
                          id="sale_price_field"
                          value={getGstAmount(getDiscount(original_price, discount), gst)}
                          onChange={(e) => setSale_price(e.target.value)}
                          readOnly
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className='row'>
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Stock</Form.Label>
                        <input type="text" className="form-control" placeholder="Stock Quantity"
                          onWheel={(event) => event.currentTarget.blur()}
                          id="stock_field"
                          name="stock_field"
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
                      </FormGroup>
                    </div>

                    {/* Final Price */}
                    <div className="col">
                      <FormGroup className="form-group">
                        <Form.Label className="tx-medium">Minimum Bulk Quantity</Form.Label>
                        <select
                          id="bulk_qty_filed"
                          className="form-control"
                          placeholder="Select minimum order quantity..."
                          value={bulk_qty}
                          onChange={(e) => setBulk_qty(e.target.value)}
                        >
                          <option value="0">Select minimum order quantity...</option>
                          {Array.from({ length: 300 }, (_, index) => index + 1).map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="ql-wrapper ql-wrapper-demo border p-1 mb-3">

                    <div className="form-group">
                      <Form.Label className="tx-medium">Product Description</Form.Label>

                      <textarea
                        name="description_field"
                        placeholder={"Enter the product features. Use new lines for each bullet point"}
                        className="form-control invalid"
                        rows="8"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {/* <div id="quillEditor">
                      <Editer onContentChange={handleContentChange} description={description} />
                    </div> */}
                  </div>

                  <Form.Label className="tx-medium">Upload Images</Form.Label>
                  <div className="p-4 border rounded-6 mb-0 form-group">
                    <div>
                      <FilePond className='mt-3 mb-5 mt-lg-0'
                        files={filesimade}
                        allowReorder={true}
                        allowMultiple={true}
                        onupdatefiles={setFilesimage}
                        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                      />
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
                        <img key={img} src={`/uploads/images/${img.imageName}`} alt={img.imageName} className="mt-3 mr-2" width="75" height="75" />
                      ))}
                    </div>
                  </div>

                  <Form.Label className="tx-medium">Upload PDFs</Form.Label>
                  <div className="p-4 border rounded-6 mb-0 form-group">
                    <div>
                      <FilePond className='mt-3 mb-5 mt-lg-0'
                        files={filespdf}
                        allowReorder={true}
                        allowMultiple={true}
                        onupdatefiles={setFilespdf}
                        labelIdle='Drag & Drop your PDF files or <span class="filepond--label-action">Browse</span>'
                        acceptedFileTypes={['application/pdf']}
                      />
                      {pdfsPreview.map((pdf, index) => (
                        <div key={index} className="mt-3 mr-2">
                          <a href={pdf} target="_blank" rel="noopener noreferrer">PDF {index + 1}</a>
                        </div>
                      ))}

                      {oldPdfs && oldPdfs.map(pdf => (
                        <div key={pdf} className="mt-3 mr-2">
                          <a href={`/uploads/pdfs/${pdf.pdfName}`} target="_blank" rel="noopener noreferrer">{pdf.pdfName}</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='mt-5'>
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header><span className='text-primary '>Product Specification Details</span></Accordion.Header>
                        <Accordion.Body>
                          {productField ? (
                            <div className="row-fluid">
                              <FiledView1 productField={productField && productField} />
                            </div>
                          ) : (
                            <div className="row-fluid">
                              <FiledView />
                            </div>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header><span className='text-primary '>Product Variations</span></Accordion.Header>
                        <Accordion.Body>
                          <p className='my-2'>Please add a product table with the first row as the header, and each subsequent row containing product details.</p>

                          {productFieldVariation ? (
                            <div className="row-fluid">
                              <FiledTableVariationsView1 productFieldVariation={productFieldVariation && productFieldVariation} />
                            </div>
                          ) : (
                            <div className="row-fluid">
                              <FiledTableVariationsView />
                            </div>
                          )}
                        </Accordion.Body>


                        {/* <Accordion.Body>
                          <div className="form-group">
                            <label htmlFor="code_field">Product Code <a href="javascript:void(0)">(<small>Please fill up the common code for similar product</small>)</a></label>
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
                              <label className="mt-3" htmlFor="headinf1">Property 1</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Enter property name (e.g., color, size)"
                                    name="properties"
                                    value={properties1}
                                    onChange={(e) => setProperties1(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 1"
                                    name="value"
                                    value={value1}
                                    onChange={(e) => setValue1(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf2">Property 2</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Enter property name (e.g., color, size)"
                                    name="properties"
                                    value={properties2}
                                    onChange={(e) => setProperties2(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 2"
                                    name="value"
                                    value={value2}
                                    onChange={(e) => setValue2(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf3">Property 3</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Enter property name (e.g., color, size)"
                                    name="properties"
                                    value={properties3}
                                    onChange={(e) => setProperties3(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 3"
                                    name="value"
                                    value={value3}
                                    onChange={(e) => setValue3(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="mt-3" htmlFor="headinf1">Property 4</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Property 4"
                                    name="properties"
                                    value={properties4}
                                    onChange={(e) => setProperties4(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 4"
                                    name="value"
                                    value={value4}
                                    onChange={(e) => setValue4(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf2">Property 5</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Property 5"
                                    name="properties"
                                    value={properties5}
                                    onChange={(e) => setProperties5(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 5"
                                    name="value 5"
                                    value={value5}
                                    onChange={(e) => setValue5(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf3">Property 6</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Property 6"
                                    name="properties"
                                    value={properties6}
                                    onChange={(e) => setProperties6(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 6"
                                    name="value 6"
                                    value={value6}
                                    onChange={(e) => setValue6(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf3">Property 7</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Property 7"
                                    name="properties"
                                    value={properties7}
                                    onChange={(e) => setProperties7(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 7"
                                    name="value 7"
                                    value={value7}
                                    onChange={(e) => setValue7(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="mt-3" htmlFor="headinf3">Property 8</label>
                              <div className="row sizeProduct">
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="Property 8"
                                    name="properties"
                                    value={properties8}
                                    onChange={(e) => setProperties8(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-5 wid">
                                  <input
                                    type="text"
                                    className="form-control required upperCase"
                                    placeholder="value 8"
                                    name="value 8"
                                    value={value8}
                                    onChange={(e) => setValue8(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Accordion.Body> */}
                      </Accordion.Item>

                    </Accordion>
                  </div>

                </Card.Body>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary me-1">
                    Add Product
                  </button>
                </div>

              </Card>
            </Form>
          </Col>
        </Row>
        {/* <!-- End Row --> */}
      </div>
    </Contentlayout>
  )
}

AddProduct.layout = "Contentlayout"


export default AddProduct