import React, { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearErrors } from '../../redux/actions/orderActions'
import { CANCEL_ORDER_RESET } from '../../redux/constants/orderConstants'
import { Buffer } from 'buffer'

const ListOrders = () => {
    const router = useRouter()

    const dispatch = useDispatch();
    const { loading, error, cancelOrders } = useSelector(state => state.myOrders);
    const { isCancel } = useSelector(state => state.cancel)

    // console.log("orders", orders);
    // console.log("isCancel", isCancel);
    // if(orders){
    //     orders.forEach(order=>{
    //     console.log("orders",Buffer.from(`${product.id}`, 'binary').toString('base64'))
    //     console.log("orders",order.quantity)
    //     console.log("orders",order.totalPrice)
    //     console.log("orders",order.orderStatus)}
    //     )}
    useEffect(() => {
        dispatch(myOrders());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (isCancel) {
            toast.success("Product cancel successfully");
            router.push('/orders');
            dispatch({ type: CANCEL_ORDER_RESET })
        }
    }, [dispatch, router.push, toast, error, isCancel])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Orders Name',
                    field: 'name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Reason',
                    field: 'reason',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Order Date',
                    field: 'date',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Cancel Status',
                    field: 'status',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Cancel Date',
                    field: 'delivered_date',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
                    width: 100
                }
            ],
            rows: []
        }

        cancelOrders && cancelOrders.forEach(order => {
            if (order.paymentStatus) {
                data.rows.push({
                    name: <Link className='proda' href={`/product-details/${Buffer.from(order.product_id.toString(), 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName}</Link>,
                    status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                        ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                        : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                    reason: order.reason,
                    price: `${order.sale_price}`,
                    id: order.order_id,
                    date: new Date(order.order_date).toLocaleDateString('en-IN'),
                    delivered_date: new Date(order.delivered_date).toLocaleDateString('en-IN'),
                    actions: <Fragment>
                        <Link href={`/orders/${Buffer.from(`${order.id}`, 'binary').toString('base64')}`} passHref>
                            <a className="btn btn-primary">
                                <i className="fa fa-eye"></i>
                            </a>
                        </Link>
                        <style jsx>{`
                      .btn {
                        padding: 0.5rem 1rem;
                        border: none;
                        background-color: #007bff;
                        color: #fff;
                        cursor: pointer;
                        border-radius: 0.25rem;
                        text-decoration: none;
                      }
              
                      .btn:hover {
                        background-color: #0056b3;
                      }
                    `}</style>
                    </Fragment>
                })
            }
        })
        return data;
    }
    return (
        <Fragment>
            <MetaData title={'My Orders'} />
            <div class="container button-container my-5">
                <Link href={'/orders'} className='btn btn-success menuorder'>My Orders</Link>
                <Link href={'/orders/cancel'} className='btn btn-success menuorder heading'>Cancel Orders</Link>
                <Link href={'/orders/return'} className='btn btn-success menuorder heading'>Return Orders</Link>
            </div>
            {loading ? <Loader /> : (
                <MDBDataTable
                    data={setOrders()}
                    className='cust-table px-md-5 mt-20 mr-5'
                    bordered
                    striped
                    hover scrollX
                />)}
            <ToastContainer />
        </Fragment >
    )
}

export default ListOrders
