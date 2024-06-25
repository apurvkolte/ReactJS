import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MetaData from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart, removeBuyItem } from '../../redux/actions/cartActions'
import Dialog from "../../Dialog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer'

const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    const { buyItem } = useSelector(state => state.buy);

    // console.log("cartItems", cartItems);
    // useEffect(() => {
    //     cartItems.forEach((item) => {
    //         dispatch(addItemToCart(item.product, item.quantity))
    //     })
    //     if (buyItem) {
    //         buyItem.map(item => (
    //             dispatch(removeBuyItem(item.product))))
    //     }
    // }, [dispatch]);

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

    const removeCartItemHandler = (id, name) => {
        handleDialog("Are you sure you want to remove item?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(removeItemFromCart(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    const increaseQty = (id, quantity, stock, name) => {
        const newQty = quantity + 1;
        if (newQty > stock) {
            toast.error(`${name} available only stock is ${stock}`);
            return;
        };
        dispatch(addItemToCart(id, newQty))
    }
    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        dispatch(addItemToCart(id, newQty))
    }
    const checkoutHandler = () => {
        window.localStorage.removeItem('buyItem')
        if (buyItem) {
            buyItem.map(item => (
                dispatch(removeBuyItem(item.product))))
        }
        router.push('/shipping');
    }
    return (
        <div className="container-fluid">
            <Fragment>
                <MetaData title={'Your Cart'} />
                {cartItems.length === 0 ? <h2 className="mt-5">Your Cart is Empty <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></h2> : (
                    <Fragment>
                        <h2 className="heading">Your Cart: <b>{cartItems.length} items</b></h2>
                        <div className="row d-flex justify-content-between">
                            <div className="col-12 col-lg-8">
                                {cartItems.map(item => (
                                    <Fragment>
                                        <hr />
                                        <div className="cart-item" key={item.product}>
                                            <div className="row">
                                                <div className="col-4 col-lg-3">
                                                    <img src={`/uploads/product/${item.image}`} alt={item.name} height="90" width="115" />
                                                </div>
                                                <div className="col-5 col-lg-3">y
                                                    <Link href={`/product-details/${Buffer.from((item.product).toString(), 'binary').toString('base64')}?${encodeURIComponent(item.name)}`}>{item.name}</Link>
                                                </div>
                                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                    <p id="card_item_price" className='text-success'>&#8377;{Number((item.sale_price).toFixed(2)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                                </div>
                                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                    <div className="row stockCounter d-inline">
                                                        <span className="btn minus-btn" onClick={() => decreaseQty(Buffer.from((item.product).toString(), 'binary').toString('base64'), item.quantity)}>-</span>
                                                        <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />
                                                        <span className="btn plus-btn" onClick={() => increaseQty(Buffer.from((item.product).toString(), 'binary').toString('base64'), item.quantity, item.stock, item.name)}>+</span>
                                                    </div>
                                                    <span>
                                                        {(item.stock === 0 || item.stock < item.quantity) ? (<h5 className="text-danger"><br /> Out of Stock</h5>) : ""}
                                                    </span>
                                                </div>
                                                <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                    <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCartItemHandler(item.product, item.name)} ></i>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </Fragment>
                                ))}
                            </div>
                            <div className="col-12 col-lg-3 my-4">
                                <div id="order_summary">
                                    <h4 heading>Order Summary</h4>
                                    <hr />
                                    <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item) =>
                                        (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity))), 0)} (Units)</span></p>
                                    <p>Est. total: <span className="order-summary-values">&#8377;{cartItems.reduce((acc, item) =>
                                        (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number((item.quantity * item.sale_price)))), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span></p>
                                    <hr />
                                    <button id="checkout_btn" className="btn btn-primary btn-block"
                                        disabled={cartItems.reduce((acc, item) =>
                                            (acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.sale_price))), 0) === 0} onClick={checkoutHandler}>
                                        Check out</button>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )}
                {dialog.isLoading && (
                    <Dialog
                        //Update
                        nameProduct={dialog.nameProduct}
                        onDialog={areUSureDelete}
                        message={dialog.message}
                        id={dialog.id}
                    />
                )}
            </Fragment>
            <ToastContainer />
        </div >
    )
}

export default Cart
