import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrder, returnOrder, myOrders, invoicePdf, clearErrors } from '../../redux/actions/orderActions'
import Dialog1 from "../Dialog1";
import Dialog2 from "../Dialog2";
import { CANCEL_ORDER_RESET, RETURN_ORDER_RESET } from '../../redux/constants/orderConstants'
import { cancelReason } from '../Dialog1'
import { returnReason } from '../Dialog2'
import { Buffer } from 'buffer'

const ListOrders = () => {
    const router = useRouter()

    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.myOrders);
    const { isCancel } = useSelector(state => state.cancel)
    const { isReturn } = useSelector(state => state.return)

    useEffect(() => {
        dispatch(myOrders());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (isCancel) {
            toast.success("Product cancel successfully");
            router.push('/orders');
            dispatch({ type: CANCEL_ORDER_RESET })
        }

        if (isReturn) {
            toast.success("Product return successfully");
            router.push('/orders/return');
            dispatch({ type: RETURN_ORDER_RESET })
        }
    }, [dispatch, router.push, toast, error, isCancel, isReturn])

    const orderInvoiceHandler = (id, order_date) => {
        dispatch(invoicePdf(id, order_date));
    }

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: "",
        cancel: ""
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
    const cancelOrderHandler = (id, name) => {
        handleDialog("Are you sure you want to cancel order?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            const formData = new FormData();
            formData.set('reason', cancelReason());
            var object = {};
            formData.forEach((value, key) => object[key] = value);
            var json = object
            dispatch(cancelOrder(dialog.id, json));
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    //reurn order
    const [dialog1, setDialog1] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: "",
        cancel: ""
    });

    const handleDialog1 = (message, isLoading, nameProduct, id) => {
        setDialog1({
            message,
            isLoading,
            //Update
            nameProduct,
            id
        });
    };
    const returnOrderHandler = (id, name) => {
        handleDialog1("Are you sure you want to return order?", true, name, id);
    }

    const areUSureDelete1 = (choose) => {
        if (choose) {
            const formData = new FormData();
            formData.set('reason', returnReason());
            var object = {};
            formData.forEach((value, key) => object[key] = value);
            var json = object
            dispatch(returnOrder(dialog1.id, json));
            handleDialog1("", false);
        } else {
            handleDialog1("", false);
        }
    }



    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Orders Name',
                    field: 'name',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Order Date',
                    field: 'date',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Payment',
                    field: 'payment',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Delivery Status',
                    field: 'status',
                    sort: 'asc',
                    width: 150
                },
                // {
                //     label: 'Delivered Date',
                //     field: 'delivered_date',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
                    width: 150
                }

            ],
            rows: []
        }
        orders && orders.forEach(order => {
            const EID = Buffer.from(`${order.id}`, 'binary').toString('base64')
            if (order.paymentStatus) {
                data.rows.push({
                    id: order.order_id,
                    name: <Link className='proda' href={`/product-details/${Buffer.from(order.product_id.toString(), 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName + " Qty(" + order.quantity + ")"}</Link>,
                    status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                        ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                        : <p style={{ color: 'red' }}>{String(order.paymentStatus).includes('Success') ? order.orderStatus : "-"}</p>,
                    price: `${order.sale_price}`,
                    payment: order.paymentStatus && String(order.paymentStatus).includes('Success')
                        ? <p style={{ color: 'green' }}>{order.paymentStatus}</p>
                        : <p style={{ color: 'red' }}>{order.paymentStatus ? order.paymentStatus : "NOT PAID"}</p>,
                    date: new Date(order.order_date).toLocaleDateString('en-IN'),
                    // delivered_date: String(order.delivered_date).substring(0, 10),
                    actions:
                        <Fragment>
                            <Link href={`/orders/${EID}`} passHref>
                                <a className="btn btn-success py-2 px-3">
                                    <i className="fa fa-eye"></i>
                                </a>
                            </Link>
                            {String(order.paymentStatus).includes('Success') && (
                                <>
                                    <button className="btn btn-primary py-2 px-3 ml-2" title="Print" onClick={() => orderInvoiceHandler(EID, order.order_date)}>
                                        <i className="fa fa-print" aria-hidden="true"></i>
                                    </button>
                                    {order.orderStatus === 'Delivered' ? (
                                        <button
                                            className="btn py-2 px-3 mt-1 ml-2"
                                            title="You only have 7 days to exchange the item or receive a refund."
                                            onClick={() => returnOrderHandler(EID, order.productName)}
                                            disabled={(new Date() - new Date(order.order_date)) / 86400000 > 7}
                                        >
                                            <span>Return</span>
                                        </button>
                                    ) : (
                                        <button className="btn btn-danger py-2 px-3 mt-1 ml-2" onClick={() => cancelOrderHandler(EID, order.productName)}>
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </>
                            )}
                            <style jsx>{`
                      .btn {
                        padding: 0.5rem 1rem;
                        border: none;
                        background-color: #007bff;
                        color: #fff;
                        cursor: pointer;
                        border-radius: 0.25rem;
                      }
              
                      .btn:hover {
                        background-color: #0056b3;
                      }
              
                      .btn[disabled] {
                        cursor: not-allowed;
                        opacity: 0.5;
                      }
                    `}</style>
                        </Fragment>
                })
            }
        })
        return data;
    }
    return (
        <Fragment>
            <MetaData title={'My Orders'} />
            <div class="container button-container my-5">
                <Link href={'/orders'} className='btn btn-success menuorder'>My Orders</Link>
                <Link href={'/orders/cancel'} className='btn btn-success menuorder heading'>Cancel Orders</Link>
                <Link href={'/orders/return'} className='btn btn-success menuorder heading'>Return Orders</Link>
            </div>
            {loading ? <Loader /> : (
                <MDBDataTable
                    data={setOrders()}
                    className='cust-table px-md-5 mt-20 mr-2 ml-2'
                    bordered
                    striped
                    hover scrollX
                />)}
            {dialog.isLoading && (
                <Dialog1
                    //Update
                    nameProduct={dialog.nameProduct}
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.id}
                />
            )
            }

            {dialog1.isLoading && (
                <Dialog2
                    //Update
                    nameProduct={dialog1.nameProduct}
                    onDialog={areUSureDelete1}
                    message={dialog1.message}
                    id={dialog1.id}
                />
            )
            }
        </Fragment >
    )
}

export default ListOrders
