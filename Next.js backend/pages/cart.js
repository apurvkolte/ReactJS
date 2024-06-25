import { useState, useEffect, Fragment } from 'react'
import { BsCartX } from 'react-icons/bs';
import Link from 'next/link';
import { calculateTotal, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import CartItem from '../components/cart/CartItem';
import EmptyView from '../components/common/EmptyView';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addItemToCart, removeItemFromCart, removeBuyItem } from '../redux/actions/cartActions'
import { getDiscountUI } from "../redux/actions/productActions";


const Cart = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    const { buyItem } = useSelector(state => state.buy);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    useDocTitle('Cart');

    // const { cartItems } = useContext(cartContext);

    const cartQuantity = cartItems.length;

    // total original price
    const cartTotal = cartItems.map(item => {
        return (item.sale_price) * item.quantity;
    });

    const calculateCartTotal = calculateTotal(cartTotal);
    const displayCartTotal = displayMoney(calculateCartTotal);

    const originalTotal = cartItems.map(item => {
        return (Math.round(getDiscountUI(item.sale_price, item.discount))) * item.quantity;
    });

    const calculateOriginalPrice = calculateTotal(originalTotal);
    const originalPrice = displayMoney(calculateOriginalPrice);


    // total discount
    // const cartDiscount = cartItems.map(item => {
    //     return (item.sale_price - item.original_price - item.tax_amount) * item.quantity;
    // });



    // final total amount
    const totalAmount = calculateCartTotal;
    const displayTotalAmount = displayMoney(totalAmount);

    const displayCartDiscount = displayMoney(calculateOriginalPrice - totalAmount);

    const isDisabled = cartItems.reduce((acc, item) => acc + (item.stock === 0 || item.stock < item.quantity ? 0 : Number(item.quantity * item.sale_price)), 0) === 0;
    const handleClick = (e) => {
        e.preventDefault();
        if (!isDisabled) {
            checkoutHandler();
            router.push('/shipping');
        }
    };

    const checkoutHandler = () => {
        window.localStorage.removeItem('buyItem')
        if (buyItem) {
            buyItem.map(item => (
                dispatch(removeBuyItem(item.product))))
        }
        // router.push('/shipping', { state: { prevPath: Router.pathname } });
        // router.push('/shipping');
    }

    return (
        <Fragment>
            {isClient ? <section id="cart" className="section container">
                {
                    cartQuantity === 0 ? (
                        <EmptyView
                            icon={<BsCartX />}
                            msg="Your Cart is Empty"
                            li="/all-products"
                            btnText="Start Shopping"
                        />
                    ) : (
                        <div className="wrapper cart_wrapper">
                            <div className="cart_left_col">
                                {
                                    cartItems.map(item => (
                                        <CartItem
                                            key={item.product}
                                            cartItems={item}
                                        />
                                    ))
                                }
                            </div>

                            <div className="cart_right_col order_summary">
                                <h3 className='heading'>
                                    Order Summary &nbsp;
                                    ( {cartQuantity} {cartQuantity > 1 ? 'items' : 'item'} )
                                </h3>
                                <div className="order_summary_details">
                                    <div className="price">
                                        <span>Original Price</span>
                                        <b>{originalPrice}</b>
                                    </div>
                                    <div className="discount">
                                        <span>Discount</span>
                                        <b>{displayCartDiscount}</b>
                                    </div>
                                    <div className="delivery">
                                        <span>Delivery</span>
                                        <b>Free</b>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="total_price">
                                        <b><small>Total Price</small></b>
                                        <b>{displayTotalAmount}</b>
                                    </div>

                                    <button
                                        className="btn btn-primary text-white"
                                        disabled={isDisabled}
                                        onClick={handleClick}
                                    >
                                        Check out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                <div>
                    <ToastContainer />
                </div>
            </section> : ''}

        </Fragment>
    );
};

export default Cart;