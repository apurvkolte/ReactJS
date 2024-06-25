import React, { useContext } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import cartContext from '../../contexts/cart/cartContext';
import { addItemToCart, removeItemFromCart, removeBuyItem } from '../../redux/actions/cartActions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuantityBox = (props) => {
    const dispatch = useDispatch();
    const { id, quantity, stock, name } = props;

    // const { incrementItem, decrementItem } = useContext(cartContext);

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


    return (
        <>
            <div className="quantity_box">
                <button className='bg-primary text-white'
                    type="button"
                    onClick={() => decreaseQty(id, quantity)}
                >
                    <FaMinus />
                </button>
                <span className="quantity_count bg-light text-dark">
                    {quantity}
                </span>
                <button
                    className='bg-primary text-white'
                    type="button"
                    onClick={() => increaseQty(id, quantity, stock, name)}
                    disabled={quantity >= stock}
                >
                    <FaPlus />
                </button>
                <ToastContainer />
            </div>
        </>
    );
};

export default QuantityBox;