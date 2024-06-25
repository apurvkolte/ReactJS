import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link href="/dashboard"><a><i className="fa fa-tachometer"></i> Dashboard</a></Link>
                    </li>
                    <li>
                        <a href="#productSubmenu" aria-haspopup="true" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-shopping-basket"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li>
                                <Link href="/admin/productNew"><a><i className="fa fa-plus"></i> Create</a></Link>
                            </li>
                            <li>
                                <Link href="/admin/products"><a><i className="fa fa-pencil"></i> Update</a></Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#orderSubmenu" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-shopping-bag"></i> Orders</a>
                        <ul className="collapse list-unstyled" id="orderSubmenu">
                            <li>
                                <Link href="/admin/orders"><a><i className="fa fa-check-circle"></i> Orders</a></Link>
                                <Link href="/admin/orders/cancel"><a><i className="fa fa-window-close-o"></i> Cancel Orders</a></Link>
                                <Link href="/admin/orders/return"><a><i className="fa fa-reply-all"></i> Return Orders</a></Link>
                                <Link href="/admin/orders/fail"><a><i className="fa fa-times"></i> Fail Orders</a></Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#couponsSubmenu" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-money"></i> Promo Code</a>
                        <ul className="collapse list-unstyled" id="couponsSubmenu">
                            <li>
                                <Link href="/admin/create-coupons"><a><i className="fa fa-plus"></i> Create</a></Link>
                            </li>
                            <li>
                                <Link href="/admin/coupons"><a><i className="fa fa-clipboard"></i> All</a></Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#enquiry" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-comments"></i> Enquiry</a>
                        <ul className="collapse list-unstyled" id="enquiry">
                            <li>
                                <Link href="/admin/enquiry"><a><i className="fa fa-commenting-o"></i> General Enquiry</a></Link>
                            </li>
                            <li>
                                <Link href="/admin/enquiries"><a><i className="fa fa-commenting"></i> Product Enquiry</a></Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/admin/users"><a><i className="fa fa-users"></i> Users</a></Link>
                    </li>
                    <li>
                        <Link href="/admin/category"><a><i className="fa fa-list"></i> Category</a></Link>
                    </li>
                    <li>
                        <Link href="/admin/reviews"><a><i className="fa fa-star-half-o"></i> Reviews</a></Link>
                    </li>
                    <li>
                        <Link href="/admin/report"><a><i className="fa fa-file-text"></i> Report</a></Link>
                    </li>
                    <li>
                        <Link href="/admin/about"><a><i className="fa fa-user-circle"></i> About Us</a></Link>
                    </li>
                    <li>
                        <Link href="/admin/contact"><a><i className="fa fa-phone-square"></i> Contact Us</a></Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
