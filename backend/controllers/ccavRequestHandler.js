// var http = require('http'),
//     fs = require('fs'),
//     ccav = require('../utils/ccavutil.js'),
//     qs = require('querystring');
// // const { order } = require('./order')

// exports.postReq = async function (request, response) {
//     // console.log("requestttt", request.body);
//     var body = '',
//         workingKey = `${process.env.WORKINGKEY}`,	//Put in the 32-Bit key shared by CCAvenues.
//         accessCode = `${process.env.ACCESSCODE}`,   //Put in the Access Code shared by CCAvenues.
//         encRequest = '',
//         formbody = '';

//     console.log("workingKey", workingKey);
//     console.log("accessCode", accessCode);


//     request.on('data', function (data) {
//         // console.log("datadyyyy", data);

//         body += data;
//         // body = qs.parse(body)

//         // console.log("bodyyyy 2 ", body);

//         // change(set) object property using a setter
//         // order.changeName = body;

//         encRequest = ccav.encrypt(body, workingKey);
//         console.log("encRequest", encRequest);
//         // var aa = ccav.decrypt(encRequest, workingKey);
//         // console.log("aaa", aa);
//         // formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
//     });

//     request.on('end', function () {
//         response.status(200).json({
//             success: true,
//             encRequest,
//             accessCode
//         })
//         response.end();
//     });
//     return;
// };
