import React, { Fragment, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { displayMoney } from '../../helpers/utils';
import useActive from '../../hooks/useActive';
import { addItemToCart, addBuyItem } from '../../redux/actions/cartActions';
import { getDiscountUI } from '../../redux/actions/productActions';
import { Buffer } from 'buffer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);

    const EID = useMemo(() => Buffer.from(`${product.id}`, 'binary').toString('base64'), [product.id]);


    const { active, handleActive, activeClass } = useActive(false);

    const handleAddItem = useCallback(() => {
        addToCart(EID);
        handleActive(EID);
        setTimeout(() => {
            handleActive(false);
        }, 3000);
    }, [EID, addToCart, handleActive]);

    const addToCart = useCallback((id) => {
        const BID = Buffer.from(id, 'base64').toString('binary');
        if (cartItems.length < 10) {
            const existingItem = cartItems.find(item => item.product === Number(BID));
            const count = existingItem ? existingItem.quantity : 0;

            dispatch(addItemToCart(id, quantity + count));
            toast.success("Item Added to Cart");
        } else {
            toast.error("Cart has touched the max limit. Please delete existing cart items to add a new item.");
        }
    }, [cartItems, dispatch, quantity]);

    return (
        <Fragment>
            <div className="card products_card">
                <figure className="products_img">
                    <Link href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>
                        <img src={`/uploads/product/${product.image}`} loading="lazy" alt="product-img" />
                    </Link>
                </figure>
                <div className="products_details">
                    <h5 className="products_title" style={{ height: '3em', overflow: 'hidden' }}>
                        <Link href={`/product-details/${EID}?${encodeURIComponent(product.name)}`}>{product.name}</Link>
                    </h5>
                    <h4 className="products_price">
                        {displayMoney(Math.round(product.sale_price))} &nbsp;
                        {product.discount > 0 && (<small><del>{displayMoney(Math.round(getDiscountUI(product.sale_price, product.discount)))}</del> <span className='cart-discount'>{product.discount}% Off</span></small>)}
                    </h4>
                    <button
                        type="button"
                        className={`btn btn-primary products_btn ${activeClass(EID)}`}
                        onClick={handleAddItem}
                        disabled={product.stock === 0}
                    >
                        {active ? 'Added' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductCard;
