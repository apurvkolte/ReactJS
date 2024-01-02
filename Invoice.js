var easyinvoice = require('easyinvoice');

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