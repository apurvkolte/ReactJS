const util = require('util');
const connection = require('../config/connection');
const ErrorHandler = require('../utils/errorHandler');
const { trim } = require('../utils/trim');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
var easyinvoice = require('easyinvoice');
var fs = require('fs');
const path = require("path");

// Create a new order   =>  /api/v1/order/new
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    // console.log("orderInfo", req.body.orderInfo);
    // console.log("orderItems", req.body.orderItems);
    // console.log("shippingInfo", req.body.shippingInfo);
    var itemsPrice = req.body.orderInfo.itemsPrice;
    var shippingPrice = req.body.orderInfo.shippingPrice;
    var totalPrice = req.body.orderInfo.totalPrice;
    var order_id = req.body.orderInfo.order_id;
    var product_id;
    var productName;
    var sale_price;
    var path;
    var quantity;
    var tax_rate;
    var tax_amount;
    var reason = "";
    var stockAvailabe;


    const name1 = req.body.shippingInfo.name ? trim(req.body.shippingInfo.name) : "";
    const mobile = req.body.shippingInfo.mobile ? trim(req.body.shippingInfo.mobile) : "";
    const flat = req.body.shippingInfo.flat ? trim(req.body.shippingInfo.flat) : "";
    const area = req.body.shippingInfo.area ? trim(req.body.shippingInfo.area) : "";
    const landmark = req.body.shippingInfo.landmark ? trim(req.body.shippingInfo.landmark) : "";
    const city = req.body.shippingInfo.city ? trim(req.body.shippingInfo.city) : "";
    const state = req.body.shippingInfo.state ? trim(req.body.shippingInfo.state) : "";
    const country = req.body.shippingInfo.country ? trim(req.body.shippingInfo.country) : "";
    const postalCode = req.body.shippingInfo.postalCode ? trim(req.body.shippingInfo.postalCode) : "";
    var gstn = req.body.shippingInfo.gstn ? req.body.shippingInfo.gstn : "";

    const shop_length = req.body.shop_length ? req.body.shop_length : 0;
    const tracking_id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);

    // var paymentStatus = req.body.shippingInfo.paymentStatus
    var redeem = req.body.orderInfo.redeem ? req.body.orderInfo.redeem : 0;
    var coupon_code = req.body.orderInfo.coupon_code;
    var order_id = req.body.orderInfo.order_id;

    const paidAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const delivered_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const user_id = req.user.id;
    let order;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        for (let index = 0; index < req.body.orderItems.length; index++) {
            const orderStock = `select stock from products where id=${req.body.orderItems[index].product}`
            const orderStockResult = await query(orderStock);
            if (req.body.orderItems[index].stock >= req.body.orderItems[index].quantity) {
                if (orderStockResult[0].stock >= req.body.orderItems[index].quantity) {
                    stockAvailabe = true;
                } else {
                    stockAvailabe = false;
                }
            }
        }

        try {
            (req.body.orderItems).map(async (oi) => {
                product_id = oi.product;
                productName = oi.name.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");
                sale_price = oi.sale_price;
                path = oi.image;
                quantity = oi.quantity;
                tax_rate = oi.tax_rate ? oi.tax_rate : 0;
                tax_amount = oi.tax_amount ? oi.tax_amount : 0
                stock = oi.stock

                if (stock >= quantity) {
                    const sql = `insert into orders(id,order_id,order_date,delivered_date,orderStatus,paymentStatus,
                    tracking_id,bank_ref_no,payment_mode,card_name,product_id,sale_price,
                    productName,quantity,path,totalPrice,taxPrice,tax_rate,shippingPrice,shop_length,user_id,userName,
                    billing_name,mobile,gstn,flat,area,landmark,city,state,country,postalCode,redeem,coupon_code,reason) values(NULL,${order_id},
                        NOW(),NULL,"Processing", "",
                        "${tracking_id}","","","",${product_id},${sale_price},"${productName}",${quantity},"${path}",
                        ${totalPrice},${tax_amount},${tax_rate},${shippingPrice},${shop_length},${user_id},"${req.user.name}","${name1}","${mobile}","${gstn}","${flat}","${area}","${landmark}","${city}","${state}",
                        "${country}","${postalCode}","${redeem}","${coupon_code}","${reason}");`;
                    const sql1 = `update products set stock=stock-${quantity}, top=top+1 where id=${product_id};`
                    const rows1 = await query(sql1);
                    if (rows1.affectedRows) {
                        const rows = await query(sql);
                        if (!rows.affectedRows) {
                            return res.status(400).send({ message: "Order could not be Placed" });
                        }
                    } else {
                        return res.status(400).send({ message: "Product is out of stock. Order could not be Placed" });
                    }

                }
            });
        } catch (err) {
            console.log(err.message);
            stockAvailabe = false;
            return res.status(400).send({ message: "Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                orderStockResult: stockAvailabe
            })
        }).catch(error => {
            console.log("New order could not created :-", error.message);
            return res.status(400).send({ message: "Operation could not be completed" });
        });
})


