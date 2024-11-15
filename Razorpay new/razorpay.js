const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay')
const crypto = require('crypto');
const { queryDatabase } = require('./query');
const { generateFullQuery } = require('../util/generateFullQuery');
const winston = require('../winston/config');
const { trim } = require('../util/trim');
const PDFDocument = require('pdfkit');
const { log } = require('winston');


const createInvoice = async (orderId) => {
    try {
        // Fetch order details from the database
        const sql = `SELECT * FROM orders WHERE order_id = ?;`;
        const rows = await queryDatabase(sql, [orderId]);

        // Generate the invoice number
        const invoiceNo = rows[0].order_id || '#';
        const billDir = path.join(process.cwd(), 'public/bill');
        const totalPrice = rows[0].totalPrice
        const date = rows[0].date
        const gstin = rows[0].gstn
        const pinCode = rows[0].postalCode
        // const stateCode = gstin.substring(0, 2);
        // const MAHARASHTRA_CODE = stateCode === "27";
        const MAHARASHTRA_CODE = isMaharashtraPin(pinCode);

        function isMaharashtraPin(pinCode) {
            const maharashtraRanges = [
                { start: 400000, end: 444999 }
            ];

            // Check if pinCode falls within any Maharashtra range
            return maharashtraRanges.some(range => pinCode >= range.start && pinCode <= range.end);
        }

        // Create the bills directory if it doesn't exist
        if (!fs.existsSync(billDir)) {
            fs.mkdirSync(billDir, { recursive: true });
        }

        let doc = new PDFDocument({ margin: 50 });

        const pdfFileName = `invoice_${invoiceNo}.pdf`;
        const pdfPath = path.join(billDir, pdfFileName);
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');

        // doc.font('font/Roboto-Regular.ttf');
        const fontPath = path.join(process.cwd(), 'font', 'ARIAL.TTF');
        doc.font(fontPath);


        const invoice = {
            shipping: {
                name: rows[0].billing_name || "Client Name",
                address: `${rows[0].flat || ''}, ${rows[0].area || ''}`,
                city: `${rows[0].city || ''}, ${rows[0].postalCode || ''}`,
                state: `${rows[0].state || ''}, ${rows[0].country || ''}`,
                mobile: `Mobile: ${rows[0].mobile}` || '',
                gstin: rows[0].gstn ? `GSTIN : ${rows[0].gstn}` : ''
            },
            items: [
                {
                    id: 1,
                    products: 'Toner Cartridge',
                    quantity: 2,
                    amount: 6000,
                },
                {
                    id: 2,
                    products: 'USB Cable Extender',
                    quantity: 1,
                    amount: 2000,
                },
            ],
            subtotal: totalPrice,
            paid: 0,
            invoice_nr: invoiceNo,
        };

        // Generate sections of the invoice
        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        generateInvoiceTable(doc, invoice);
        // generateFooter(doc);

        // Pipe document to a file
        try {
            doc.pipe(fs.createWriteStream(pdfPath));
            doc.end();
        } catch (err) {
            winston.info(err);
            console.error('Error writing PDF file:', err);
        }



        // Helper function to format currency
        function formatCurrency(amount) {
            return `${(Number(amount)?.toFixed(2))}`;
        }

        // Function to draw a horizontal line
        function drawHorizontalLine(doc, yPosition) {
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, yPosition).lineTo(550, yPosition).stroke();
        }

        // Function to generate the customer and invoice information section
        // Function to generate the customer and invoice information section
        function generateCustomerInformation(doc, invoice) {
            const shipping = invoice.shipping;

            let inv = 230;

            // Add heading and a horizontal line
            doc.fillColor('#444444')
                .fontSize(20)
                .text('INVOICE', 50, inv);
            drawHorizontalLine(doc, inv + 30); // Line after "INVOICE" heading

            // Customer and invoice details
            // Helper function to wrap text and calculate new y-coordinate based on text height
            const wrapText = (doc, text, x, y, width, options = {}) => {
                // Set default font size if not provided
                const fontSize = options.fontSize || 12;
                doc.fontSize(fontSize);

                // Get the height of the text block after wrapping it to fit within the width
                const textHeight = doc.heightOfString(text, { width });

                // Render the wrapped text
                doc.text(text, x, y, { width, ...options });

                // Return new y position for the next text, taking into account the height of the wrapped text
                return y + textHeight;
            };

            // Setting initial y-coordinate for content positioning
            let currentY = inv + 45;
            const leftX = 50; // X position for the left column (Invoice, Order Date, Invoice Date)
            const rightX = 300; // X position for the right column (Bill To and Address)

            // Invoice Information (on the top, above Bill To and Ship To)
            doc.fontSize(12).fillColor('#000000');
            currentY = wrapText(doc, `Invoice No.: ${invoice.invoice_nr}`, leftX, currentY, 200);
            currentY = wrapText(doc, `Order Date: ${new Date().toLocaleDateString('en-IN')}`, leftX, currentY + 5, 200);
            currentY = wrapText(doc, `Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, leftX, currentY + 5, 200);


            drawHorizontalLine(doc, currentY + 10); // Adjusting Y position slightly for spacing
            currentY += 20; // Adjust for spacing after the line
            // Position after the Invoice Info
            let customerInfoY = currentY;

            // Bill To and Ship To Section Side by Side
            const billToY = customerInfoY;
            const shipToY = customerInfoY; // Ship To starts at the same Y position as Bill To

            // Bill To Section (Left Side)
            doc.fontSize(12).fillColor('#000000');
            doc.text('Bill To:', leftX, billToY);
            let billToYAfter = billToY + 15;
            billToYAfter = wrapText(doc, shipping.name, leftX, billToYAfter, 200);
            billToYAfter = wrapText(doc, shipping.address, leftX, billToYAfter, 200);
            billToYAfter = wrapText(doc, `${shipping.city}, ${shipping.state}`, leftX, billToYAfter, 200);
            billToYAfter = wrapText(doc, shipping.mobile, leftX, billToYAfter, 200);
            if (shipping.gstin) {
                billToYAfter = wrapText(doc, shipping.gstin, leftX, billToYAfter, 200);
            }

            // Ship To Section (Right Side)
            doc.text('Ship To:', rightX, shipToY);
            let shipToYAfter = shipToY + 15;
            shipToYAfter = wrapText(doc, shipping.name, rightX, shipToYAfter, 200);
            shipToYAfter = wrapText(doc, shipping.address, rightX, shipToYAfter, 200);
            shipToYAfter = wrapText(doc, `${shipping.city}, ${shipping.state}`, rightX, shipToYAfter, 200);
            shipToYAfter = wrapText(doc, shipping.mobile, rightX, shipToYAfter, 200);
            if (shipping.gstin) {
                shipToYAfter = wrapText(doc, shipping.gstin, rightX, shipToYAfter, 200);
            }

            // Ensure there's enough space for the next section
            let nextSectionY = Math.max(billToYAfter, shipToYAfter) + 20; // Add space between sections

            // Draw a horizontal line after both sections
            drawHorizontalLine(doc, nextSectionY); // Adjust the Y position to match where the last line should go
        }

        // Function to generate table rows with a horizontal line after each row
        function generateTableRow(doc, y, c2, c3, c4, c5) {
            const descriptionWidth = 220;
            const descriptionHeight = doc.fontSize(10).heightOfString(c2, { width: descriptionWidth, align: 'left', fontSize: 10 });

            doc.text(c2, 50, y, { width: descriptionWidth, align: 'left' });

            const rowHeight = Math.max(descriptionHeight, 22);

            doc.text(c3, 280, y, { width: 90, align: 'right' });
            doc.text(c4, 370, y, { width: 90, align: 'right' });
            doc.text(c5, 470, y, { align: 'right' });

            y += rowHeight;

            drawHorizontalLine(doc, y + 5);
        }

        // New function to generate rows for subtotal, GST, and total without horizontal lines
        function generateTotalRow(doc, y, label, amount) {
            doc.fontSize(10)
                .text('', 50, y) // Empty first column
                .text('', 150, y) // Empty second column
                .text('', 280, y, { width: 90, align: 'right' }) // Empty third column
                .text(label, 370, y, { width: 90, align: 'right' }) // Label for subtotal/GST/total
                .text(formatCurrency(amount), 0, y, { align: 'right' }); // Value for subtotal/GST/total
        }

        // Function to generate the invoice table
        function generateInvoiceTable(doc, invoice) {
            let invoiceTableTop = 450;
            let subtotalCal = [];
            let gstCal = [];
            let position = invoiceTableTop + 40;

            // Header row for the table
            generateTableRow(doc, position, 'Products', 'Unit Price', 'Quantity', 'Total Amount (₹)');
            position += 40;  // Move below the header

            // Loop through rows to generate the table rows
            rows.forEach((item, i) => {
                // Ensure calculations are safe
                const salePrice = parseFloat(item.sale_price) || 0;
                const taxPrice = parseFloat(item.taxPrice) || 0;
                const quantity = parseInt(item.quantity) || 0;

                // Calculate subtotal and GST
                const subtotal = quantity * (salePrice - taxPrice);
                const gstAmount = quantity * taxPrice;

                // Store calculated values
                subtotalCal.push(subtotal);
                gstCal.push(gstAmount);

                // Prepare product description
                const headerContent = item.header || "";
                const columnsContent = item.columns || "";

                const productDescription = item.productName +
                    ((headerContent && columnsContent) ? (
                        headerContent.split(',').map((header, index) => {
                            const columnsArray = columnsContent.split(',').map(col => col.trim());
                            const columnValue = index < columnsArray.length ? columnsArray[index].trim() : 'N/A';
                            return `${header.trim()}: ${columnValue}`;
                        }).join(', ')
                    ) : "");

                const productDescriptionWithHSN = `${productDescription} ${item.hsn ? `(HSN: ${item.hsn})` : ''}`;

                // Add the row
                generateTableRow(
                    doc,
                    position,
                    productDescriptionWithHSN,
                    formatCurrency(salePrice - taxPrice),
                    quantity,
                    formatCurrency(subtotal)
                );

                position += 90; // Increase position after the row

                // Check if the table has reached near the bottom of the page
                if (position > 700) { // Page limit
                    doc.addPage();  // Add a new page
                    position = 50;  // Reset position on the new page
                    // generateHeader(doc);  // Regenerate the header
                }
            });

            // After the table, calculate totals: Subtotal, GST, and Grand Total
            let subtotal = subtotalCal.reduce((acc, price) => acc + price, 0);
            let gst = gstCal.reduce((acc, price) => acc + price, 0);
            const totalAmount = subtotal + gst;

            let totalPosition = position + 20;

            // Subtotal row
            generateTotalRow(doc, totalPosition, 'Subtotal(₹)', subtotal);
            totalPosition += 20;

            // GST (CGST/SGST or IGST) row
            if (MAHARASHTRA_CODE) {
                const cgst = gst / 2;
                const sgst = gst / 2;
                generateTotalRow(doc, totalPosition, 'CGST (9%)', cgst);
                totalPosition += 20;
                generateTotalRow(doc, totalPosition, 'SGST (9%)', sgst);
            } else {
                generateTotalRow(doc, totalPosition, 'IGST (18%)', gst);
            }

            // Grand Total row
            totalPosition += 30;
            generateTotalRow(doc, totalPosition, 'Grand Total(₹)', totalAmount);

            // Final thank you message
            totalPosition += 35;
            doc.fontSize(10)
                .text('Thank you for shopping with us at Trigon Enterprises.', 50, totalPosition, { align: 'center', width: 500 });
        }


        // Function to generate the header section
        function generateHeader(doc) {
            doc.image(logoPath, 50, 45, { width: 120 })
                .fillColor('#0073e6')
                .fontSize(20)
                .text('TRIGON ENTERPRISES', 200, 57, { align: 'right' })
                .fontSize(10)
                .fillColor('#000000')
                .text('EL 51, J Block, MIDC Bhosari', 200, 85, { align: 'right' })  //last
                .text('Pune Maharashtra, India', 200, 100, { align: 'right' })
                .text('Pin code: 411026', 200, 115, { align: 'right' })
                .fillColor('#0066cc')
                .text('Email : info@trigonenterprises.in', 200, 130, { align: 'right' })
                .fillColor('#003366')
                .text('Mobile Number: 7028087872', 200, 145, { align: 'right' })
                .fillColor('#444444')
                .text('GSTIN: 27AQEPB3785F1ZX', 200, 160, { align: 'right' })
                .moveDown();

            // drawHorizontalLine(doc, 100);

            // doc.moveTo(50, 120)   // Starting point of the line (X: 50, Y: 120)
            //     .lineTo(550, 120)  // Ending point of the line (X: 550, same Y coordinate)
            //     .stroke();
        }

        // Function to generate the footer section
        function generateFooter(doc) {
            doc.fontSize(10)
                .text('Thank you for shopping with us!', 50, 700, { align: 'center', width: 500 });
        }


        // Update the bank_ref_no field in the database with the path of the generated PDF
        const updateSql = `UPDATE orders SET bank_ref_no = ? WHERE order_id = ?;`;
        await queryDatabase(updateSql, [pdfFileName, orderId]);

        // console.log(`Invoice generated and saved at ${pdfPath}`);
    } catch (err) {
        winston.info(err);
        console.error("Error creating invoice:", err.message);
    }
};



exports.verification = async function (req, res) {
    if (req.method === 'POST') {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing required payment details.' });
        }

        let paymentStatus = 'fail';
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        let hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');


        if (generated_signature === razorpay_signature) {
            paymentStatus = 'success';
        } else {
            paymentStatus = 'fail';
        }

        try {
            // Save the payment status into MySQL database

            if (paymentStatus === 'success') {
                try {
                    const sql = `UPDATE orders SET paymentStatus = ?, tracking_id=? WHERE order_id = ?;`;

                    const orderDb = await queryDatabase(sql, [paymentStatus, razorpay_payment_id, razorpay_order_id]);

                    res.status(200).json({
                        success: true,
                        message: "Payment verification successful",
                        razorpay_order_id,
                    });


                    // Generate invoice in the background
                    (async () => {
                        try {
                            const pdfPath = await createInvoice(razorpay_order_id);

                        } catch (error) {
                            winston.info(error);
                            console.error('Error during invoice creation:', error);
                            // Optionally log the error or notify an admin
                        }
                    })();


                } catch (error) {
                    winston.info(error);
                    console.error('Error handling successful payment:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

            }

            if (paymentStatus === 'fail') {
                try {
                    const updateOrderQuery = `UPDATE orders SET paymentStatus = ? WHERE order_id = ?`;
                    const orderDb = await queryDatabase(updateOrderQuery, [paymentStatus, razorpay_order_id]);

                    const selectOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
                    const orders = await queryDatabase(selectOrderQuery, [razorpay_order_id]);

                    if (orders.length) {
                        for (const order of orders) {
                            // const updateProductQuery = `UPDATE products SET stock = stock + ?, top = top - 1 WHERE id = ?`;
                            const updateProductQuery = `UPDATE specifications SET stock = stock + ? WHERE product_id = ? and cid =?`;
                            await queryDatabase(updateProductQuery, [order.quantity, order.product_id, order.cid]);
                        }
                    } else {
                        console.log("Product status failed but stock is not updated quantity-1.");
                    }

                    // res.status(400).send('Invalid signature');
                    res.status(200).json({
                        success: true,
                        message: 'Payment fail',
                        razorpay_order_id
                    });

                } catch (err) {
                    winston.info(error);
                    console.error("Error handling failed payment:", err);
                    return res.status(400).send('Invalid signature');
                }

            }

        } catch (error) {
            winston.info(error);
            console.error('Database error: ', error);
            res.status(500).json({ success: false, message: 'Failed to save payment status' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }

}


exports.createOrder = async function (req, res, next) {
    if (req.method === 'POST') {
        const { amount, currency, receipt } = req.body;

        console.log("amount", amount);
        console.log("amount", typeof amount);
        console.log("amount", amount * 100);


        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID, // Store key and secret in environment variables
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });


        const options = {
            amount: parseInt((amount * 100).toFixed(0), 10), // Amount in paise
            currency: currency || 'INR',
            receipt: receipt || 'receipt#1',
            payment_capture: 1 // Automatic capture
        };


        try {
            fs.mkdirSync('./public/bill', { recursive: true }); // Ensure directory exists
            fs.appendFileSync(path.join('./public/bill', 'payment.json'), JSON.stringify(req.body, null, 4) + `\n"${new Date()},"\n`);
        } catch (error) {
            winston.info('Error:', error)
            console.error('Error:', error);
        }

        try {

            const order = await razorpay.orders.create(options);

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
                const cid = oi.cid;
                const columns = oi.columns;
                const header = oi.header;
                const hsn = oi.hsn;

                const checkPriceSql = 'SELECT sale_price FROM specifications WHERE product_id = ? and cid =?';
                // generateFullQuery(checkPriceSql, [product_id, cid])
                const match_price = await queryDatabase(checkPriceSql, [product_id, cid]);

                if (stock >= quantity && sale_price == match_price[0].sale_price) {

                    const sql = `INSERT INTO orders(
                        id, order_id, order_date, delivered_date, orderStatus, paymentStatus,
                        tracking_id, ip, bank_ref_no, payment_mode, hsn, product_id, sale_price,
                        productName, quantity, path, totalPrice, taxPrice, tax_rate, shippingPrice, shop_length, user_id, userName,
                        billing_name, mobile, gstn, flat, area, landmark, city, state, country, postalCode, redeem, coupon_code, reason, cid, columns, header
                     ) VALUES (
                        NULL, ?, NOW(), NULL, 'Processing', '',
                         ?, ?, '', '', ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,'',?,?,?
                     )`;

                    const values = [order.id, order.receipt, req.ip, hsn, product_id, sale_price, productName, quantity, path, totalPrice, tax_amount, tax_rate, shippingPrice, shop_length, user_id, user_name, trimmedShippingInfo.name, trimmedShippingInfo.mobile, trimmedShippingInfo.gstn, trimmedShippingInfo.flat, trimmedShippingInfo.area, trimmedShippingInfo.landmark, trimmedShippingInfo.city, trimmedShippingInfo.state, trimmedShippingInfo.country, trimmedShippingInfo.postalCode, redeem, coupon_code, cid, columns, header];
                    // const sql1 = `UPDATE products SET stock = stock - ?, top = top + 1 WHERE id = ?;`;
                    const sql1 = `UPDATE specifications SET stock = stock - ? WHERE product_id = ? and cid =?;`;

                    try {
                        // generateFullQuery(sql1, [quantity, product_id, cid])
                        const rows1 = await queryDatabase(sql1, [quantity, product_id, cid]);
                        if (rows1.affectedRows) {
                            const rows = await queryDatabase(sql, values);

                            if (!rows.affectedRows) {
                                return res.status(400).send({ message: "Order could not be Placed" });
                            }
                        } else {
                            return res.status(400).send({ message: "Product is out of stock. Order could not be Placed" });
                        }
                    } catch (error) {
                        winston.info(error);
                        console.error("Error executing SQL queries:", error);
                        return res.status(500).send({ message: "Internal Server Error" });
                    }

                } else {
                    stockAvailable = false;
                    res.status(400).send("Product is out of stock");
                }
            }

            res.status(200).json({
                success: true,
                order_id: order.id,
                currency: order.currency,
                amount: order.amount,
                orderStockResult: stockAvailable
            });


        } catch (error) {
            winston.info(error);
            res.status(500).json({ error: 'Failed to create Razorpay order' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }

};



exports.cancel = async function (req, res) {

    if (req.method === 'POST') {
        const { razorpay_order_id } = req.body;

        try {
            const updateOrderQuery = `UPDATE orders SET paymentStatus = ? WHERE order_id = ?`;
            const orderDb = await queryDatabase(updateOrderQuery, ["cancel", razorpay_order_id]);

            const selectOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
            const orders = await queryDatabase(selectOrderQuery, [razorpay_order_id]);

            if (orders.length) {
                for (const order of orders) {
                    const updateProductQuery = `UPDATE specifications SET stock = stock + ? WHERE product_id = ? and cid =?`;
                    await queryDatabase(updateProductQuery, [order.quantity, order.product_id, order.cid]);
                }
            } else {
                console.log("Product status failed but stock is not updated quantity-1.");
            }

            res.status(200).json({ success: true, message: 'Payment canceled successfully.' });
        } catch (error) {
            winston.info(error);
            console.error('Database error: ', error);
            res.status(500).json({ success: false, message: 'Failed to save cancellation status' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


//here are only save temp status as fail not increase stock quantity bse stock qty manage when cancel
exports.fail = async function (req, res) {
    if (req.method === 'POST') {
        const { razorpay_order_id } = req.body;

        try {
            const updateOrderQuery = `UPDATE orders SET paymentStatus = ? WHERE order_id = ?`;
            const orderDb = await queryDatabase(updateOrderQuery, ["fail", razorpay_order_id]);

            // const selectOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
            // const orders = await queryDatabase(selectOrderQuery, [razorpay_order_id]);

            // if (orders.length) {
            //     for (const order of orders) {
            //         const updateProductQuery = `UPDATE specifications SET stock = stock + ? WHERE product_id = ? and cid =?`;
            //         await queryDatabase(updateProductQuery, [order.quantity, order.product_id, order.cid]);
            //     }
            // } else {
            //     console.log("Product status failed but stock is not updated quantity-1.");
            // }

            // res.status(400).send('Invalid signature');
            res.status(200).json({
                success: true,
                message: 'Payment fail',
                razorpay_order_id
            });

        } catch (err) {
            winston.info(err);
            console.error("Error handling failed payment:", err);
            return res.status(400).send('Invalid signature');
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


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