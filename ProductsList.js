import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'
import { Buffer } from 'buffer'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, clearErrors, deleteProduct, topProduct } from '../../redux/actions/productActions'
import { DELETE_PRODUCT_RESET, TOP_PRODUCT_RESET } from '../../redux/constants/productConstants'
import "jspdf-autotable";
import Dialog from "../Dialog";
import { CSVLink } from 'react-csv';

const ProductsList = () => {
    const router = useRouter()

    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);
    const { isTop } = useSelector(state => state.topProducts);
    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: ""
    });

    const handleDialog = (message, isLoading, nameProduct, id) => {
        setDialog({
            message,
            isLoading,
            //Update
            nameProduct,
            id
        });
    };

    const topProductHandler = (id) => {
        dispatch(topProduct(id))
    }

    useEffect(() => {
        dispatch(getAdminProducts());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors())
        }
        if (isDeleted) {
            toast.success("product has been deleted ");
            router.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

        if (isTop) {
            router.push('/admin/products');
            toast.success('Top product has been updated successfully');
            dispatch({ type: TOP_PRODUCT_RESET })
        }
    }, [dispatch, toast, error, deleteError, isDeleted, isTop])

    const csvData = JSON.parse(JSON.stringify(products ? products : []));

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 60,

                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 580,
                },
                {
                    label: 'Product Code',
                    field: 'product_code',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 120,
                },
            ],
            rows: []
        }
        if (products) {
            products.forEach(product => {
                const EID = Buffer.from(`${product.id}`, 'binary').toString('base64')
                data.rows.push({
                    id: <Link className='proda' href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>{EID}</Link>,
                    name: `${product.name}`,
                    product_code: `${product.product_code ? product.product_code : ""}`,
                    price: `RS ${(product.sale_price).toFixed()}`,
                    stock: product.stock,
                    actions: <Fragment>
                        <button key={EID} onClick={() => { window.location.href = `/admin/products/${EID}` }} className="btn py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(EID, product.name)}>
                            <i className="fa fa-trash"></i>
                        </button>

                        {product.main === 1 ? (<button className="btn btn-light  py-2 px-2 ml-2" title="Click to remove from top products" onClick={() => topProductHandler(EID)} >
                            <i className="fa fa-star" aria-hidden="true"></i>
                        </button>) : (
                            <button className="btn btn-light py-2 px-2 ml-2" title="Click to view on top products" onClick={() => topProductHandler(EID)} >
                                <i className="fa fa-star-o" aria-hidden="true"></i>
                            </button>
                        )}
                    </Fragment>
                })
            })
        }
        return data;
    }
    const deleteProductHandler = (id, name) => {
        handleDialog("Are you sure you want to delete product?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(deleteProduct(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        if (list.display === "block") {
            setList({ display: "none" })
        } else {
            setList({ display: "block" })
        }
    }

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}><i className="fa fa-bars" aria-hidden="true"></i></button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2 heading" >All Products</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mr-2 mt-5 px-md-2"> <CSVLink className='menuorder' data={csvData}
                            filename={"product.csv"} target="_blank" >Download</CSVLink></h5>
                        <br />
                        <br />
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
                                className="cust-table px-3"
                                bordered
                                striped
                                hover scrollX
                                exportToCSV
                            />
                        )}
                    </Fragment>
                    {/* <CSVButton  >Download me</CSVButton> */}
                </div>
                {dialog.isLoading && (
                    <Dialog
                        //Update
                        nameProduct={dialog.nameProduct}
                        onDialog={areUSureDelete}
                        message={dialog.message}
                        id={dialog.id}
                    />
                )}

            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default ProductsList
