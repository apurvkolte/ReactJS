import React, { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import { Buffer } from 'buffer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, clearErrors, deleteProduct, topProduct } from '../../redux/actions/productActions';
import { DELETE_PRODUCT_RESET, TOP_PRODUCT_RESET } from '../../redux/constants/productConstants';
import "jspdf-autotable";
import Dialog from '../Dialog';
import { CSVLink } from 'react-csv';

const ProductsList = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);
    const { isTop } = useSelector(state => state.topProducts);

    const [dialog, setDialog] = useState({ message: "", isLoading: false, nameProduct: "" });

    const handleDialog = useCallback((message, isLoading, nameProduct, id) => {
        setDialog({ message, isLoading, nameProduct, id });
    }, []);

    const topProductHandler = useCallback((id) => {
        dispatch(topProduct(id));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            toast.success("Product has been deleted");
            router.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        if (isTop) {
            router.push('/admin/products');
            toast.success('Top product has been updated successfully');
            dispatch({ type: TOP_PRODUCT_RESET });
        }
    }, [dispatch, error, deleteError, isDeleted, isTop, router]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const csvData = useMemo(() => products ? JSON.parse(JSON.stringify(products)) : [], [products]);

    const setProducts = useCallback(() => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc', width: 100 },
                { label: 'Name', field: 'name', sort: 'asc', width: 400 },
                { label: 'Product Code', field: 'product_code', sort: 'asc', width: 100 },
                { label: 'Price', field: 'price', sort: 'asc', width: 100 },
                { label: 'Stock', field: 'stock', sort: 'asc', width: 100 },
                { label: 'Top Product', field: 'top', width: 100 },
                { label: 'Actions', field: 'actions', width: 120 },
            ],
            rows: []
        };

        if (products) {
            products.forEach(product => {
                const EID = Buffer.from(`${product.id}`, 'binary').toString('base64');
                data.rows.push({
                    id: <Link className='proda' href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>{EID}</Link>,
                    name: product.name,
                    product_code: product.product_code || "",
                    price: `RS ${(product.sale_price).toFixed()}`,
                    stock: product.stock,
                    top: (
                        <Fragment>
                            {product.main === 1 ? (
                                <button className="btn-light text-dark py-2 px-2 ml-2" title="Click to remove from top products" onClick={() => topProductHandler(EID)} >
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                </button>
                            ) : (
                                <button className="btn-light text-dark py-2 px-2 ml-2" title="Click to view on top products" onClick={() => topProductHandler(EID)} >
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                </button>
                            )}
                        </Fragment>
                    ),
                    actions: (
                        <Fragment>
                            <button key={EID} onClick={() => { window.location.href = `/admin/products/${EID}` }} className="btn btn-primary py-1 px-2">
                                <i className="fa fa-pencil"></i>
                            </button>
                            <button className="btn btn-danger bg-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(EID, product.name)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    )
                });
            });
        }
        return data;
    }, [products, topProductHandler]);

    const deleteProductHandler = useCallback((id, name) => {
        handleDialog("Are you sure you want to delete product?", true, name, id);
    }, [handleDialog]);

    const areUSureDelete = useCallback((choose) => {
        if (choose) {
            dispatch(deleteProduct(dialog.id));
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }, [dispatch, dialog.id, handleDialog]);

    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        setList(prevState => ({ display: prevState.display === "block" ? "none" : "block" }));
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}><i className="fa fa-bars" aria-hidden="true"></i></button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2 heading">All Products</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mr-2 mt-5 px-md-2">
                            <CSVLink className='menuorder' data={csvData} filename={"product.csv"} target="_blank">Download</CSVLink>
                        </h5>
                        <br />
                        <br />
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
                                className="cust-table px-3"
                                bordered
                                striped
                                hover
                                scrollX
                            />
                        )}
                    </Fragment>
                    {dialog.isLoading && (
                        <Dialog
                            nameProduct={dialog.nameProduct}
                            onDialog={areUSureDelete}
                            message={dialog.message}
                            id={dialog.id}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default ProductsList;
