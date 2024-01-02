import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>

                    <li>
                        <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-shopping-basket"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            {/* <li>
                                <Link to="/admin/productsAll"><i className="fa fa-clipboard"></i> All</Link>
                            </li> */}

                            <li>
                                <Link to="/admin/productNew"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                            <li>
                                <Link to="/admin/products"><i className="fa fa-pencil"></i>Update</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <a href="#orderSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-shopping-bag"></i> Orders</a>
                        <ul className="collapse list-unstyled" id="orderSubmenu">
                            {/* <li>
                                <Link to="/admin/ordersAll"><i className="fa fa-clipboard"></i> All</Link>
                            </li> */}

                            <li>
                                <Link to="/admin/orders"><i className="fa fa-check-circle"></i>Orders</Link>
                                <Link to="/admin/orders/cancel"><i className="fa fa-window-close-o"></i>Cancel Orders</Link>
                                <Link to="/admin/orders/return"><i className="fa fa-reply-all"></i>Return Orders</Link>
                                <Link to="/admin/orders/fail"><i className="fa fa-times"></i>Fail Orders</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>
                    <li>
                        <Link to="/admin/category"><i className="fa fa-list"></i> Category</Link>
                    </li>

                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-star-half-o"></i> Reviews</Link>
                    </li>
                    <li>
                        <a href="#couponsSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-money"></i> Promo Code</a>
                        <ul className="collapse list-unstyled" id="couponsSubmenu">
                            <li>
                                <Link to="/admin/coupons"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                            <li>
                                <Link to="/admin/couponAll"><i className="fa fa-clipboard"></i> All</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/admin/banner"><i className="fa fa-picture-o"></i> Banner</Link>
                    </li>

                    <li>
                        <Link to="/admin/report"><i className="fa fa-file-text"></i> Report</Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
