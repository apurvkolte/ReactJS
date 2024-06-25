import React, { Fragment, useEffect, useMemo } from 'react';
import dynamic from "next/dynamic";
import Link from 'next/link'
import MetaData from '../layout/MetaData'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
import Loader from '../layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../redux/actions/productActions'
import { allOrders, allSales } from '../../redux/actions/orderActions'
import { allUsers } from '../../redux/actions/userActions'

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products)
    const { orders, totalAmount, loading, returnAmount, allAmount } = useSelector(state => state.allOrders)
    const { users } = useSelector(state => state.allUsers)
    const { sales, processing, shipped, delivered, cancel, returned, returnApproved, yearSales } = useSelector(state => state.sales)
    const data = [];
    var sales1 = [];

    if (processing && Object.keys(processing).length != 0 || shipped && Object.keys(shipped).length != 0 || returned && Object.keys(returned).length != 0 || returnApproved && Object.keys(returnApproved).length != 0 || cancel && Object.keys(cancel).length != 0 || delivered && Object.keys(delivered).length != 0) {
        data.push(processing)
        data.push(shipped)
        data.push(delivered)
        data.push(cancel)
        data.push(returned)
        data.push(returnApproved)
    }


    if (sales && Object.keys(sales).length != 0) {
        sales.map((value) => {
            const check = sales1.filter(x => x.order_date === String(value.order_date).substring(0, 10))
            if (check.length) {
                sales1.filter(x => x.sale_price = Number(x.sale_price) + Number(value.sale_price))
            } else {
                let data = { "sale_price": Number(value.sale_price), "order_date": String(value.order_date).substring(0, 10) }
                sales1.push(data)
            }
        })
    }


    let outOfStock = 0;
    if (products) {
        products.forEach(product => {
            if (product.stock === 0) {
                outOfStock += 1;
            }
        })
    }


    useEffect(() => {
        dispatch(getAdminProducts())
        dispatch(allOrders())
        dispatch(allUsers())
        dispatch(allSales())

    }, [dispatch])

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className="col-12 col-md-10">
                    <h1 className="my-4 ml-2 mr-2 heading">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <Fragment>
                            <MetaData title={'Admin Dashboard'} />
                            <div className="row">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card card8 text-white bg-amount o-hidden h-100">
                                        <div className="card-body">
                                            <div className='row'>
                                                <div className="col-md-4 text-center  card-font-size"><small>Refund Amount<br /><i className="fa fa-inr" aria-hidden="true"></i> <b>{returnAmount ? returnAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</b></small>
                                                </div>
                                                <div className="col-md-4 text-center card-font-size">Orders Amount<br /><i className="fa fa-inr" aria-hidden="true"></i> <b>{totalAmount ? totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</b>
                                                </div>
                                                <div className="col-md-4 text-center card-font-size"><small>Total Amount<br /><i className="fa fa-inr" aria-hidden="true"></i> <b>{allAmount ? allAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</b></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card card9 text-white bg-products o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">
                                                <i className="fa fa-shopping-basket"></i><br />Products<br /> <b>
                                                    {products ? products.length : 0}</b></div>
                                        </div>
                                        <Link href="/admin/products">
                                            <a className="card-footer text-white d-flex justify-content-between align-items-center small z-1">
                                                <span>View Details</span>
                                                <span>
                                                    <i className="fa fa-angle-right"></i>
                                                </span>
                                            </a>
                                        </Link>

                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6  mb-3">
                                    <div className="card card10 text-white bg-orders o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">
                                                <i className="fa fa-shopping-bag"></i><br />
                                                Orders<br /> <b>
                                                    {orders ? orders.length : 0}</b></div>
                                        </div>
                                        <Link href="/admin/orders">
                                            <a className="card-footer text-white d-flex justify-content-between align-items-center small z-1">
                                                <span>View Details</span>
                                                <span>
                                                    <i className="fa fa-angle-right"></i>
                                                </span>
                                            </a>
                                        </Link>

                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card card11 text-white bg-users o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">
                                                <i className="fa fa-users"></i> <br />
                                                Users<br /> <b>{users ? users.length : 0}</b></div>
                                        </div>
                                        <Link href="/admin/users">
                                            <a className="card-footer text-white d-flex justify-content-between align-items-center small z-1">
                                                <span>View Details</span>
                                                <span>
                                                    <i className="fa fa-angle-right"></i>
                                                </span>
                                            </a>
                                        </Link>

                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card card12 text-white bg-stock o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">
                                                <i className="fa fa fa-cart-plus" aria-hidden="true"></i><br />Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                        <Link href="/admin/stocks">
                                            <a className="card-footer text-white d-flex justify-content-between align-items-center small z-1">
                                                <span>View Details</span>
                                                <span>
                                                    <i className="fa fa-angle-right"></i>
                                                </span>
                                            </a>
                                        </Link>

                                    </div>
                                </div>
                            </div>

                        </Fragment>
                    )}
                </div>
            </div>

        </Fragment>
    )
}

export default Dashboard
