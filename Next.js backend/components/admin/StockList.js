import React, { Fragment, useEffect, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { MDBDataTable } from 'mdbreact';
import Link from 'next/link';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, clearErrors, deleteProduct } from '../../redux/actions/productActions';
import { DELETE_PRODUCT_RESET } from '../../redux/constants/productConstants';
import { Buffer } from 'buffer';

const ProductsList = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);

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
            toast.success("Product deleted successfully");
            router.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [dispatch, error, deleteError, isDeleted]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    // Memoize the expensive operation of generating table data
    const setProducts = useMemo(() => {
        return () => {
            return {
                columns: [
                    { label: 'ID', field: 'id', sort: 'asc' },
                    { label: 'Name', field: 'name', sort: 'asc' },
                    { label: 'Price', field: 'price', sort: 'asc' },
                    { label: 'Stock', field: 'stock', sort: 'asc' },
                    { label: 'Actions', field: 'actions' }
                ],
                rows: products
                    .filter(product => product.stock === 0)
                    .map(product => {
                        const EID = Buffer.from(`${product.id}`, 'binary').toString('base64');
                        return {
                            id: EID,
                            name: product.name,
                            price: `₹${(product.sale_price)?.toFixed(2)}`,
                            stock: product.stock,
                            actions: (
                                <Fragment>
                                    <Link href={`/admin/products/${EID}`} className="btn btn-primary py-1 px-2">
                                        <i className="fa fa-pencil"></i>
                                    </Link>
                                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(EID)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </Fragment>
                            )
                        };
                    })
            };
        };
    }, [products]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5 heading">Stockouts Products</h1>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                scrollX
                            />
                        )}
                    </Fragment>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default ProductsList;
