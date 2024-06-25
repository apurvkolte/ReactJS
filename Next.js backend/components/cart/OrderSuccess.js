import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MetaData from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { removeItemFromCart, removeBuyItem } from '../../redux/actions/cartActions'
import { myOrders } from '../../redux/actions/orderActions'
import Loader from "../layout/Loader";
import { Buffer } from 'buffer'


const OrderSuccess = () => {
    const router = useRouter()
    const { query } = router;

    const dispatch = useDispatch();
    var { cartItems } = useSelector(state => state.cart);
    var { buyItem } = useSelector(state => state.buy);
    const { orders } = useSelector(state => state.myOrders);
    cartItems = JSON.parse(window.localStorage.getItem('cartItems'))
    buyItem = JSON.parse(window.localStorage.getItem('buyItem')) ? JSON.parse(window.localStorage.getItem('buyItem')) : 0


    const orderId = query.orderId
    const message = query.message

    let id;
    let paymentStatus;
    let orderAmount;

    if (orders) {
        orders.map((item) => {
            if (item.order_id === orderId) {
                id = item.order_id
                paymentStatus = item.paymentStatus
                orderAmount = item.totalPrice
            }
        })
    }

    useEffect(() => {
        dispatch(myOrders());


        return () => {
            setTimeout(orderSuccess, 0)
        }

    }, [])

    const handleOrdersClick = () => {
        router.push('/orders');
    };

    const handleSGSROClick = () => {
        router.push('/');
    };

    function orderSuccess() {
        //check if buy item not add
        if (buyItem) {
            buyItem.map(item => (
                dispatch(removeBuyItem(Buffer.from((item.product).toString(), 'binary').toString('base64')))))
        } else {
            cartItems.map(item => (
                dispatch(removeItemFromCart(Buffer.from((item.product).toString(), 'binary').toString('base64')))))
        }
        sessionStorage.removeItem('orderInfo')
    }

    return (
        <div className="container-fluid">
            <Fragment>
                {orderId && (id === orderId) && (paymentStatus === 'Success') ? (
                    <Fragment>
                        <MetaData title={'Order Success'} />
                        <div className="row justify-content-center">
                            <div className="col-6 text-center">
                                {orderId && (id === orderId) && (paymentStatus === 'Success') ? (<Fragment>
                                    <img className="my-5 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />
                                    <h1>Your Order has been placed successfully.</h1><br />
                                    <h2>ORDER ID : {orderId ? orderId : '#'} </h2><br />
                                    <h2> Total Amount : ₹{orderAmount ? orderAmount : '#'} </h2>
                                    <div className="row d-flex justify-content-center align-items-center my-3">
                                        <div className="col-auto">
                                            <button onClick={handleOrdersClick} className="btn btn-primary mr-2">View Orders</button>
                                        </div>
                                        <div className="col-auto">
                                            <button onClick={handleSGSROClick} className="btn btn-primary">Continue shopping</button>
                                        </div>
                                    </div>
                                </Fragment>
                                ) : (<Fragment>
                                    <h2>Continue shopping on SGSRO .</h2><br />
                                    <div className='row d-inline-flex p-2'>
                                        <div className="ml-2 px-md-3">
                                            <button onClick={handleOrdersClick} className='btn btn-primary' >View Orders</button>
                                        </div>
                                        <div className="ml-2 px-md-3">
                                            <buttonon Click={handleOrdersClick} className='btn btn-primary'>Home</buttonon>
                                        </div>
                                    </div>
                                </Fragment>
                                )}

                            </div>
                        </div>

                    </Fragment >

                ) : (
                    <Loader />
                )
                }
            </Fragment >
        </div >
    )
}

export default OrderSuccess