// Get single order   =>   /api/v1/order/:id
exports.getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    let order;
    const sql = `select * from orders where id=${EID}`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            if (!rows.length) {
                return res.status(400).send({ message: 'Order could not be identified ' });
            }
            order = rows[0];
        } catch (err) {
            console.log(err.message);
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                order
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
})

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    let orders;
    let cancelOrders;
    let returnOrders;
    const sql = `select * from orders where user_id=${req.user.id} and orderStatus !='Cancel' and  orderStatus !='Return' and  orderStatus !='Return Approved' order by id DESC;`;
    const sql1 = `select * from orders where user_id=${req.user.id} and orderStatus ='Cancel' order by id DESC;`;
    const sql2 = `select * from orders where user_id=${req.user.id} and orderStatus ='Return' or  orderStatus ='Return Approved' order by id DESC;`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            const rows2 = await query(sql2);
            returnOrders = rows2;
            cancelOrders = rows1;
            orders = rows;
        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                orders,
                cancelOrders,
                returnOrders
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        });
})


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
    const sql = `select * from orders  where orderStatus !='Cancel' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success" order by id DESC;`;
    const sql4 = `select * from orders  where paymentStatus="Fail" order by id DESC;`;
    const sql1 = `select * from orders where orderStatus ='Cancel' order by id DESC;`;
    const sql2 = `select * from orders where orderStatus !='Cancel' and orderStatus !='Delivered' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success"`;
    const sql3 = `select * from orders where orderStatus = 'Return' or orderStatus= 'Return Approved' order by id DESC`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows4 = await query(sql4);
            const rows1 = await query(sql1);
            const rows2 = await query(sql2);
            const rows3 = await query(sql3);
            orders = rows;
            failOrders = rows4;
            userOrders = rows2;
            cancelOrders = rows1;
            returnOrders = rows3;

            userOrders.forEach(order => {
                totalAmount += parseInt(order.sale_price)
            })

            returnOrders.forEach(order => {
                if (order.orderStatus === "Return") {
                    returnAmount += parseInt(order.sale_price)
                }
            })

            rows.forEach(order => {
                if (order.orderStatus === "Delivered") {
                    allAmount += parseInt(order.sale_price)
                }
            })
        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                totalAmount,
                orders,
                cancelOrders,
                returnOrders,
                failOrders,
                returnAmount,
                allAmount

            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql1 = `select * from orders where id=${EID}`;
    var sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=${EID}
    and orderStatus !='Delivered' and orderStatus !='Return Approved' and paymentStatus = "Success";`;
    if (req.body.status === "Return") {
        sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=${EID} and  orderStatus ='Delivered' and paymentStatus = "Success";`;
    }
    if (req.body.status === "Return Approved") {
        sql = `update orders set orderStatus='${req.body.status}', delivered_date=NOW() where id=${EID} and  orderStatus ='Return' and paymentStatus = "Success";`;
    }
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            let quantity = rows1[0].quantity;
            let product_id = rows1[0].product_id;
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "This order could be updated. You have already status delivered or fail this order" });
            } else {
                if (req.body.status === 'Cancel' || req.body.status === 'Return Approved') {
                    const sql3 = `update products set stock=(stock-${quantity}) where id=${product_id};`;
                    const rows3 = await query(sql3);
                    if (!rows3.affectedRows) {
                        return res.status(400).send({ message: 'Product stock quantity could not updated' })
                    }
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
            })
        }).catch(error => {
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})

