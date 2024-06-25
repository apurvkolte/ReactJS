import React, { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails } from '../../redux/actions/orderActions'
import { Buffer } from 'buffer'

const OrderDetails = () => {
    const router = useRouter();

    const dispatch = useDispatch()
    const { loading, error1, order } = useSelector(state => state.orderDetails)
    // if (order) {
    //     console.log("orders", order);
    // }
    useEffect(() => {
        dispatch(getOrderDetails(router.query.id));
        if (error1) {
            toast.error(error1);
        }
    }, [dispatch, toast, error1])

    const shippingDetails = order && `${order.flat ? order.flat + ',' : ""} ${order.area ? order.area + ',' : ""} ${order.landmark ? order.landmark + ',' : ""}
                            ${order.city ? order.city + ',' : ""} ${order.state ? order.state + ',' : ""} ${order.country ? order.country + ',' : ""} ${order.postalCode ? order.postalCode + '.' : ""} `

    const isPaid = order && order.paymentStatus === 'Success' ? true : false
    return (
        <Fragment>
            <MetaData title={'Order Details'} />
            {loading ? <Loader /> : (
                <Fragment>
                    {order && order.paymentStatus && (<div className="row px-md-5 d-flex justify-content-between">
                        <div className=" px-md-5 mt-20 mr-5 col-12 col-lg-8 mt-5 order-details">
                            <h1 className="">Order # {order.order_id}</h1>
                            <h4 className="my-4 heading">Order Items:</h4>
                            <hr />
                            <div className="cart-item my-1">
                                <div key={order.path} className="row my-5">
                                    <div className="col-4 col-lg-2">
                                        <img src={`/uploads/product/${order.path}`} alt={order.productName} height="90" width="115" />
                                    </div>
                                    <div className="col-5 col-lg-5">
                                        <Link href={`/product-details/${Buffer.from(`${order.product_id}`, 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName}</Link>
                                    </div>
                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p>&#8377;{order && Number(order.sale_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                        <p>{order.quantity} Piece(s)</p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {order && order.billing_name} </p>
                            <p><b>Phone:</b> {order && order.mobile} </p>
                            <p><b>Address:</b> {shippingDetails}</p>
                            {/* <p><b>Subtotal Purchase:</b> &#8377; {order.totalPrice}</p> */}
                            <p><b>Total Amount:</b> &#8377; {Number(order.sale_price * order.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                            {order.gstn ? <p><b>GSTN No:</b> {order.gstn} </p> : ""}
                            <hr />
                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? "greenColor" : "redColor"} ><b>{isPaid ? "PAID" : "NOT PAID"}</b></p>
                            <hr />

                            <h4 className="my-4">Order Status:</h4>
                            <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{String(order.paymentStatus).includes('Success') ? order.orderStatus : "-"}</b></p>
                            <hr />
                        </div>
                    </div>)}
                </Fragment>
            )}
            <ToastContainer />
        </Fragment>
    )
}

export default OrderDetails
