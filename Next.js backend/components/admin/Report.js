import React, { Fragment, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { allOrders, clearErrors, allReports } from '../../redux/actions/orderActions'
import Loader from '../layout/Loader'
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);

const ReportReport = () => {
    const dispatch = useDispatch();

    const [date1, setDate1] = useState();
    const [date2, setDate2] = useState();
    const { orderRecord, loading, error, totalAmount } = useSelector(state => state.reports);
    const doc = new jsPDF()
    const year = (new Date()).getFullYear();


    useEffect(() => {
        dispatch(allReports());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, toast, error]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);


    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        if (list.display === "block") {
            setList({ display: "none" })
        } else {
            setList({ display: "block" })
        }
    }

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'SR',
                    field: 'SR',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Order_ID',
                    field: 'id',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'product Name',
                    field: 'PRODUCT_NAME',
                    sort: 'asc',
                    width: 260
                },
                {
                    label: 'Price',
                    field: 'SALE_PRICE',
                    sort: 'asc',
                    width: 180
                },

                {
                    label: 'Quantity',
                    field: 'QUANTITY',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'User Name',
                    field: 'USER_NAME',
                    sort: 'asc',
                    width: 120
                },
                {
                    label: 'Order Date',
                    field: 'ORDER_DATE',
                    sort: 'asc',
                    width: 210
                },
                {
                    label: 'GSTN',
                    field: 'GSTN',
                    sort: 'asc',
                    width: 210
                },
                {
                    label: 'Coupon Amount',
                    field: 'REDEEM',
                    sort: 'asc',
                    width: 120
                },
                {
                    label: 'Coupon',
                    field: 'COUPON_CODE',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'Status',
                    field: 'ORDER_STATUS',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'Payment',
                    field: 'PAYMENT_STATUS',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'Tracking ID',
                    field: 'TRACKING_ID',
                    sort: 'asc',
                    width: 180
                },
                {
                    label: 'Bank Ref No',
                    field: 'BANK_REF_NO',
                    sort: 'asc',
                    width: 180
                },
                {
                    label: 'Payment Mode',
                    field: 'PAYMENT_MODE',
                    sort: 'asc',
                    width: 120
                },
                {
                    label: 'Payment Mode',
                    field: 'PAYMENT_MODE',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'Cart',
                    field: 'CARD_NAME',
                    sort: 'asc',
                    width: 140
                },

                {
                    label: 'Total Purchase',
                    field: 'TOTAL_PRICE',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Tax Amount',
                    field: 'TAX_PRICE',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Tax(%)',
                    field: 'TAX_RATE',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Shipping Price',
                    field: 'SHIPPING_PRICE',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'List of cart qty',
                    field: 'SHOP_LENGTH',
                    sort: 'asc',
                    width: 100
                },

                {
                    label: 'Billing Name',
                    field: 'BILLING_NAME',
                    sort: 'asc',
                    width: 140
                },
                {
                    label: 'Shipping Info',
                    field: 'SHIPPING_INFO',
                    sort: 'asc',
                    width: 660
                },



            ],
            rows: []
        }

        if (orderRecord) {
            let i;
            orderRecord.forEach((order, i = 0) => {
                i++;
                data.rows.push({
                    SR: i,
                    id: order.order_id,
                    ORDER_DATE: new Date(order.order_date).toLocaleString('en-IN'),
                    ORDER_STATUS: order.orderStatus,
                    PAYMENT_STATUS: order.paymentStatus,
                    TRACKING_ID: order.tracking_id,
                    BANK_REF_NO: order.bank_ref_no,
                    PAYMENT_MODE: order.payment_mode,
                    CARD_NAME: order.card_name,
                    SALE_PRICE: order.sale_price,
                    PRODUCT_NAME: order.productName,
                    PAYMENT_MODE: order.payment_mode,
                    QUANTITY: order.quantity,
                    TOTAL_PRICE: order.totalPrice,
                    USER_NAME: order.userName,
                    TAX_PRICE: order.taxPrice,
                    TAX_RATE: order.tax_rate,
                    SHIPPING_PRICE: order.shippingPrice,
                    SHOP_LENGTH: order.shop_length,
                    BILLING_NAME: order.billing_name,
                    SHIPPING_INFO: `${order.flat ? order.flat + ',' : ""} ${order.area ? order.area + ',' : ""} ${order.landmark ? order.landmark + ',' : ""}
                    ${order.city ? order.city + ',' : ""} ${order.state ? order.state + ',' : ""} ${order.country ? order.country + ',' : ""} ${order.postalCode ? order.postalCode + '.' : ""} `,
                    GSTN: order.gstn,
                    REDEEM: order.redeem,
                    COUPON_CODE: order.coupon_code,

                })
            })
        }
        return data;
    }


    var csvData = JSON.parse(JSON.stringify(setOrders().rows ? setOrders().rows : []));

    const pdf = () => {
        doc.setLineWidth(5);
        doc.text(85, 15, "Orders Detailed Report");
        autoTable(doc, {
            startY: 20,
            head: [['ORDER_DATE', 'Order ID', 'Product Name', 'Price']],
            body: setOrders().rows.map((value) =>
                [new Date(value.ORDER_DATE).toLocaleDateString('en-IN'), value.id, value.PRODUCT_NAME, value.SALE_PRICE]
            ),
            foot: [[' ', 'Total Amount', '', `${totalAmount}`]],
            headStyles: { textColor: [255, 255, 255], },
            footStyles: { textColor: [255, 255, 255], },
            theme: 'grid',
            columnStyles: {
                0: { halign: 'right', cellWidth: 30, },
                1: { halign: 'left', cellWidth: 45, },
                2: { halign: 'left', cellWidth: 70, },
                3: { halign: 'right', cellWidth: 45, }
            },
        })


        doc.save('table.pdf')
    }

    const onChange = event => {
        if (event.target.id === 'date1') {
            setDate1(event.target.value)
            const formData = new FormData();
            if (date2) {
                formData.set("date1", event.target.value);
                formData.set("date2", date2);

                var object = {};
                formData.forEach((value, key) => object[key] = value);
                var json = object
                dispatch(allReports(json));
            }
        }


        if (event.target.id === 'date2') {
            setDate2(event.target.value)
            const formData = new FormData();
            if (date1) {
                formData.set("date1", date1);
                formData.set("date2", event.target.value);

                var object = {};
                formData.forEach((value, key) => object[key] = value);
                var json = object
                dispatch(allReports(json));
            }
        }



    }
    const reset = () => {
        setDate1("")
        setDate2("")
        dispatch(allReports());
    }
    return (
        <Fragment>
            <MetaData title={"Order Report Download"} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    {sidebar}
                </div>
                <Fragment>
                    <div className={`${list.display === 'block' ? "col-12 col-md-10" : "container col-12 col-md-12"}`}>
                        <Switch color="success" defaultChecked onClick={hide} />

                        <div className="row py-4 ml-3 center d-inline-flex p-4">

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>From Date</label>
                                        <input
                                            type="date"
                                            id="date1"
                                            className="form-control"
                                            onChange={onChange}
                                            value={date1}
                                            // onChange={(e) => setDate(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>To Date</label>
                                        <input
                                            type="date"
                                            id="date2"
                                            className="form-control"
                                            onChange={onChange}
                                            value={date2}
                                            // onChange={(e) => setDate(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-2 mt-4">
                                    <Button variant="contained" onClick={pdf} endIcon={<i class="fa fa-file-pdf-o text-danger bg-light" aria-hidden="true"></i>}>
                                        PDF
                                    </Button>
                                </div>
                                <div className="col-md-2 mt-4">
                                    <CSVLink data={csvData} filename={"orders.csv"} target="_blank"><Button variant="contained" endIcon={<i class="fa fa-file-excel-o text-success bg-light" aria-hidden="true"></i>}>
                                        Excel
                                    </Button></CSVLink>
                                </div>

                                <div className="col-md-1 mt-4">
                                    <Button style={{ marginLeft: "200px" }} type="reset" variant="contained" value='reset' title="Reset" onClick={reset} >
                                        <i class="fa fa-refresh" aria-hidden="true"></i>
                                    </Button>
                                </div>

                            </div>

                        </div>

                        <div className="ml-2">
                            <div className="row">
                                <div className='text-secondary my-2 col-md-3'><h5>Total Net Sales : Rs {totalAmount}</h5> </div>
                            </div>
                            {loading ? <Loader /> : (
                                <div style={{ height: 800, width: '100%' }}>
                                    <DataGrid
                                        {...setOrders()}
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Fragment >
            </div >
            <ToastContainer />
        </Fragment >
    )
}

export default ReportReport