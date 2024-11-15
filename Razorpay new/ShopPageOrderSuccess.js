// third-party
import Head from 'next/head';

// application
import AppLink from '../shared/AppLink';
import Check100Svg from '../../svg/check-100.svg';
import CurrencyFormat from '../shared/CurrencyFormat';
import url from '../../services/url';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { addItemToCart, removeItemFromCart, removeBuyItem, saveShippingInfo } from "../../store/action/cartActions";

// data stubs
import dataAccountOrderDetails from '../../data/accountOrderDetails';
import theme from '../../data/theme';
import { useEffect, useState } from 'react';

export default function ShopPageOrderSuccess() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [orderId, setOrderId] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const { cartItems } = useSelector((state) => state.cart);
    const { buyItem, shippingInfo } = useSelector((state) => state.buy);

    // const shop = buyItem.length ? buyItem : cartItems;

    // const clearCart = () => {
    //     if (!buyItem.length) {

    //         cartItems.forEach(item => {
    //             dispatch(removeItemFromCart(Buffer.from((item.product).toString(), 'binary').toString('base64'), item.cid));
    //         });
    //         localStorage.setItem('cartItems', JSON.stringify([]));
    //     }
    // };


    useEffect(() => {
        setOrderId(router.query.orderId);
        setTotalPrice(router.query.totalPrice);

        if (!buyItem.length) {
            cartItems.forEach(item => {
                dispatch(removeItemFromCart(item.product, item.cid));
            });
            localStorage.setItem('cartItems', JSON.stringify([]));
        }

        // if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
        //     const savedShippingInfo = localStorage.getItem('shippingInfo');
        //     if (savedShippingInfo) {
        //         const parsedShippingInfo = JSON.parse(savedShippingInfo);
        //         dispatch(saveShippingInfo(parsedShippingInfo));
        //     }
        // }

        // if (cartItems.length) {
        //     cartItems.forEach((item) => {
        //         dispatch(addItemToCart(Buffer.from((item.product).toString(), 'binary').toString('base64'), item.quantity, item.cid))
        //     });
        // }


    }, [orderId, totalPrice, dispatch]);

    // const itemsPrice = buyItem.length ? buyItem.reduce((acc, item) => acc + Number((item.sale_price)).toFixed(2) * item.quantity, 0)
    //     : cartItems.reduce((acc, item) =>
    //         (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.sale_price))), 0)
    // // const shippingPrice = itemsPrice === 0 ? 0 : (itemsPrice > 50000 ? distance * 10 : shippingPriceDistance);
    // const shippingPrice = itemsPrice === 0 ? 0 : (itemsPrice > 500 ? 0 : 0);
    // const tax_amount = buyItem.length ? buyItem.reduce((acc, item) => acc + Number((item.tax_amount)).toFixed(2) * item.quantity, 0)
    //     : cartItems.reduce((acc, item) =>
    //         (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.tax_amount))), 0)

    // const totalPrice = Number((itemsPrice + shippingPrice)).toFixed(2);


    // const order = dataAccountOrderDetails;
    // const items = shop.map((item, itemIndex) => {
    //     const options = (item.options || []).map((option, optionIndex) => (
    //         <li key={optionIndex} className="order-list__options-item">
    //             <span className="order-list__options-label">
    //                 {option.name}
    //                 {': '}
    //             </span>
    //             <span className="order-list__options-value">  <p>{option.quantity} x RS {Number((option.sale_price - option.tax_amount)).toLocaleString('en-IN', { maximumFractionDigits: 2 })} = <b>RS {Number((option.quantity * (option.sale_price - option.tax_amount))).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</b></p></span>
    //         </li>
    //     ));

    //     return (
    //         <tr key={itemIndex}>
    //             <td className="order-list__column-image">
    //                 <div className="product-image">
    //                     <AppLink href={url.product(item)} className="product-image__body">
    //                         <img className="product-image__img" src={`/uploads/product/${item.image}`} alt="" />
    //                     </AppLink>
    //                 </div>
    //             </td>
    //             <td className="order-list__column-product">
    //                 <AppLink href={url.product(item)}>
    //                     {item.name}
    //                 </AppLink>
    //                 {options.length > 0 && (
    //                     <div className="order-list__options">
    //                         <ul className="order-list__options-list">
    //                             {options}
    //                         </ul>
    //                     </div>
    //                 )}
    //             </td>
    //             <td className="order-list__column-quantity" data-title="Qty:">{item.quantity}</td>
    //             <td className="order-list__column-total">{totalPrice} </td>
    //         </tr>
    //     );
    // });

    // const additionalLines = shop.map((line, index) => (
    //     <tr key={index}>
    //         <th className="order-list__column-label" colSpan={3}>{line.name}</th>
    //         <td className="order-list__column-total">{totalPrice} </td>
    //     </tr>
    // ));

    return (
        <div className="block order-success">
            <Head>
                <title>{`Order Success — ${theme.name}`}</title>
            </Head>

            <div className="container">
                <div className="order-success__body">
                    <div className="order-success__header">
                        <Check100Svg className="order-success__icon" />
                        <h1>Payment Successful!</h1>
                        <div className="order-success__subtitle"><p>Your payment was successful. Thank you for your purchase!</p></div>
                        <div className="order-success__actions">
                            <AppLink href="/" className="btn btn btn-primary">
                                Go back to Home
                            </AppLink>
                        </div>
                    </div>

                    {totalPrice && orderId ? (<>
                        <div className="order-success__meta">
                            <ul className="order-success__meta-list">
                                <li className="order-success__meta-item">
                                    <span className="order-success__meta-title">Order ID:</span>
                                    <span className="order-success__meta-value">{`${orderId}`}</span>
                                </li>
                                {/* <li className="order-success__meta-item">
                                <span className="order-success__meta-title">Created at:</span>
                                <span className="order-success__meta-value">{order.date}</span>
                            </li> */}
                                <li className="order-success__meta-item">
                                    <span className="order-success__meta-title">Total Amount:</span>
                                    <span className="order-success__meta-value">{totalPrice} </span>
                                </li>
                                {/* <li className="order-success__meta-item">
                                <span className="order-success__meta-title">Payment method:</span>
                                <span className="order-success__meta-value">{order.paymentMethod}</span>
                            </li> */}
                            </ul>
                        </div>

                        {/* <div className="card">
                            <div className="order-list">
                                <table>
                                    <thead className="order-list__header">
                                        <tr>
                                            <th className="order-list__column-label" colSpan={2}>Product</th>
                                            <th className="order-list__column-quantity">Qty</th>
                                            <th className="order-list__column-total">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="order-list__products">
                                        {items}
                                    </tbody>
                                    {additionalLines.length > 0 && (
                                        <tbody className="order-list__subtotals">
                                            <tr>
                                                <th className="order-list__column-label" colSpan={3}>Subtotal</th>
                                                <td className="order-list__column-total">{totalPrice} </td>
                                            </tr>
                                            {additionalLines}
                                        </tbody>
                                    )}
                                    <tfoot className="order-list__footer">
                                        <tr>
                                            <th className="order-list__column-label" colSpan={3}>Total</th>
                                            <td className="order-list__column-total">{totalPrice} </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div> */}

                        {/* <div className="row mt-3 no-gutters mx-n2">
                            <div className="col-sm-6 col-12 px-2">
                                <div className="card address-card">
                                    <div className="address-card__body">
                                        <div className="address-card__badge address-card__badge--muted">
                                            Shipping Address
                                        </div>
                                        <div className="address-card__name">
                                            {shippingInfo && shippingInfo.name}
                                        </div>
                                        <div className="address-card__row">
                                            <br />
                                            {shippingInfo.gstn ? <p><b>GSTN No:</b> {shippingInfo.gstn} </p> : ""}
                                            <br />
                                            <p className="mb-4"><b>Address:</b> {`${shippingInfo.flat ? shippingInfo.flat + "," : ""} ${shippingInfo.area ? shippingInfo.area + "," : ""}
                        ${shippingInfo.landmark ? shippingInfo.landmark + "," : ""} ${shippingInfo.city ? shippingInfo.city + "," : ""}
                         ${shippingInfo.state ? shippingInfo.state + "," : ""} ${shippingInfo.country ? shippingInfo.country + "," : ""} ${shippingInfo.postalCode ? shippingInfo.postalCode : ""}`}</p>
                                        </div>
                                        <div className="address-card__row">
                                            <div className="address-card__row-title">Phone Number</div>
                                            <div className="address-card__row-content"> {shippingInfo.mobile}</div>
                                        </div>
                                      
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-12 px-2 mt-sm-0 mt-3">
                                <div className="card address-card">
                                    <div className="address-card__body">
                                        <div className="address-card__badge address-card__badge--muted">
                                            Billing Address
                                        </div>
                                        <div className="address-card__name">
                                            {shippingInfo && shippingInfo.name}
                                        </div>
                                        <div className="address-card__row">
                                            <p className="mb-4"><b>Address:</b> {`${shippingInfo.flat ? shippingInfo.flat + "," : ""} ${shippingInfo.area ? shippingInfo.area + "," : ""}
                        ${shippingInfo.landmark ? shippingInfo.landmark + "," : ""} ${shippingInfo.city ? shippingInfo.city + "," : ""}
                         ${shippingInfo.state ? shippingInfo.state + "," : ""} ${shippingInfo.country ? shippingInfo.country + "," : ""} ${shippingInfo.postalCode ? shippingInfo.postalCode : ""}`}</p>
                                        </div>
                                        <div className="address-card__row">
                                            <div className="address-card__row-title">Phone Number</div>
                                            <div className="address-card__row-content">{shippingInfo.mobile}</div>
                                        </div>
                                  
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </>) : ""}
                </div>
            </div>
        </div>
    );
}
