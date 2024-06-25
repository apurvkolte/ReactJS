import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, updateOrder } from '../../redux/actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../redux/constants/orderConstants'
import { Buffer } from 'buffer'

const ProcessOrder = () => {
    const router = useRouter()

    const [status, setStatus] = useState('');

    const dispatch = useDispatch();
    const { loading, error1, order } = useSelector(state => state.orderDetails)
    // const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const { error, isUpdated } = useSelector(state => state.order)
    const orderId = router.query.id;

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
        if (error) {
            toast.error(error);
        }
        if (error1) {
            toast.error(error1);
        }
        if (isUpdated) {
            toast.success('Order updated successfully');
            router.push('/admin/orders');
            dispatch({ type: UPDATE_ORDER_RESET })
        }
    }, [dispatch, toast, error, error1, isUpdated, orderId])

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object

        dispatch(updateOrder(id, json))
    }

    const shippingDetails = order &&
        `${order.flat ? order.flat + ',' : ""} ${order.area ? order.area + ',' : ""} ${order.landmark ? order.landmark + ',' : ""}
    ${order.city ? order.city + ',' : ""} ${order.state ? order.state + ',' : ""} ${order.country ? order.country + ',' : ""} ${order.postalCode ? order.postalCode + '.' : ""} `
    const isPaid = order && order.paymentStatus === 'Success' ? true : false

    return (
        <Fragment>
            <MetaData title={`Process Order # ${order && order.id}`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>

                {order && order.paymentStatus && (<div className="col-12 col-md-10">
                    <Fragment>
                        {loading ? <Loader /> : (
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">

                                    <h2 className="my-5">Order # {order.order_id}</h2>
                                    <h4 className="my-4">Order Items:</h4>
                                    <hr />
                                    <div className="cart-item my-1">
                                        {/* {orderItems && orderItems.map(item => ( */}
                                        <div key={order.product} className="row my-5">
                                            <div className="col-4 col-lg-2">
                                                <img src={`/uploads/product/${order.path}`} alt={order.productName} height="90" width="115" />
                                            </div>
                                            <div className="col-5 col-lg-5 ml-4">
                                                <Link href={`/product-details/${Buffer.from(`${order.product_id}`, 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName}</Link>
                                            </div>
                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p>&#8377;{order && Number(order.sale_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{order.quantity} Piece(s)</p>
                                            </div>
                                        </div>
                                        {/* ))} */}
                                    </div>
                                    <hr />

                                    <h4 className="mb-4">Shipping Info</h4>
                                    <p><b>Name:</b> {order && order.billing_name}</p>
                                    <p><b>Phone:</b> {order && order.mobile}</p>
                                    <p><b>Address:</b> {shippingDetails}</p>
                                    {/* <p><b>Bulk Purchase:</b> &#8377;{order.totalPrice}</p> */}
                                    <p><b>Total Amount:</b> &#8377;{Number(order.sale_price * order.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    {order.gstn ? <p><b>GSTN No:</b> {order.gstn} </p> : ""}
                                    <hr />

                                    <h4 className="my-4">Payment</h4>
                                    <p className={isPaid ? "greenColor" : "redColor"}><b>{isPaid ? "PAID" : "NOT PAID"}</b></p>
                                    <hr />

                                    <h4 className="my-4">Order Status:</h4>
                                    <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{order.orderStatus}</b></p>
                                    <hr />

                                    <h4 className="my-4">Applied Coupon Code</h4>
                                    <p><b>{order && (order.coupon_code ? order.coupon_code + ",  Reedem Price - " + order.redeem : "Not")}</b></p>
                                    <hr />

                                    <h4 className="my-4">Reference No</h4>
                                    <p><b>{order && order.bank_ref_no}</b></p>
                                    <hr />

                                    <h4 className="my-4">Tracking ID</h4>
                                    <p><b>{order && order.tracking_id}</b></p>
                                    <hr />

                                    <h4 className="my-4">Payment Mode</h4>
                                    <p><b>{order && order.payment_mode + " (" + order.card_name + ")"}</b></p>
                                    <hr />


                                    <h4 className="my-4">List of Products Buying</h4>
                                    <p><b>{order && order.shop_length}</b></p>
                                    <hr />

                                </div>

                                <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancel">Cancel</option>
                                            <option value="Return">Return</option>
                                            <option value="Return Approved">Return Approved</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block" onClick={() => updateOrderHandler(Buffer.from(order.id.toString(), 'binary').toString('base64'))}>
                                        Update Status
                                    </button>
                                </div>

                            </div>
                        )}
                    </Fragment>
                </div>)}
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default ProcessOrder
