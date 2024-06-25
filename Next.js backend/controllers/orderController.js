const { queryDatabase, executeTransaction } = require('./query');
const ErrorHandler = require('../utils/errorHandler');
const { trim } = require('../utils/trim');
const { generateFullQuery } = require('../utils/generateFullQuery');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
var easyinvoice = require('easyinvoice');
var fs = require('fs');
const pdf = require('html-pdf');
const path = require("path");
const winston = require('../winston/config');
const { log } = require('winston');
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 1000;

// Create a new order   =>  /api/v1/order/new
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderInfo: { itemsPrice, shippingPrice, totalPrice, order_id, redeem = 0, coupon_code },
        shippingInfo: { name = "", mobile = "", flat = "", area = "", landmark = "", city = "", state = "", country = "", postalCode = "", gstn = "" },
        shop_length = 0,
        orderItems
    } = req.body;
    const tracking_id = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const paidAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const delivered_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const user_id = req.user.id;
    const user_name = req.user.name;
    let stockAvailable = true;

    try {
        for (let item of orderItems) {
            const { product, quantity, stock } = item;
            const orderStockResult = await queryDatabase('SELECT stock FROM products WHERE id = ?', [product]);
            if (orderStockResult[0].stock < quantity) {
                stockAvailable = false;
                break;
            }
        }

        if (!stockAvailable) {
            return res.status(400).send({ message: "Product is out of stock. Order could not be Placed" });
        }

        const orderPromises = orderItems.map(async (oi) => {
            const { product, name, sale_price, image, quantity, tax_rate = 0, tax_amount = 0 } = oi;
            const productName = name.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");

            const insertOrderQuery = `
                INSERT INTO orders (
                    id, order_id, order_date, delivered_date, orderStatus, paymentStatus,
                    tracking_id, bank_ref_no, payment_mode, card_name, product_id, sale_price,
                    productName, quantity, path, totalPrice, taxPrice, tax_rate, shippingPrice, shop_length,
                    user_id, userName, billing_name, mobile, gstn, flat, area, landmark, city, state, country, postalCode,
                    redeem, coupon_code, reason
                ) VALUES (
                    NULL, ?, NOW(), NULL, 'Processing', '',
                    ?, '', '', '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ''
                )
            `;
            const updateStockQuery = 'UPDATE products SET stock = stock - ?, top = top + 1 WHERE id = ?';
            await queryDatabase(insertOrderQuery, [
                order_id, tracking_id, product, sale_price, productName, quantity, image, totalPrice,
                tax_amount, tax_rate, shippingPrice, shop_length, user_id, user_name, name, mobile, gstn,
                flat, area, landmark, city, state, country, postalCode, redeem, coupon_code
            ]);
            await queryDatabase(updateStockQuery, [quantity, product]);
        });

        await Promise.all(orderPromises);

        res.status(200).json({
            success: true,
            orderStockResult: stockAvailable
        });
    } catch (error) {
        console.error("New order could not be created:", error.message);
        return res.status(400).send({ message: "Operation could not be completed" });
    }
});

// Get single order   =>   /api/v1/order/:id
exports.getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `select * from orders where id=?`;
    try {
        const rows = await queryDatabase(sql, [EID]);
        if (!rows.length) {
            return res.status(400).send({ message: 'Order could not be identified ' });
        }

        const order = rows[0];
        return res.status(200).json({ success: true, order });
    } catch (error) {
        winston.info("Operation could not be completed:-", error.message);
        console.log("Operation could not be completed:-", error.message);
        return res.status(400).send({ message: 'Operation could not be completed' });
    }
});


// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const sql = `SELECT * FROM orders WHERE user_id = ? AND orderStatus != 'Cancel' AND orderStatus != 'Return' AND orderStatus != 'Return Approved' ORDER BY id DESC;`;
    const sql1 = `SELECT * FROM orders WHERE user_id = ? AND orderStatus = 'Cancel' ORDER BY id DESC;`;
    const sql2 = `SELECT * FROM orders WHERE user_id = ? AND (orderStatus = 'Return' OR orderStatus = 'Return Approved') ORDER BY id DESC;`;

    try {
        const [orders, canceledOrders, returnOrders] = await Promise.all([
            queryDatabase(sql, [req.user.id]),
            queryDatabase(sql1, [req.user.id]),
            queryDatabase(sql2, [req.user.id])
        ]);

        return res.status(200).json({ success: true, orders, canceledOrders, returnOrders });
    } catch (error) {
        winston.info("Operation could not be completed:-", error.message);
        console.log("Operation could not be completed:-", error.message);
        return res.status(400).send({ message: 'Operation could not be completed' });
    }
});



// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    let totalAmount = 0;
    let returnAmount = 0;
    let allAmount = 0;
    let orders;
    let failOrders;
    let userOrders;
    let cancelOrders;
    let returnOrders;
    const sql = `select * from orders where orderStatus != 'Cancel' and orderStatus != 'Return' and orderStatus != 'Return Approved' and paymentStatus = "Success" order by id DESC;`;
    const sql4 = `select * from orders where paymentStatus = "Fail" order by id DESC;`;
    const sql1 = `select * from orders where orderStatus = 'Cancel' order by id DESC;`;
    const sql2 = `select * from orders where orderStatus != 'Cancel' and orderStatus != 'Delivered' and orderStatus != 'Return' and orderStatus != 'Return Approved' and paymentStatus = "Success";`;
    const sql3 = `select * from orders where orderStatus = 'Return' or orderStatus = 'Return Approved' order by id DESC;`;

    try {
        const [rows, rows4, rows1, rows2, rows3] = await Promise.all([
            queryDatabase(sql),
            queryDatabase(sql4),
            queryDatabase(sql1),
            queryDatabase(sql2),
            queryDatabase(sql3)
        ]);

        orders = rows;
        failOrders = rows4;
        userOrders = rows2;
        cancelOrders = rows1;
        returnOrders = rows3;

        userOrders.forEach(order => {
            totalAmount += parseInt(order.sale_price);
        });

        returnOrders.forEach(order => {
            if (order.orderStatus === "Return") {
                returnAmount += parseInt(order.sale_price);
            }
        });

        orders.forEach(order => {
            if (order.orderStatus === "Delivered") {
                allAmount += parseInt(order.sale_price);
            }
        });

        return res.status(200).json({
            success: true,
            totalAmount,
            orders,
            cancelOrders,
            returnOrders,
            failOrders,
            returnAmount,
            allAmount
        });
    } catch (error) {
        winston.info("Operation could not be completed:-", error.message);
        console.log("Operation could not be completed:-", error.message);
        return res.status(400).send({ message: 'Operation could not be completed' });
    }
});


// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql1 = `select * from orders where id=?`;
    let sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=?
    and orderStatus !='Delivered' and orderStatus !='Return Approved' and paymentStatus = "Success";`;

    if (req.body.status === "Return") {
        sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=? and orderStatus ='Delivered' and paymentStatus = "Success";`;
    }

    if (req.body.status === "Return Approved") {
        sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=? and orderStatus ='Return' and paymentStatus = "Success";`;
    }

    let result = async function () {
        try {
            const [rows, rows1] = await Promise.all([
                queryDatabase(sql, [EID]),
                queryDatabase(sql1, [EID])
            ]);

            let quantity = rows1[0].quantity;
            let product_id = rows1[0].product_id;

            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "This order could not be updated. You have already marked it as delivered or failed." });
            } else {
                if (req.body.status === 'Cancel' || req.body.status === 'Return Approved') {
                    const updateStockSQL = `UPDATE products 
                    SET stock = CASE
                        WHEN (stock - ?) >= 0 THEN (stock - ?)
                        ELSE 0
                    END
                    WHERE id = ?;`;

                    const rows3 = await queryDatabase(updateStockSQL, [quantity, quantity, product_id]);

                    if (!rows3.affectedRows) {
                        return res.status(400).send({ message: 'Product stock quantity could not be updated' });
                    }
                }
            }

        } catch (err) {
            winston.info(err.message);
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Operation could not be completed" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({ success: true });
        }).catch(error => {
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});


//Cancel order  =>   /api/v1/admin/order/cancel/:id
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const reason = req.body.reason;

    const cancelOrderSQL = `
        UPDATE orders o
        INNER JOIN products p ON o.product_id = p.id
        SET o.orderStatus = 'Cancel',
            o.delivered_date = NOW(),
            o.reason = ?,
            p.stock = p.stock + o.quantity
        WHERE o.id = ? 
          AND o.orderStatus != 'Delivered';
    `;

    try {
        await queryDatabase('START TRANSACTION');

        const cancelResult = await queryDatabase(cancelOrderSQL, [reason, EID]);

        if (cancelResult.affectedRows === 0) {
            throw new Error('Cancel order could not be completed');
        }

        await queryDatabase('COMMIT');

        res.status(200).json({ success: true });
    } catch (error) {
        await queryDatabase('ROLLBACK');

        winston.info(error.message);
        console.log(error.message);

        res.status(400).json({ message: 'Operation could not be completed' });
    }
});




//Return order  =>   /api/v1/admin/order/return/:id
exports.returnOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const reason = req.body.reason;

    const returnOrderSQL = `
        UPDATE orders o
        INNER JOIN products p ON o.product_id = p.id
        SET o.orderStatus = 'Return',
            o.delivered_date = NOW(),
            o.reason = ?,
            p.stock = p.stock + o.quantity
        WHERE o.id = ? 
          AND o.orderStatus = 'Delivered';
    `;

    try {
        await queryDatabase('START TRANSACTION');

        const returnResult = await queryDatabase(returnOrderSQL, [reason, EID]);

        if (returnResult.affectedRows === 0) {
            throw new Error('Return order could not be completed');
        }

        await queryDatabase('COMMIT');

        res.status(200).json({ success: true });
    } catch (error) {
        await queryDatabase('ROLLBACK');

        winston.info(error.message);
        console.log(error.message);

        res.status(400).json({ message: 'Operation could not be completed' });
    }
});



//Cancel Return order  =>   /api/v1/admin/order/cancelReturn/:id
exports.cancelReturnOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const reason = req.body.reason;

    const cancelReturnOrderSQL = `
        UPDATE orders o
        INNER JOIN products p ON o.product_id = p.id
        SET o.orderStatus = 'Delivered',
            o.delivered_date = NOW(),
            p.stock = p.stock - o.quantity
        WHERE o.id = ? 
          AND o.orderStatus = 'Return';
    `;

    try {
        await queryDatabase('START TRANSACTION');

        const [cancelReturnResult, orderResult] = await Promise.all([
            queryDatabase(cancelReturnOrderSQL, [EID]),
            queryDatabase(`SELECT * FROM orders WHERE id = ${EID}`)
        ]);

        const order = orderResult[0];

        if (cancelReturnResult.affectedRows === 0) {
            throw new Error('Cancel return order could not be completed');
        }

        await queryDatabase('COMMIT');

        res.status(200).json({ success: true });
    } catch (error) {
        await queryDatabase('ROLLBACK');

        winston.info(error.message);
        console.log(error.message);

        res.status(400).json({ message: 'Operation could not be completed' });
    }
});


// Delete order   =>   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `delete from orders where id=?;`;
    const sql1 = "ALTER TABLE orders AUTO_INCREMENT=1;"

    let result = async function () {
        try {
            const [rows, rows1] = await Promise.all([
                queryDatabase(sql, [EID]),
                queryDatabase(sql1)
            ]);

            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "Operation could not be completed" });
            }
        } catch (err) {
            winston.info(err.message);
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Operation could not be completed" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({ success: true });
        }).catch(error => {
            winston.info("Order could not be deleted :-", error.message);
            console.log("Order could not be deleted :-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});

// Create a new coupon   =>  /api/v1/coupon/new
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    var coupon_code = req.body.coupon_code;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var lastDate = req.body.lastDate;
    var cashback = req.body.cashback;
    var minValue = req.body.minValue;
    var description = req.body.description.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");

    const insertCouponSQL = ` INSERT INTO coupon (id, user_id, coupon_code, date, lastDate, cashback, minValue, description, order_id) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 0) `;
    const couponValues = [req.user.id, coupon_code, date, lastDate, cashback, minValue, description];
    let result = async function () {
        try {
            const rows = await queryDatabase(insertCouponSQL, couponValues);
        } catch (err) {
            winston.info(err.message);
            console.log(err.message);
            return res.status(400).send({ message: "Coupon could not be created" });
        }
    };

    result()
        .then(value => {
            res.status(200).json({ success: true });
        }).catch(error => {
            winston.info("New coupon code could not be created :-", error.message)
            console.log("New coupon code could not be created :-", error.message)
            return res.status(400).send({ message: "Coupon could not be created" });
        });
});



// Get all coupon - ADMIN  =>   /api/v1/admin/coupon/new
exports.allCoupons = catchAsyncErrors(async (req, res, next) => {
    try {
        const sql = `SELECT * FROM coupon ORDER BY id DESC`;
        const rows = await queryDatabase(sql);

        // Send response
        res.status(200).json({
            success: true,
            coupons: rows
        });
    } catch (err) {
        // Rollback transaction if an error occurs
        winston.error("Error retrieving coupons:", err.message);
        console.error("Error retrieving coupons:", err.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});



// Delete coupon   =>   /api/v1/admin/coupon/:id
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql = `delete from coupon where id=?;`;
    const sql1 = "ALTER TABLE coupon AUTO_INCREMENT=1;"

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [EID]);
            const rows1 = await queryDatabase(sql1);
            if (!rows.affectedRows) {
                return res.status(404).send({ status: 1, message: "No Coupon found with this ID" });
            }
        } catch (err) {
            winston.info("Coupon could not be deleted :-", err.message);
            console.log("Coupon could not be deleted :-", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        }).catch(error => {
            winston.info("Coupon could not be deleted :-", error.message);
            console.log("Coupon could not be deleted :-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});


// Get single coupon   =>   /api/v1/admin/coupons/:id
exports.getCouponDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    let coupon;
    const sql = `select * from coupon where id=?;`

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [EID]);
            if (!rows.length) {
                return res.status(400).send({ message: 'No coupon found with this ID' });
            }
            coupon = rows[0];
        } catch (err) {
            winston.info("Operation could not be completed:-", err.message);
            console.log("Operation could not be completed:-", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                coupon
            });
        }).catch(error => {
            winston.info("Operation could not be completed:-", error.message);
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});


//update coupon  =>   /api/v1/admin/coupon/:id
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    let coupon;
    if (req.body.description) {
        req.body.description = req.body.description
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/`/g, "\\`");
    }
    const sql = `update coupon set ? where id = ?`

    let result = async function () {
        try {
            const rows = await queryDatabase(sql, [req.body, EID]);
            coupon = rows;

            if (!rows.affectedRows) {
                return res.status(400).send({ message: "Coupon could not be updated" });
            }
        } catch (err) {
            winston.info("Coupon could not be updated:", err.message);
            console.log("Coupon could not be updated:", err.message);
            return res.status(400).send({ message: 'Coupon could not be updated' });
        }
    };

    result()
        .then((value) => {
            res.status(200).json({
                success: true,
            });
        })
        .catch((error) => {
            winston.info("Operation could not be completed:", error.message);
            console.log("Operation could not be completed:", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
});


// Delete order status Fialed 
exports.deleteFailOrder = catchAsyncErrors(async (req, res, next) => {
    const sql = `delete from orders where order_date < DATE_SUB( current_timestamp() , INTERVAL 22 DAY ) and paymentStatus= 'Fail'`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql);
        } catch (err) {
            winston.error("Error deleting fail orders:", err.message);
            console.error("Error deleting fail orders:", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            winston.error("Operation could not be completed:", error.message);
            console.error("Operation could not be completed:", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});


// Delete order status 
exports.deleteOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const sql = `select * from orders WHERE order_date < DATE_SUB( current_timestamp() , INTERVAL 0.30 hour ) and paymentStatus!= 'Success' and paymentStatus!= 'Fail';`;

    let result = async function () {
        try {
            const rows = await queryDatabase(sql);
            if (rows.length) {
                for (const val of rows) {
                    //reason 1 means stock has been already updated
                    if (val.reason != 1) {
                        const sql2 = `update products set stock=stock+${val.quantity}, top=top-1 where id=${val.product_id}`;
                        await queryDatabase(sql2);
                        const sql3 = `update orders set reason=1 where id=${val.id}`;
                        await queryDatabase(sql3);
                    }
                    const sql1 = `delete from orders WHERE order_date < DATE_SUB( current_timestamp() , INTERVAL 6 hour ) and paymentStatus!= 'Success' and paymentStatus!= 'Fail'
                     and id=${val.id};`;
                    await queryDatabase(sql1);
                }
            }

        } catch (err) {
            winston.error("Error deleting order status:", err.message);
            console.error("Error deleting order status:", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true
            });
        })
        .catch(error => {
            winston.error("Operation could not be completed:", error.message);
            console.error("Operation could not be completed:", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});



exports.invoicePdf = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    try {
        const sql = `select * from orders where id=?;`;
        const rows = await queryDatabase(sql, [EID]);

        if (!rows.length) {
            throw new Error('No order found with this ID');
        }


        // Extract data from rows
        const data = {
            invoiceNo: rows[0].order_id || '#',
            order_date: new Date(rows[0].order_date).toLocaleDateString('en-IN') || '',
            customerName: rows[0].billing_name || '',
            mobile: rows[0].mobile || '',
            address: `${rows[0].flat ? rows[0].flat + "," : ""} ${rows[0].area ? rows[0].area + "," : ""} ${rows[0].landmark ? rows[0].landmark : ""}`,
            city: `${rows[0].city ? rows[0].city + "," : ""} ${rows[0].postalCode || ""}`,
            country: `${rows[0].state ? rows[0].state + "," : ""} ${rows[0].country ? rows[0].country + "," : ""}`,
            productName: rows[0].productName || '',
            price: rows[0].sale_price - Number(rows[0].taxPrice).toFixed(2) || 0,
            quantity: rows[0].quantity || 0,
            paymentStatus: rows[0].paymentStatus === "Success" ? "Paid" : "Pending",
            itmePrice: (rows[0].sale_price - Number(rows[0].taxPrice).toFixed(2)) * rows[0].quantity,
            gst_amount: Number(rows[0].taxPrice).toFixed(2),
            tax_rate: "18%",
            shippingPrice: Number(rows[0].shippingPrice).toFixed(2),
            totalAmount: Number(rows[0].totalPrice).toFixed(2)
        };

        // Read the HTML template
        const htmlTemplate = fs.readFileSync('./invoice.html', 'utf8');

        // Replace placeholders with data
        const htmlWithData = htmlTemplate.replace(/{{\s*([^}]+)\s*}}/g, (match, key) => {
            return data[key.trim()] || '';
        });

        // Debug: Log HTML content before PDF generation

        // Options for PDF generation (adjust as needed)
        const options = {
            format: 'A4',
            border: {
                top: '0in',
                right: '0in',
                bottom: '0in',
                left: '0in'
            }
        };


        const pdfPath = path.join(process.cwd(), `invoice/${data.invoiceNo}.pdf`);

        // Generate PDF
        pdf.create(htmlWithData, options).toFile(pdfPath, (err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).send('Error generating PDF');
            }

            console.log('PDF generated successfully:', pdfPath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${data.invoiceNo}.pdf"`);

            // Send the PDF file to client
            fs.readFile(pdfPath, (err, data) => {
                if (err) {
                    console.error('Error reading PDF file:', err);
                    return res.status(500).send('Error reading PDF file');
                }
                res.send(data);
            });
        });


    } catch (err) {
        console.error("Error generating invoice:", err.message);
        return res.status(400).send({ message: 'Invoice Not Generated' });
    }
});