//Cancel order  =>   /api/v1/admin/order/cancel/:id
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql1 = `select * from orders where id=${EID}`;
    const sql = `update orders set orderStatus='Cancel', delivered_date=NOW(), reason='${req.body.reason}' where id=${EID}
    and orderStatus !='Delivered';`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            let quantity = rows1[0].quantity;
            let product_id = rows1[0].product_id;
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "Cancel order could not be completed" });
            } else {
                const sql3 = `update products set stock=(stock+${quantity}) where id=${product_id};`;
                const rows3 = await query(sql3);
                if (!rows3.affectedRows) {
                    return res.status(400).send({ message: 'Product quantity could not be updated' })
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Cancel order could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})


//Return order  =>   /api/v1/admin/order/return/:id
exports.returnOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql1 = `select * from orders where id=${EID}`;
    const sql = `update orders set orderStatus='Return', delivered_date=NOW(), reason='${req.body.reason}' where id=${EID}
    and orderStatus ='Delivered';`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            let quantity = rows1[0].quantity;
            let product_id = rows1[0].product_id;
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "Return order could not be completed" });
            } else {
                const sql3 = `update products set stock=(stock+${quantity}) where id=${product_id};`;
                const rows3 = await query(sql3);
                if (!rows3.affectedRows) {
                    return res.status(400).send({ message: 'Product quantity could not be updated' })
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Cancel order could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})

//Cancel Return order  =>   /api/v1/admin/order/cancelReturn/:id
exports.cancelReturnOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql1 = `select * from orders where id=${EID}`;
    const sql = `update orders set orderStatus='Delivered', delivered_date=NOW() where id=${EID}
    and orderStatus ='Return';`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            let quantity = rows1[0].quantity;
            let product_id = rows1[0].product_id;
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "Return order could not be completed" });
            } else {
                const sql3 = `update products set stock=(stock-${quantity}) where id=${product_id};`;
                const rows3 = await query(sql3);
                if (!rows3.affectedRows) {
                    return res.status(400).send({ message: 'Product quantity could not be updated' })
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Cancel order could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})


// Delete order   =>   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql = `delete from orders where id=${EID};`;
    const sql1 = "ALTER TABLE orders AUTO_INCREMENT=1;";
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "Operation could not be completed" });
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "Operation could not be completed" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log("Order could not be deleted :-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})


// Create a new coupon   =>  /api/v1/coupon/new
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    var coupon_code = req.body.coupon_code;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var lastDate = req.body.lastDate;
    var cashback = req.body.cashback;
    var minValue = req.body.minValue;
    var description = req.body.description.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");

    const sql = `insert into coupon(id, user_id, coupon_code, date, lastDate, cashback, minValue, description, order_id) 
    values(Null,${req.user.id},'${coupon_code}','${date}','${lastDate}', ${cashback}, ${minValue}, '${description}', 0);`;

    //  console.log("sql",sql);

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);

        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: "Coupon could not be created" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log("New coupon code could not be created :-", error.message)
            return res.status(400).send({ message: "Coupon could not be created" });
        });
})


