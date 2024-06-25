import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { cancelReturnOrder, myOrders, invoicePdf, clearErrors } from '../../redux/actions/orderActions'
import Dialog from "../Dialog";
import { CANCEL_RETURN_ORDER_RESET } from '../../redux/constants/orderConstants'
import { Buffer } from 'buffer'

const ListReturnOrders = () => {
    const router = useRouter()

    const dispatch = useDispatch();
    const { loading, error, returnOrders } = useSelector(state => state.myOrders);
    const { isCancelReturn } = useSelector(state => state.cancelReturn)

    // console.log("isCancel", isCancel);
    // if(orders){
    //     orders.forEach(order=>{
    //     console.log("orders",EID)
    //     console.log("orders",order.quantity)
    //     console.log("orders",order.totalPrice)
    //     console.log("orders",order.orderStatus)}
    //     )}
    useEffect(() => {
        dispatch(myOrders());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (isCancelReturn) {
            toast.success("Product cancel return orders successfully");
            router.push('/orders');
            dispatch({ type: CANCEL_RETURN_ORDER_RESET })
        }
    }, [dispatch, router.push, toast, error, isCancelReturn])

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
    const cancelReturnHandler = (id, name) => {
        handleDialog("Are you sure you want to cancel return order?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            const formData = new FormData();
            var object = {};
            formData.forEach((value, key) => object[key] = value);
            var json = object
            dispatch(cancelReturnOrder(dialog.id, json));
            handleDialog("", false);
        } else {
            handleDialog("", false);
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
        returnOrders && returnOrders.forEach(order => {
            if (order.paymentStatus) {
                const EID1 = Buffer.from(`${order.id.toString()}`, 'binary').toString('base64')
                data.rows.push({
                    id: order.order_id,
                    name: <Link className='proda' href={`/product-details/${Buffer.from(`${order.product_id}`, 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName + " Qty(" + order.quantity + ")"}</Link>,
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
                            <Link href={`/orders/${EID1}`} passHref>
                                <a className="btn btn-primary">
                                    <i className="fa fa-eye"></i>
                                </a>
                            </Link>
                            {String(order.paymentStatus).includes('Success') && (
                                <>
                                    <button className="btn btn-secondary ml-2" title='print' onClick={() => orderInvoiceHandler(EID1, order.order_date)}>
                                        <i className="fa fa-print" aria-hidden="true"></i>
                                    </button>
                                    {(new Date() - new Date(order.order_date)) / 86400000 <= 3 &&
                                        order.orderStatus !== "Return Approved" && (
                                            <button
                                                className="btn btn-danger mt-1 ml-2"
                                                disabled={order.orderStatus === "Delivered"}
                                                onClick={() => cancelReturnHandler(EID1, order.productName)}
                                            >
                                                <span>Cancel</span>
                                            </button>
                                        )
                                    }
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
                        text-decoration: none;
                      }
              
                      .btn:hover {
                        background-color: #0056b3;
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
                <Dialog
                    //Update
                    nameProduct={dialog.nameProduct}
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.id}
                />
            )
            }
            <ToastContainer />
        </Fragment >
    )
}

export default ListReturnOrders