// Get all graph - ADMIN  =>   /api/v1/admin/report/
exports.sales = catchAsyncErrors(async (req, res, next) => {
    let sales = [];
    let processing;
    let shipped;
    let delivered;
    let cancel;
    let returned;
    let returnApproved;
    let yearSales = [];

    let result = async function () {
        try {
            const sql1 = `select count(*) as processing from orders where orderStatus = 'Processing' and paymentStatus="Success";`;
            const rows1 = await queryDatabase(sql1);
            processing = rows1[0];

            const sql2 = `select count(*) as shipped from orders where orderStatus = 'Shipped' and paymentStatus="Success";`;
            const rows2 = await queryDatabase(sql2);
            shipped = rows2[0];

            const sql3 = `select count(*) as delivered from orders where orderStatus = 'Delivered' and paymentStatus="Success";`;
            const rows3 = await queryDatabase(sql3);
            delivered = rows3[0];

            const sql4 = `select count(*) as cancel from orders where orderStatus = 'Cancel' and paymentStatus="Success";`;
            const rows4 = await queryDatabase(sql4);
            cancel = rows4[0];

            const sql5 = `select count(*) as returned from orders where orderStatus = 'Return' and paymentStatus="Success";`;
            const rows5 = await queryDatabase(sql5);
            returned = rows5[0];

            const sql6 = `select count(*) as returnApproved from orders where orderStatus = 'Return Approved' and paymentStatus="Success";`;
            const rows6 = await queryDatabase(sql6);
            returnApproved = rows6[0];

            for (let i = 0; i < 10; i++) {
                const sql7 = `select sum(sale_price) as sale_price from orders where order_date = YEAR(CURDATE()) - ${i};`;
                const rows7 = await queryDatabase(sql7);
                yearSales.push(rows7[0].sale_price ? rows7[0].sale_price : 0);
            }

            const sql9 = `select sale_price, order_date from orders where order_date > DATE_SUB(current_timestamp(), INTERVAL 365 DAY) and paymentStatus="Success";`;
            const rows9 = await queryDatabase(sql9);
            sales = rows9;

        } catch (err) {
            winston.error("Error fetching sales data:", err.message);
            console.error("Error fetching sales data:", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                processing,
                shipped,
                delivered,
                cancel,
                returned,
                returnApproved,
                yearSales,
                sales
            });
        })
        .catch(error => {
            winston.error("Error fetching sales data:", error.message);
            console.error("Error fetching sales data:", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});



// Get all report - ADMIN  =>   /api/v1/admin/report/
exports.allReport = catchAsyncErrors(async (req, res, next) => {
    let totalAmount = 0;
    let orderRecord;

    let sql = `select * from orders  where orderStatus !='Cancel' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success" order by id DESC;`;

    if (req.body.date1 && req.body.date2) {
        sql = `select * from orders  where orderStatus !='Cancel' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success" and (order_date BETWEEN '${req.body.date1}' AND '${req.body.date2}') order by id DESC;`;
    }

    let result = async function () {
        try {
            const rows = await queryDatabase(sql);
            orderRecord = rows;

            orderRecord.forEach(order => {
                totalAmount += parseInt(order.totalPrice)
            });
        } catch (err) {
            winston.error("Error fetching report:", err.message);
            console.error("Error fetching report:", err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        }
    };

    result()
        .then(value => {
            res.status(200).json({
                success: true,
                totalAmount,
                orderRecord
            });
        })
        .catch(error => {
            winston.error("Error fetching report:", error.message);
            console.error("Error fetching report:", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
});
