// var http = require('http'),
// 	fs = require('fs'),
// 	ccav = require('../utils/ccavutil.js'),
// 	qs = require('querystring');
// var req = require('request');
// // const { order } = require('./order')
// const util = require('util');
// const connection = require('../config/connection');

// exports.postRes = async function (request, response) {
// 	var ccavEncResponse = '',
// 		ccavResponse = '',
// 		workingKey = `${process.env.WORKINGKEY}`,	//Put in the 32-Bit key shared by CCAvenues.
// 		ccavPOST = '',
// 		encRequest = '',
// 		encResponse = '';

// 	request.on('data', async function (data) {
// 		ccavEncResponse += data;
// 		ccavPOST = qs.parse(ccavEncResponse);
// 		var encryption = ccavPOST.encResp;
// 		ccavResponse = ccav.decrypt(encryption, workingKey);
// 		console.log("ccavResponse", ccavResponse);
// 		var json = qs.parse(ccavResponse)
// 		encRequest = ccav.encrypt(JSON.stringify({ "order_no": json.order_id }), workingKey);

// 		// accessing getter methods
// 		const query = util.promisify(connection.query).bind(connection);
// 		try {
// 			//order table in DB
// 			if (json.order_status === 'Success') {

// 				const sql = `update orders set paymentStatus="Success", tracking_id="${json.tracking_id}", bank_ref_no="${json.bank_ref_no}",
// 				payment_mode="${json.payment_mode}", card_name="${json.card_name}" where order_id=${json.order_id};`;

// 				const rows = await query(sql);
// 				response.redirect(`https://SGSRO .co.in/#/success`);
// 				response.end()

// 			} else {
// 				const sql = `update orders set paymentStatus="Fail" where order_id=${json.order_id};`;
// 				const rows = await query(sql);

// 				const sql2 = `select * from orders where order_id=${json.order_id};`;
// 				const rows2 = await query(sql2);
// 				if (rows2.length) {
// 					rows2.map(async (val) => {
// 						const sql1 = `update products set stock=stock+${val.quantity}, top=top-1 where id=${val.product_id};`
// 						const rows1 = await query(sql1);
// 					})
// 				} else {
// 					console.log("Product status failed but stock is not updated quantity-1.");
// 				}
// 				response.redirect(`https://SGSRO .co.in/#/fail`);
// 				response.end();
// 			}
// 		} catch (err) {
// 			console.log(err);
// 			response.redirect(`https://SGSRO .co.in/#/error`);
// 			response.end();
// 		}


// 		// 	req.post(
// 		// 		`https://logintest.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encRequest}&access_code=AVOZ44JJ14BP32ZOPB&request_type=JSON&response_type=JSON&command=orderStatusTracker&version=1.2`,
// 		// 		null,
// 		// 		async function (error, resp, body) {
// 		// 			if (!error && resp.statusCode == 200) {
// 		// 				encResponse = body

// 		// 				var eeee = qs.parse(encResponse)
// 		// 				encResponse = ccav.decrypt(eeee.enc_response, workingKey)
// 		// 				// var json = qs.parse(ccavResponse)
// 		// 				// console.log("json", json);
// 		// 				// var encResp = JSON.parse(encResponse);
// 		// 				// console.log("encResp", encResp);
// 		// 			}
// 		// 		}
// 		// 	);

// 	});


// 	// request.on('end', async function () {
// 	// 	var json = qs.parse(ccavResponse)
// 	// 	var myOrder = qs.parse(order.getName)

// 	// 	if (json.order_status === 'Success' && json.status_message === 'Y' && json.order_id === myOrder.order_id) {
// 	// 		response.redirect(`https://SGSRO .co.in/#/success`);
// 	// 		response.end()
// 	// 	} else {
// 	// 		response.redirect(`https://SGSRO .co.in/#/fail`);
// 	// 		response.end();
// 	// 	}
// 	// });


// };
