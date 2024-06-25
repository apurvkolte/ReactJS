const shortid = require('shortid')
const Razorpay = require('razorpay')
const crypto = require('crypto');
const { queryDatabase, executeTransaction } = require('./query');
const { generateFullQuery } = require('../utils/generateFullQuery');
const winston = require('../winston/config');
const { trim } = require('../utils/trim');

const razorpay = new Razorpay({
    key_id: process.env.keyId,
    key_secret: process.env.keySecret,
});

const secret_key = process.env.keySecret

exports.verification = async function (req, res) {
    const { orderId, paymentId } = req.body.orderDetails;
    const status = req.body.status;
    const bodyString = `${orderId}|${paymentId}`;
    const shasum = crypto.createHmac('sha256', secret_key);
    shasum.update(bodyString);
    const digest = shasum.digest('hex');

    const razorpaySignatureHeader = Object.keys(req.headers).find(key => key.toLowerCase() === 'x-razorpay-signature');
    const razorpaySignature = req.headers[razorpaySignatureHeader];

    require('fs').appendFileSync('./bill/payment.json', JSON.stringify(req.body, null, 4))

    if (digest === razorpaySignature) {
        // console.log('request is legit')
        //We can send the response and store information in a database.
        if (status === 'Success') {
            try {
                const sql = `UPDATE orders SET paymentStatus = ?, tracking_id=? WHERE order_id = ?;`;

                const orderDb = await queryDatabase(sql, [status, paymentId, orderId]);

                if (!orderDb.affectedRows) {
                    return res.status(400).send('Invalid signature');
                }

                // return res.status(200).json({ redirectTo: 'http://localhost:3000/success' });
                res.status(200).json({
                    success: true,
                    message: "Payment verification successful",
                    orderId,
                    status
                });
            } catch (error) {
                console.error('Error handling successful payment:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            res.status(400).send('Invalid signature');
        }
        // res.json({
        //     status: 'ok'
        // })
    } else if (status.toLowerCase() === 'fail') {
        console.log("Fail");
        try {
            const updateOrderQuery = `UPDATE orders SET paymentStatus = ? WHERE order_id = ?`;
            const orderDb = await queryDatabase(updateOrderQuery, [status, orderId]);

            const selectOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
            const orders = await queryDatabase(selectOrderQuery, [orderId]);

            if (orders.length) {
                for (const order of orders) {
                    const updateProductQuery = `UPDATE products SET stock = stock + ?, top = top - 1 WHERE id = ?`;
                    await queryDatabase(updateProductQuery, [order.quantity, order.product_id]);
                }
            } else {
                console.log("Product status failed but stock is not updated quantity-1.");
            }

            // res.status(400).send('Invalid signature');
            res.status(200).json({
                success: true,
                message: 'Payment fail',
                orderId,
                status
            });

        } catch (err) {
            console.error("Error handling failed payment:", err);
            return res.status(400).send('Invalid signature');
        }
    } else if (status.toLowerCase() === 'cancel' || status.toLowerCase() === "timeout") {
        console.log("here");
        try {
            const updateOrderQuery = `UPDATE orders SET paymentStatus = ? WHERE order_id = ?`;
            const orderDb = await queryDatabase(updateOrderQuery, [status, orderId]);

            const selectOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
            const orders = await queryDatabase(selectOrderQuery, [orderId]);

            if (orders.length) {
                for (const order of orders) {
                    const updateProductQuery = `UPDATE products SET stock = stock + ?, top = top - 1 WHERE id = ?`;
                    await queryDatabase(updateProductQuery, [order.quantity, order.product_id]);
                }
            } else {
                console.log("Product status failed but stock is not updated quantity-1.");
            }

            // res.status(400).send('Invalid signature');
            res.status(200).json({
                success: true,
                message: 'Payment cancel',
                orderId,
                status
            });

        } catch (err) {
            console.error("Error handling failed payment:", err);
            return res.status(400).send('Invalid signature');
        }
    } else {
        res.status(400).send('Invalid signature');
    }

}


exports.razorpay = async function (req, res, next) {
    const options = {
        amount: Number(req.body.amount).toFixed(),
        currency: "INR",
        receipt: shortid.generate(),
        payment_capture: 1
    };

    try {
        const response = await razorpay.orders.create(options);
        // console.log("response", response);

        const { orderItems, shippingInfo, orderInfo, shop_length = 0 } = req.body.order;
        const parsedOrderItems = JSON.parse(orderItems);
        let { itemsPrice, shippingPrice, totalPrice, redeem = 0, coupon_code } = orderInfo;
        let stockAvailable = true;

        const trimValue = (value) => value ? trim(value) : "";
        const { name = "", mobile = "", flat = "", area = "", landmark = "", city = "", state = "", country = "", postalCode = "", gstn = "" } = shippingInfo;
        const trimmedShippingInfo = {
            name: trimValue(name),
            mobile: trimValue(mobile),
            flat: trimValue(flat),
            area: trimValue(area),
            landmark: trimValue(landmark),
            city: trimValue(city),
            state: trimValue(state),
            country: trimValue(country),
            postalCode: trimValue(postalCode),
            gstn
        };

        const user_id = req.user.id;
        const user_name = req.user.name;

        for (const oi of parsedOrderItems) {
            const product_id = oi.product;
            const productName = oi.name.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");
            const sale_price = oi.sale_price;
            const path = oi.image;
            const quantity = oi.quantity;
            const tax_rate = oi.tax_rate || 0;
            const tax_amount = oi.tax_amount || 0;
            const stock = oi.stock;

            const checkPriceSql = 'SELECT * FROM products WHERE id = ?';
            const match_price = await queryDatabase(checkPriceSql, [product_id]);

            if (stock >= quantity && sale_price == match_price[0].sale_price) {
                const sql = `INSERT INTO orders(
                    id, order_id, order_date, delivered_date, orderStatus, paymentStatus,
                    tracking_id, ip, bank_ref_no, payment_mode, card_name, product_id, sale_price,
                    productName, quantity, path, totalPrice, taxPrice, tax_rate, shippingPrice, shop_length, user_id, userName,
                    billing_name, mobile, gstn, flat, area, landmark, city, state, country, postalCode, redeem, coupon_code, reason
                 ) VALUES (
                    NULL, ?, NOW(), NULL, 'Processing', '',
                    '', ?, '', '', '', ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,''
                 )`;

                const values = [response.id, req.ip, product_id, sale_price, productName, quantity, path, totalPrice, tax_amount, tax_rate, shippingPrice, shop_length, user_id, user_name, trimmedShippingInfo.name, trimmedShippingInfo.mobile, trimmedShippingInfo.gstn, trimmedShippingInfo.flat, trimmedShippingInfo.area, trimmedShippingInfo.landmark, trimmedShippingInfo.city, trimmedShippingInfo.state, trimmedShippingInfo.country, trimmedShippingInfo.postalCode, redeem, coupon_code];
                const sql1 = `UPDATE products SET stock = stock - ?, top = top + 1 WHERE id = ?;`;

                try {
                    // generateFullQuery(sql1, [quantity, product_id])
                    const rows1 = await queryDatabase(sql1, [quantity, product_id]);
                    if (rows1.affectedRows) {
                        const rows = await queryDatabase(sql, values);

                        // console.log("rows", rows);
                        if (!rows.affectedRows) {
                            return res.status(400).send({ message: "Order could not be Placed" });
                        }
                    } else {
                        return res.status(400).send({ message: "Product is out of stock. Order could not be Placed" });
                    }
                } catch (error) {
                    console.error("Error executing SQL queries:", error);
                    return res.status(500).send({ message: "Internal Server Error" });
                }

            } else {
                stockAvailable = false;
                res.status(400).send("Product price or stock mismatch");
            }
        }

        res.status(200).json({
            success: true,
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            orderStockResult: stockAvailable
        });

    } catch (err) {
        winston.info(err.message);
        console.log(err.message);
        res.status(400).send('Not able to create order. Please try again!');
    }
};


exports.refund = async function (req, res) {
    try {

        //Verify the payment Id first, then access the Razorpay API.

        const options = {

            payment_id: req.body.paymentId,

            amount: req.body.amount,

        };

        const razorpayResponse = await razorpay.refund(options);

        //We can send the response and store information in a database

        res.send('Successfully refunded')

    } catch (error) {

        console.log(error);

        res.status(400).send('unable to issue a refund');

    }
}