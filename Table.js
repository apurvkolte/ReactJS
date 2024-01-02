import { MDBDataTable } from 'mdbreact'
import Link from 'next/link'


const csvData = JSON.parse(JSON.stringify(orders ? orders : []));
const setOrders = () => {
    const data = {
        columns: [
            {
                label: 'Order ID',
                field: 'id',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Product',
                field: 'name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'GSTN No',
                field: 'gstn',
                sort: 'asc',
                width: 160
            },
            {
                label: 'Order Date',
                field: 'date',
                sort: 'asc',
                width: 100
            },
            {
                label: 'User',
                field: 'userName',
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
                label: 'Payment',
                field: 'payment',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Delivery Status',
                field: 'status',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Actions',
                field: 'actions',
                width: 120
            },
        ],
        rows: []
    }

    orders && orders.forEach(order => {
        if (order.paymentStatus) {
            const EID1 = Buffer.from(`${order.id}`, 'binary').toString('base64')
            data.rows.push({
                id: order.order_id,
                date: order.order_date.substring(0, 10),
                userName: order.userName,
                gstn: order.gstn,
                name: <Link className='proda' href={`/product-details/${Buffer.from(`${order.product_id}`, 'binary').toString('base64')}?${encodeURIComponent(order.productName)}`}>{order.productName + " (Qty:" + order.quantity + ")"}</Link>,
                price: `₹${order.sale_price}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{String(order.paymentStatus).includes('Success') ? order.orderStatus : "-"}</p>,
                payment: order.paymentStatus && String(order.paymentStatus).includes('Success')
                    ? <p style={{ color: 'green' }}>{order.paymentStatus}</p>
                    : <p style={{ color: 'red' }}>{order.paymentStatus ? order.paymentStatus : "NOT PAID"}</p>,
                actions: <Fragment>
                    <button onClick={() => { window.location.href = `/admin/orders/${EID1}` }} className="btn py-2 px-3 ml-2 mb-2">
                        <i className="fa fa-eye"></i>
                    </button>
                    {String(order.paymentStatus).includes('Success') ? (<>
                        <button className="btn py-2 px-3 ml-2 mb-2" title='print' onClick={() => orderInvoiceHandler(EID1, order.order_date)}>
                            <i className="fa fa-print" aria-hidden="true"></i>
                        </button>
                    </>) : ("")}
                </Fragment>
            })
        }
    })

    return data;
}





<MDBDataTable
    data={setOrders()}
    className="px-3"
    bordered
    striped
    hover scrollX
    exportToCSV
/>
