import Link from "next/link";
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getAllUserCoupons } from '../../store/action/orderActions'
import { useDispatch, useSelector } from 'react-redux'
// import { myOrders } from '../../store/action/orderActions'
// import ReadMoreCoupon from './ReadMoreCoupon'
import { addItemToCart, saveShippingInfo } from '../../store/action/cartActions'
import { Buffer } from 'buffer'
import axios from "axios";


const ConfirmOrder = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [applyCoupon, setApplyCoupon] = useState();
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [coupon_code, setCoupon_code] = useState('');
    const [order_code, setOrder_code] = useState(1);
    const [redeem, setRedeem] = useState(0);
    const [description, setDescription] = useState();

    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        orderId: null,
        currency: null,
        amount: null,
    });

    const { cartItems } = useSelector(state => state.cart)
    const { buyItem, shippingInfo } = useSelector(state => state.buy)
    const { coupons } = useSelector(state => state.allUserCoupons);
    // const { error, orders } = useSelector(state => state.myOrders);

    const shop = buyItem.length ? buyItem : cartItems;

    useEffect(() => {
        // dispatch(getAllUserCoupons());
        // dispatch(myOrders());
        // updateStockCheck()

        // if (orders) {
        //     orders.forEach((or) => {
        //         if (or.coupon_code === applyCoupon) {
        //             setOrder_code(0);
        //         }
        //     })
        // }

        if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
            const savedShippingInfo = localStorage.getItem('shippingInfo');
            if (savedShippingInfo) {
                const parsedShippingInfo = JSON.parse(savedShippingInfo);
                dispatch(saveShippingInfo(parsedShippingInfo));
            }
        }
        if (cartItems.length) {
            cartItems.forEach((item) => {
                dispatch(addItemToCart(Buffer.from((item.product).toString(), 'binary').toString('base64'), item.quantity, item.cid))
            });
        }

    }, [dispatch, toast, redeem, applyCoupon, displayRazorpay, paymentCompleted, shippingInfo])


    // Calculate Order Prices
    const itemsPrice = buyItem.length ? buyItem.reduce((acc, item) => acc + Number((item.sale_price)).toFixed(2) * item.quantity, 0)
        : cartItems.reduce((acc, item) =>
            (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.sale_price))), 0)
    // const shippingPrice = itemsPrice === 0 ? 0 : (itemsPrice > 50000 ? distance * 10 : shippingPriceDistance);
    const shippingPrice = itemsPrice === 0 ? 0 : (itemsPrice > 500 ? 0 : 0);
    const tax_amount = buyItem.length ? buyItem.reduce((acc, item) => acc + Number((item.tax_amount)).toFixed(2) * item.quantity, 0)
        : cartItems.reduce((acc, item) =>
            (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.tax_amount))), 0)

    const totalPrice = Number((itemsPrice + shippingPrice - redeem)).toFixed(2);


    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const orderInfo = {
            itemsPrice: Number(itemsPrice).toFixed(2),
            shippingPrice,
            totalPrice: Number(totalPrice).toFixed(2),
            redeem,
            coupon_code
        };

        const order1 = {
            orderItems: JSON.stringify(shop),
            shippingInfo,
            orderInfo,
            shop_length: shop.length
        }

        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post('/api/payment/create-order', {
                amount: totalPrice,
                currency: 'INR',
                receipt: `PJORD_${Date.now()}`,
                order: order1
            });


            if (!data || !data.order_id || Number(totalPrice) !== Number(data.amount) / 100) {
                //for manage stock
                await axios.post('/api/payment/cancel-payment', {
                    razorpay_order_id: data.order_id
                })
                throw new Error('Order ID or amount mismatch before opening payment modal.');
            }


            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount, // Amount is in paise
                currency: data.currency,
                name: 'Purchase Junction',
                description: 'Transaction',
                order_id: data.order_id, // Order ID from Razorpay API
                handler: async function (response) {
                    try {

                        if (!response.razorpay_signature) {
                            throw new Error('Missing razorpay_signature in response');
                        }

                        if (response.razorpay_order_id !== data.order_id || Number(totalPrice) !== Number(data.amount) / 100) {
                            //for manage stock
                            await axios.post('/api/payment/cancel-payment', {
                                razorpay_order_id: data.order_id
                            })
                            throw new Error('Order ID or amount mismatch.');
                        }

                        // Send the payment details to your backend for verification
                        const verificationResponse = await axios.post('/api/payment/verification', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResponse.data.success) {
                            setPaymentCompleted(true);
                            window.removeEventListener('beforeunload', handleBeforeUnload);

                            router.push({
                                pathname: '/order/success',
                                query: {
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                    totalPrice: totalPrice,
                                    message: "Payment successful!",
                                },
                            });
                        } else {

                            toast.error('Payment verification failed!');
                            router.push('/order/fail');
                        }
                    } catch (error) {

                        console.error('Payment verification failed', error);
                        router.push('/order/fail');
                    }
                },
                prefill: {
                    name: shippingInfo.name,
                    email: shippingInfo.email,
                    contact: shippingInfo.mobile
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: async function () {
                        setPaymentCompleted(true);
                        window.removeEventListener('beforeunload', handleBeforeUnload);

                        toast.info('Payment cancelled by the user.');
                        await axios.post('/api/payment/cancel-payment', {
                            razorpay_order_id: data.order_id
                        });
                        router.push('/order/cancel');
                    }
                },
                eventHandlers: {
                    payment: {
                        failed: async (response) => {
                            await axios.post('/api/payment/fail', {
                                razorpay_order_id: data.order_id,
                            });
                            toast.error(`Payment failed: ${response?.error?.description}`);
                            router.push('/order/fail');
                        },
                    },
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            //transtion fail
            paymentObject.on('payment.failed', async function (response) {
                await axios.post('/api/payment/fail', {
                    razorpay_order_id: response.error.metadata.order_id,
                    error_code: response.error.code,
                    error_description: response.error.description,
                });

                // toast.error(`Payment failed: ${response.error.description}`);
                // window.location.href = '/order/fail';
            });

            const handleBeforeUnload = async (event) => {
                if (!paymentCompleted) {
                    await axios.post('/api/payment/cancel-payment', {
                        razorpay_order_id: data.order_id,
                    });

                    event.preventDefault();
                    return "Are you sure you want to leave? Your payment is not completed!";
                }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

        } catch (error) {
            console.error('Error initiating Razorpay order', error);
            router.push('/order/fail');
        } finally {
            setLoading(false);
        }

    };



    // const getApplyCoupon = () => {
    //     if (applyCoupon) {
    //         if (order_code) {
    //             var cc = 1
    //             coupons && coupons.forEach((coupon) => {
    //                 if (coupon.coupon_code === applyCoupon) {
    //                     cc = 0;
    //                     if (coupon.coupon_code === applyCoupon) {
    //                         if (coupon.minValue <= itemsPrice) {
    //                             const x = new Date().toISOString().split('T')[0];
    //                             const y = coupon.lastDate.split('T')[0];
    //                             if (x <= y) {
    //                                 // console.log("cashback", coupon.cashback);
    //                                 // console.log("minValue", coupon.minValue);
    //                                 // console.log("description", coupon.description);
    //                                 setDescription(coupon.description);
    //                                 setRedeem(coupon.cashback);
    //                                 setCoupon_code(coupon.coupon_code);
    //                                 toast.info(<div style={{ textTransform: 'initial' }}>Voila..! {coupon.coupon_code} has been applied successfully.
    //                                     <br />Proceed to pay now to get cashback RS. {coupon.cashback}</div>);

    //                                 <small className="text-danger">{coupon.description}</small>;

    //                             } else {
    //                                 toast.error("Promo code has expired.");
    //                             }
    //                         } else {
    //                             toast.error(`This promo code required minimum price RS ${coupon.minValue}`);
    //                         }
    //                     }
    //                 }
    //             })
    //             if (cc) {
    //                 toast.error("Promo code is invalid.");
    //             }

    //         } else {
    //             setOrder_code(1);
    //             toast.error("You already applied this promotion");
    //         }
    //     } else {
    //         toast.error("Promo code is empty");
    //     }
    // }

    return (
        <div className="container-fluid bg-white">
            <Fragment>
                <div className="row d-flex justify-content-between">
                    <h1 className="about-us__title my-5 ">Confirm Purchase</h1>
                    <div className="container-xl col-12 col-lg-8 mt-5 order-confirm">

                        <h4 className="mb-3 heading">Shipping Address:</h4>
                        <table>
                            <tr>
                                <td>
                                    <p><b>Name:</b> {shippingInfo && shippingInfo.name}</p>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <p><b>Phone:</b> {shippingInfo.mobile}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {shippingInfo.gstn ? <p><b>GSTN No:</b> {shippingInfo.gstn} </p> : ""}
                                </td>
                            </tr>
                        </table>

                        <p className="mb-4"><b>Address:</b> {`${shippingInfo.flat ? shippingInfo.flat + "," : ""} ${shippingInfo.area ? shippingInfo.area + "," : ""}
                        ${shippingInfo.landmark ? shippingInfo.landmark + "," : ""} ${shippingInfo.city ? shippingInfo.city + "," : ""}
                         ${shippingInfo.state ? shippingInfo.state + "," : ""} ${shippingInfo.country ? shippingInfo.country + "," : ""} ${shippingInfo.postalCode ? shippingInfo.postalCode : ""}`}</p>


                        <hr />
                        <h4 className="mt-4 heading">Review Items:</h4>

                        {buyItem.length ? (
                            buyItem.map(item => (
                                <Fragment>
                                    <hr />
                                    <div className="cart-item my-1" key={item.product}>
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={`/uploads/product/${item.image}`} alt={`${item.name}`} height="45" width="65" />
                                            </div>

                                            <div className="col-5 col-lg-6" >
                                                <Link href={`/shop/products/${Buffer.from((item.product).toString(), 'binary').toString('base64')}?${encodeURIComponent(item.name)}`} style={{ color: "#000080" }}>{item.name}</Link>
                                                <div>
                                                    {(item.header && item.columns) ? (
                                                        item.header.split(', ').map((header, index) => {
                                                            const columnValue = item.columns.split(', ')[index] || 'N/A';
                                                            return (
                                                                <div key={index}>
                                                                    {header}: {columnValue}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                                <p>{item.quantity} x RS {Number((item.sale_price - item.tax_amount)).toLocaleString('en-IN', { maximumFractionDigits: 2 })} = <b>RS {Number((item.quantity * (item.sale_price - item.tax_amount))).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))
                        ) : (
                            cartItems.map(item => (
                                (item.stock === 0 || item.stock < item.quantity) ? ("") : (<Fragment>
                                    <hr />
                                    <div className="cart-item my-1" key={item.product}>
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={`/uploads/product/${item.image}`} alt={`${item.name}`} height="40" width="60" />
                                            </div>

                                            <div className="col-5 col-lg-6" >
                                                <Link href={`/shop/products/${Buffer.from((item.product).toString(), 'binary').toString('base64')}?${encodeURIComponent(item.name)}`} style={{ color: "#000080" }}>{item.name}</Link>
                                                <div>
                                                    {(item.header && item.columns) ? (
                                                        item.header.split(', ').map((header, index) => {
                                                            const columnValue = item.columns.split(', ')[index] || 'N/A';
                                                            return (
                                                                <div key={index}>
                                                                    {header}: {columnValue}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                                <p>{item.quantity} x RS {Number((item.sale_price - item.tax_amount)).toLocaleString('en-IN', { maximumFractionDigits: 2 })} = <b>RS {Number((item.quantity * (item.sale_price - item.tax_amount))).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>)
                            ))
                        )}

                    </div>
                    <div className="col-12 col-lg-3 my-1 border p-3">
                        <div id="order_summary">
                            <h4 className='heading'>Checkout Summary</h4>
                            {/* <hr />
                            <div className="col form-group">
                                <input
                                    type="text"
                                    id="name_field"
                                    placeholder='Please enter the coupon code'
                                    className={`form-control`}
                                    value={applyCoupon}
                                    onChange={(e) => setApplyCoupon(e.target.value)}
                                />
                                {description ? (<ReadMoreCoupon text={description} />) : ""}

                            </div>
                            <div className="col form-group">
                                <div className="d-flex justify-content-center">
                                    <input className='btn  text-white btn-info px-2 py-1 btn-default' type='button' onClick={getApplyCoupon} value="Apply Coupon" />
                                </div>
                            </div> */}
                            <hr />   <br />
                            <p>Subtotal:  <span className="order-summary-values">&#8377; {(itemsPrice - tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                            <p>Total GST (18%) :  <span className="order-summary-values">&#8377; {tax_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                            {shippingPrice ? <p>Shipping cost: <span pan className="order-summary-values">&#8377; {shippingPrice.toFixed(2)}</span></p> : ""}
                            {/* <p>Estimated tax:  <span className="order-summary-values">&#8377; {taxPrice}</span></p> */}
                            {redeem ? <p>Coupon Amount:  <span className="order-summary-values">&#8209; &nbsp; &#8377; {redeem}</span></p> : ""}
                            <hr />   <br />
                            <p>Total: <span className="order-summary-values">&#8377; {Number(totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                            <hr />   <br />

                            {totalPrice && shippingInfo.mobile ? (
                                <center><button className="btn btn-primary my-3" disabled={!totalPrice || totalPrice <= 0 || loading} onClick={handlePayment} >Proceed to Payment</button></center>
                            ) : (
                                <div class="alert alert-danger" role="alert">
                                    <h4 class="alert-heading">Payment</h4>
                                    <p>Sorry, Could not initiate transaction please try again.</p>
                                    <hr />
                                </div>
                            )
                            }

                        </div>
                    </div>
                </div>
                <ToastContainer />
            </Fragment >
        </div >
    )
}

export default ConfirmOrder

