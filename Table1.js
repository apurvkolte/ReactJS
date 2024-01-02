import { DataGrid, GridToolbar } from '@mui/x-data-grid';


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
                ORDER_DATE: order.order_date,
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





<div style={{ height: 400, width: '100%' }}>
    <DataGrid
        {...setOrders()}
        components={{
            Toolbar: GridToolbar,
        }}
    />
</div>