// Get all coupon - ADMIN  =>   /api/v1/admin/coupon/new
exports.allCoupons = catchAsyncErrors(async (req, res, next) => {
    var coupons;
    const sql = `select * from coupon order by id DESC;`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            coupons = rows;
        } catch (err) {
            return res.status(400).send({ message: 'No coupon found' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                coupons
            })
        }).catch(error => {
            console.log("No coupon found with this ID:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})


// Delete coupon   =>   /api/v1/admin/coupon/:id
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    const sql = `delete from coupon where id=${EID};`;
    const sql1 = "ALTER TABLE coupon AUTO_INCREMENT=1;";
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "No Coupon found with this ID" });
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "No Coupon found with this ID" });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log("Coupon could not be deleted :-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})

// Get single coupon   =>   /api/v1/admin/coupons/:id
exports.getCouponDetails = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    var coupon;
    const sql = `select * from coupon where id=${EID};`;
    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            if (!rows.length) {
                return res.status(400).send({ message: 'No coupon found with this ID' });
            }
            coupon = rows[0];

        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: 'No coupon found with this ID' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                coupon
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})


//update coupon  =>   /api/v1/admin/coupon/:id
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary')
    var coupon;
    if (req.body.description) {
        req.body.description = req.body.description
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/`/g, "\\`");
    }
    const sql = `update coupon set ?  where id =${EID}`;

    // console.log("sql", sql);
    // console.log(" req.body", req.body);

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql, [req.body]);
            coupon = rows;

            if (!rows.affectedRows) {
                return res.status(400).send({ message: "Coupon could not updated" });;
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: 'Coupon could not be updated' });
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    };
    result()
        .then((value) => {
            res.status(200).json({
                success: true,
            });
        })
        .catch((error) => {
            console.log("The Coupon could not updated", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
});

// Delete order status Fialed 
exports.deleteFailOrder = catchAsyncErrors(async (req, res, next) => {
    const sql = `delete from orders where order_date < DATE_SUB( current_timestamp() , INTERVAL 22 DAY ) and paymentStatus= 'Fail'`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
        } catch (err) {
            console.log(err.message);
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {

        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
        });
})

// Delete order status 
exports.deleteOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const sql = `select * from orders WHERE order_date < DATE_SUB( current_timestamp() , INTERVAL 0.30 hour ) and paymentStatus!= 'Success' and paymentStatus!= 'Fail';`;

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            if (rows.length) {
                rows.map(async (val) => {
                    //reason 1 means stock has been already updated
                    if (val.reason != 1) {
                        const sql2 = `update products set stock=stock+${val.quantity}, top=top-1 where id=${val.product_id}`;
                        const rows2 = await query(sql2);
                        const sql3 = `update orders set reason=1 where id=${val.id}`;
                        const rows3 = await query(sql3);
                    }
                    const sql1 = `delete from orders WHERE order_date < DATE_SUB( current_timestamp() , INTERVAL 6 hour ) and paymentStatus!= 'Success' and paymentStatus!= 'Fail'
                     and id=${val.id};`;
                    const rows1 = await query(sql1);
                })
            }

        } catch (err) {
            console.log(err.message);
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {

        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
        });
})


