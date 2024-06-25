import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, topProduct } from '../../redux/actions/productActions';
import { TOP_PRODUCT_RESET } from '../../redux/constants/productConstants';
import { Buffer } from 'buffer';

const ProductReviewsList = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { products } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    const topProductHandler = (id) => {
        dispatch(topProduct(id));
        toast.success('Top product has been updated successfully');
        dispatch({ type: TOP_PRODUCT_RESET });
    };

    const setProducts = React.useMemo(() => {
        const rows = [];
        if (products) {
            products.forEach(product => {
                const EID = Buffer.from(`${product.id}`, 'binary').toString('base64');
                rows.push({
                    id: <Link className='proda' href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>{EID}</Link>,
                    name: `${product.name}`,
                    ratings: `${product.ratings ? product.ratings : ""}`,
                    numOfReviews: product.numOfReviews,
                    top: product.top,
                    main: (
                        <button
                            className={`btn btn-success py-1 px-2 ml-2 ${product.main === 1 ? '' : 'text-dark'}`}
                            title={product.main === 1 ? 'Click to remove from top products' : 'Click to view on top products'}
                            onClick={() => topProductHandler(EID)}
                        >
                            <i className={`fa ${product.main === 1 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>
                        </button>
                    )
                });
            });
        }
        return {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc', width: 100 },
                { label: 'Name', field: 'name', sort: 'asc', width: 440 },
                { label: 'Ratings', field: 'ratings', sort: 'asc', width: 120 },
                { label: 'Reviews', field: 'numOfReviews', sort: 'asc', width: 120 },
                { label: 'Top Selling', field: 'top', width: 120 },
                { label: 'Top Products', field: 'main', width: 120 },
            ],
            rows,
        };
    }, [products]);

    return (
        <Fragment>
            <MetaData title={'Product Reviews'} />
            <div className="row">
                <div className='col-12 col-md-12'>
                    <br />
                    <br />
                    <h2 className='center d-inline-flex p-2 heading'>All Products</h2>
                    <br />
                    {products ? (
                        <MDBDataTable
                            data={setProducts}
                            className="cust-table px-3"
                            bordered
                            striped
                            hover
                            scrollX
                            exportToCSV
                        />
                    ) : null}
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default ProductReviewsList;
