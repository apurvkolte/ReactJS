import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import AccountForm from '../form/AccountForm';
import SearchBar from './SearchBar';
import { dropdownMenu } from '../../data/headerData';
import commonContext from '../../contexts/common/commonContext';
import { useDispatch, useSelector } from 'react-redux'
import { allOrders } from "../../redux/actions/orderActions";
import { signOut, useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';



// const AccountForm = dynamic(() => import('../form/AccountForm'), { ssr: false });
// const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
const MemoizedLogoComponent = React.memo(() => <Link href='/'><a><img src="/images/logo.png" alt="SGSRO Logo" /></a></Link>);

const Header = () => {
    const router = useRouter()
    const { data: session } = useSession();
    const { formUserInfo, toggleForm, toggleSearch } = useContext(commonContext);
    const { cartItems } = useSelector(state => state.cart);
    const { orders, returnOrders } = useSelector(state => state.allOrders)
    const dispatch = useDispatch();
    const cartQuantity = cartItems.length;

    const accountFormComponent = useMemo(() => <AccountForm />, []);
    const searchBarComponent = useMemo(() => <SearchBar />, []);

    const newArrivalsOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(value => value.orderStatus === 'Processing' && value.paymentStatus === 'Success');
    }, [orders]);

    const newReturnOrders = useMemo(() => {
        if (!returnOrders) return [];
        return returnOrders.filter(value => value.orderStatus === 'Return');
    }, [returnOrders]);

    useEffect(() => {
        if (session) {
            if (session?.user?.role === "admin") {
                dispatch(allOrders())
            }
        }
    }, [session]);


    const logoutHandler = () => {
        signOut({ redirect: false }).then(() => {
            router.push("/");
        })
        toast.success('Logged out successfully.');
    }

    return (
        <Fragment>
            <header className='sticky-top' id="header">
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <MemoizedLogoComponent />
                        </h2>

                        <nav className="nav_actions">
                            {session && session?.user?.role === 'admin' ? (
                                <div className='row'>
                                    <div className="col order_action mr-30">
                                        <Link href="/admin/orders/return">
                                            <div>
                                                <i className="fa fa-shopping-basket" aria-hidden="true"></i>
                                                <span className="badge">{orders ? newReturnOrders?.length : 0}</span>
                                            </div>
                                        </Link>

                                        <div className="tooltip tp">Return Orders</div>
                                    </div>

                                    <div className="col order_action">
                                        <Link href="/admin/orders" >
                                            <div>
                                                <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                                                <span className="badge">{orders ? newArrivalsOrders?.length : 0}</span>
                                            </div>
                                        </Link>
                                        <div className="tooltip tp">New Orders</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="cart_action">
                                    <Link href="/cart">
                                        <div>
                                            <AiOutlineShoppingCart />
                                            {
                                                cartQuantity > 0 && (
                                                    <span className="badge">{cartQuantity}</span>
                                                )
                                            }
                                        </div>
                                    </Link>
                                    <div className="tooltip">Cart</div>
                                </div>
                            )}

                            <div className="user_action">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                <div className="dropdown_menu">
                                    <h4>Hello! {session ? <Link href="*"><>&nbsp;{session?.user.name}</></Link> : ""}</h4>
                                    <p>Access account and manage orders</p>
                                    {
                                        !session ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleForm(true)}
                                                >
                                                    Login / Signup
                                                </button>
                                            </>

                                        ) : (<>
                                            <div className="separator"></div><br />
                                            <ul>
                                                {
                                                    dropdownMenu.map(item => {
                                                        const { id, link, path } = item;
                                                        if (Number(id) === 4) {
                                                            return (
                                                                <li key={id}>
                                                                    <Link href={`${path}`} legacyBehavior>
                                                                        <a onClick={() => {
                                                                            signOut({ redirect: false }).then(() => {
                                                                                router.push("/");
                                                                            });
                                                                        }}>{link}</a>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        } else if (session?.user?.role === "admin" || Number(id) !== 2) {
                                                            return (
                                                                <li key={id}>
                                                                    <Link href={`${path}`}><a>{link}</a></Link>
                                                                </li>
                                                            );
                                                        }
                                                        return null; // Exclude item if it doesn't meet any condition
                                                    })
                                                }

                                            </ul>
                                        </>
                                        )
                                    }

                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                {searchBarComponent}


            </header>

            {accountFormComponent}


        </Fragment>
    );
};

export default Header;