//Create & send user invoice & pdf
exports.invoicePdf = catchAsyncErrors(async (req, res, next) => {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    try {
        const sql = `select * from orders where id=${EID};`;
        const query = util.promisify(connection.query).bind(connection);

        const rows = await query(sql);

        const address = `${rows[0].flat ? rows[0].flat + "," : ""} ${rows[0].area ? rows[0].area + "," : ""} `
        const zipAddress = `${rows[0].landmark ? rows[0].landmark : ""}`
        const mobile = rows[0].mobile ? `Mobile: ${rows[0].mobile}` : "";
        const city = `${rows[0].city ? rows[0].city + "," : ""} ${rows[0].postalCode ? rows[0].postalCode : ""}`;
        const country = `${rows[0].state ? rows[0].state + "," : ""}  ${rows[0].country ? rows[0].country + "," : ""}`
        const date = rows[0].order_date ? rows[0].order_date : 1
        const gstn = rows[0].gstn ? `GSTN : ${rows[0].gstn}` : "";

        const quantity = rows[0].quantity ? rows[0].quantity : 0;
        const description = rows[0].productName ? rows[0].productName : "";
        const tax_rate = rows[0].tax_rate ? rows[0].tax_rate : 0;
        const price = rows[0].sale_price ? rows[0].sale_price - rows[0].taxPrice : 0;
        const shipping = rows[0].shippingPrice ? rows[0].shippingPrice : 0;
        const redeem = rows[0].redeem ? -rows[0].redeem : 0;

        const invoiceNo = rows[0].order_id ? rows[0].order_id : '#'

        var data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The logo on top of your invoice
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                // The invoice background
            },
            // Your own data
            "sender": {
                "company": "SGSRO ",
                "address": "Gat No. - 1570, Shelar Wasti <br/>Chikhali Dehu-Alandi Road",
                "city": "Pimpri-Chinchwad",
                "country": "Maharashtra, India, 411062",
                "custom1": "",
                "custom2": "PAN:  DDDDDDDD",
                "custom3": "GSTIN: DDDDDDD"
            },
            // Your recipient
            "client": {
                "company": `${rows[0].billing_name ? rows[0].billing_name : ""}`,
                "address": address,
                "zip": zipAddress,
                "city": city,
                "country": country,
                "custom1": mobile,
                "custom2": gstn
            },
            "information": {
                // Invoice number
                "number": invoiceNo,
                // Invoice data
                "date": new Date(date).toLocaleDateString(),
                // Invoice due date
                "due-date": new Date(date).toLocaleDateString()
            },
            // The products you would like to see on your invoice
            // Total values are being calculated automatically
            "products": [
                {
                    "quantity": quantity,
                    "description": description,
                    "tax-rate": tax_rate,
                    "price": price
                },
                {
                    "quantity": 1,
                    "description": "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<b>Shipping Price :</b>",
                    "price": shipping,
                    "tax-rate": 0
                },
                {
                    "quantity": 1,
                    "description": "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<b>Applied Coupon :</b>",
                    "price": redeem,
                    "tax-rate": 0
                }

            ],
            // The message you would like to display on the bottom of your invoice
            // "bottom-notice": "Kindly pay your invoice within 15 days.",
            // Settings to customize your invoice
            "settings": {
                "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
                "tax-notation": "Gst", // Defaults to 'vat'
                // "margin-top": 25, // Defaults to '25'
                // "margin-right": 25, // Defaults to '25'
                // "margin-left": 25, // Defaults to '25'
                // "margin-bottom": 25, // Defaults to '25'
                // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
                // "height": "1000px", // allowed units: mm, cm, in, px
                // "width": "500px", // allowed units: mm, cm, in, px
                // "orientation": "landscape", // portrait or landscape, defaults to portrait
            },
            // Translate your invoice to your preferred language
            "translate": {
                "invoice": "Tax Invoice",  // Default to 'INVOICE'
                "number": "Order Number", // Defaults to 'Number'
                "date": "Order Date", // Default to 'Date'
                "due-date": "Invoice Date", // Defaults to 'Due Date'
                "subtotal": "Subtotal", // Defaults to 'Subtotal'
                "products": "Products", // Defaults to 'Products'
                "quantity": "Quantity", // Default to 'Quantity'
                "price": "Price", // Defaults to 'Price'
                "product-total": "Total Amount", // Defaults to 'Total'
                "total": "Grand Total" // Defaults to 'Total'
            },
        };

        //Create your invoice! Easy!
        const result = await easyinvoice.createInvoice(data);

        const iv = await fs.writeFileSync(path.join(__dirname, `../../../../../public/bill/${invoiceNo}.pdf`), result.pdf, 'base64');
        // easyinvoice.download('myInvoice.pdf', result.pdf);
        console.log("Invoice Not Generated", iv);
        return res.status(200).json({
            path: path.join(`/bill/${invoiceNo}.pdf`)
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: 'Invoice Not Generated' });
    }

})


