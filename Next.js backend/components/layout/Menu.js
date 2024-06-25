import React from 'react'
import Link from 'next/link'

const Menu = () => {
    return (
        <div className="sidebar-wrapper1">
            <nav id="sidebar1">
                <ul className="list-unstyled components1">
                    <li>
                        <Link href={{ pathname: "/products/cutter" }} >
                            <img src="/images/annul-cutter.jpg" alt="annul-cutter" width="30" height="30" />&nbsp;
                            Annular Cutter
                        </Link>
                    </li>

                    <li>
                        <Link href={{ pathname: "/products/hand" }}>
                            <img src="/images/hand-tools.jpg" alt="hand-tools" width="30" height="30" />&nbsp;
                            Hand Tools
                        </Link>
                    </li>
                    <li>
                        <Link href={{ pathname: "/products/power" }}>
                            <img src="/images/power-tools.jpg" alt="power-tools" width="30" height="30" />&nbsp;
                            Power Tools
                        </Link>
                    </li>
                    <li>
                        <Link href={{ pathname: "/products/accessories" }}>
                            <img src="/images/accessories.jpg" alt="accessories.jpg" width="30" height="30" />&nbsp;
                            Accessories
                        </Link>
                    </li>
                    <li>
                        <Link href={{ pathname: "/products/drill" }}>
                            <img src="/images/drill.jpg" alt="drill" width="30" height="30" />&nbsp;
                            Drill and Taps
                        </Link>
                    </li>

                    {/* <li>
                        <a href="#productSubmenu1" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-shopping-basket"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu1">
                            <li>
                                <Link href="/admin/productNew"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                            <li>
                                <Link href="/admin/products"><i className="fa fa-pencil"></i>Update</Link>
                            </li>
                        </ul>
                    </li> */}

                </ul>
            </nav>
        </div>
    )
}

export default Menu
