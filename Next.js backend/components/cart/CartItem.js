import React, { useContext, useState } from 'react';
import { TbTrash } from 'react-icons/tb';
import Link from 'next/link';
import { displayMoney } from '../../helpers/utils';
import QuantityBox from '../common/QuantityBox';
import { useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart, removeBuyItem } from '../../redux/actions/cartActions'
import { getDiscountUI } from "../../redux/actions/productActions";
import { Buffer } from 'buffer'
import Dialog from "../../components/Dialog";


const CartItem = (props) => {

    const { cartItems } = props;
    const dispatch = useDispatch();

    // const { removeItem } = useContext(cartContext);

    const paramID = Buffer.from((cartItems.product).toString(), 'binary').toString('base64');

    const newPrice = displayMoney(cartItems.sale_price);
    const oldPrice = displayMoney(Math.round(getDiscountUI(cartItems.sale_price, cartItems.discount)));

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
        const RID = Buffer.from((id).toString(), 'base64').toString('binary')
        handleDialog("Are you sure you want to remove item?", true, name, Number(RID));
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(removeItemFromCart(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }


    return (
        <>
            <div className="cart_item">
                <figure className="cart_item_img">
                    <Link href={`product-details/${paramID}`}>
                        <img src={`/uploads/product/${cartItems.image}`} alt="product-img" height={153} width={138} />
                    </Link>
                </figure>
                <div className="cart_item_info">
                    <div className="cart_item_head">
                        <h4 className="cart_item_title">
                            <Link href={`/product-details/${paramID}`}><a>{cartItems.name} {cartItems.name}</a></Link>
                        </h4>
                        <div className="cart_item_del">
                            <span onClick={() => removeCartItemHandler(paramID, cartItems.name)}>
                                <TbTrash />
                            </span>
                            <div className="tooltip">Remove Item</div>
                        </div>
                    </div>

                    <h2 className="cart_item_price">
                        {newPrice} &nbsp;
                        <small><del>{oldPrice}</del></small>
                    </h2>

                    <div className='row'>
                        <div className='col'>
                            <QuantityBox id={paramID} quantity={cartItems.quantity} stock={cartItems.stock} name={cartItems.name} />

                        </div>
                        <div className='col'>
                            <span>
                                {(cartItems.stock === 0 || cartItems.stock < cartItems.quantity) ? (<h5 className="text-danger"><br /> Out of Stock</h5>) : ""}
                            </span>
                        </div>
                    </div>

                </div>

                {dialog.isLoading && (
                    <Dialog
                        //Update
                        nameProduct={dialog.nameProduct}
                        onDialog={areUSureDelete}
                        message={dialog.message}
                        id={dialog.id}
                    />
                )}
            </div>
        </>
    );
};

export default CartItem;