// Get all report - ADMIN  =>   /api/v1/admin/report/
exports.allReport = catchAsyncErrors(async (req, res, next) => {
    let totalAmount = 0;
    let orderRecord;


    var sql = `select * from orders  where orderStatus !='Cancel' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success" order by id DESC;`;

    if (req.body.date) {
        sql = `select * from orders where DATE(order_date) = '${req.body.date}';`;
    }

    if (req.body.date1 && req.body.date2) {
        sql = `select * from orders  where orderStatus !='Cancel' and orderStatus !='Return' and orderStatus !='Return Approved' and paymentStatus="Success" and (order_date BETWEEN '${req.body.date1}' AND '${req.body.date2}') order by id DESC;`;
    }

    if (req.body.month) {
        sql = `select * from orders where MONTHNAME(order_date) = '${req.body.month}' and YEAR(order_date) = YEAR(CURDATE());`;
    }
    if (req.body.year) {
        sql = `select * from orders where YEAR(order_date) = '${req.body.year}';`;
    }

    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            const rows = await query(sql);
            orderRecord = rows;

            orderRecord.forEach(order => {
                totalAmount += parseInt(order.totalPrice)
            })
        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                totalAmount,
                orderRecord
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
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


    const query = util.promisify(connection.query).bind(connection);

    let result = async function () {
        try {
            var sql1 = `select count(*) as processing from orders where orderStatus = 'Processing' and paymentStatus="Success" ;`;
            const rows1 = await query(sql1);
            processing = rows1[0]

            var sql2 = `select count(*) as shipped from orders where orderStatus = 'Shipped' and paymentStatus="Success";`;
            const rows2 = await query(sql2);
            shipped = rows2[0]

            var sql3 = `select count(*) as delivered from orders where orderStatus = 'Delivered' and paymentStatus="Success";`;
            const rows3 = await query(sql3);
            delivered = rows3[0]

            var sql4 = `select count(*) as cancel from orders where orderStatus = 'Cancel' and paymentStatus="Success";;`;
            const rows4 = await query(sql4);
            cancel = rows4[0]

            var sql5 = `select count(*) as returned from orders where orderStatus = 'Return' and paymentStatus="Success";;`;
            const rows5 = await query(sql5);
            returned = rows5[0]

            var sql6 = `select count(*) as returnApproved from orders where orderStatus = 'Return Approved' and paymentStatus="Success";;`;
            const rows6 = await query(sql6);
            returnApproved = rows6[0]


            let i = 0;
            for (i; i < 10; i++) {
                var sql7 = `select sum(sale_price) as sale_price from orders where order_date = YEAR(CURDATE())-${i};`;
                const rows7 = await query(sql7);
                yearSales.push(rows7[0].sale_price ? rows7[0].sale_price : 0);
            }

            var sql9 = 'select sale_price,order_date  from orders where order_date > DATE_SUB( current_timestamp()  , INTERVAL 365 DAY ) and paymentStatus="Success";';
            const rows9 = await query(sql9);
            sales = rows9

            // rows9.forEach(async order => {
            //     var sql = `select sum(sale_price) as sale_price, order_date from orders where paymentStatus="Success" and id=${order.id}`;
            //     const rows = await query(sql);

            //     if (rows[0].sale_price) {
            //         let data = { "sale_price": rows[0].sale_price, "order_date": String(rows[0].order_date).substring(0, 10) }
            //         console.log(data);

            //         sales.push(data);
            //     }
            // })

            // console.log("sales", sales);

        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ message: 'Operation could not be completed' });
        } finally {
            await util.promisify(connection.end).bind(connection);

        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                processing: processing,
                shipped: shipped,
                delivered: delivered,
                cancel: cancel,
                returned: returned,
                returnApproved: returnApproved,
                yearSales,
                sales
            })
        }).catch(error => {
            console.log("Operation could not be completed:-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
})