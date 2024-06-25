import React, { Fragment, useState, useEffect, useMemo } from 'react'
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../layout/MetaData'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
const ProductReviewsList = dynamic(() => import('./ProductReviewsList'));
const MemoizedProductReviewsList = React.memo(ProductReviewsList);
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getProductReviews, deleteReview } from '../../redux/actions/productActions'
import { DELETE_REVIEW_RESET, TOP_PRODUCT_RESET } from '../../redux/constants/productConstants'
import Dialog from "../Dialog";
import { Buffer } from 'buffer'

const ProductReviews = () => {
    const [productId, setProductId] = useState('')

    const dispatch = useDispatch();
    const router = useRouter()

    const { error, reviews } = useSelector(state => state.productReviews);
    const { isDeleted, error: deleteError } = useSelector(state => state.review)
    useEffect(() => {
        if (error) {
            toast.error(error);
        }

        if (deleteError) {
            toast.error(deleteError);
        }

        if (productId !== '') {
            dispatch(getProductReviews(productId))
        }

        if (isDeleted) {
            toast.success('Review deleted successfully');
            dispatch({ type: DELETE_REVIEW_RESET })
        }

    }, [dispatch, toast, error, productId, isDeleted, deleteError])

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const productRev = useMemo(() => <MemoizedProductReviewsList />, []);
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

    const deleteReviewHandler = (id, name) => {
        handleDialog("Are you sure you want to delete review?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(deleteReview(dialog.id, productId))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getProductReviews(Buffer.from(`${productId}`, 'binary').toString('base64')))
    }


    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 150
                },
            ],
            rows: []
        }

        reviews.forEach(review => {
            const EID = Buffer.from(review.id.toString(), 'binary').toString('base64')
            data.rows.push({
                id: EID,
                rating: review.rating,
                comment: review.comments,
                user: review.name,
                actions:
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteReviewHandler(EID, review.name)}>
                        <i className="fa fa-trash"></i>
                    </button>
            })
        })

        return data;
    }


    return (
        <Fragment>
            <MetaData title={'Product Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className='row'>
                                        <div className='col-12 col-md-10'>
                                            <div className="form-group">
                                                <label htmlFor="productId_field ">Enter Product ID</label>
                                                <input
                                                    type="text"
                                                    id="productId_field"
                                                    className="form-control"
                                                    value={productId}
                                                    onChange={(e) => setProductId(e.target.value)}
                                                />
                                            </div>

                                        </div>

                                        {/* <div className='col-12 col-md-1 py-4'>
                                            <button
                                                id="search_button"
                                                type="submit"
                                                className="btn d-flex justify-content-center btn-block py-2"
                                            >
                                                SEARCH
                                            </button>
                                        </div> */}
                                    </div>
                                </ form>
                            </div>

                            {reviews ? <div className='text-secondary ml-3'><br /><h5>Total no of review : {reviews.length}</h5> </div> : ""}
                        </div>

                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover scrollX
                            />
                        ) : (
                            <p className="mt-5 text-center">★*・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜No Reviews・*:.。.*.。.:*・☆・゜・*:.。.:*・☆・゜・*:.。.*.。.:*・゜・*.★</p>
                        )}

                    </Fragment>
                    {productRev}
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

export default ProductReviews
