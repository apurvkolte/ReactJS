const otp = generateOTP();

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}


var request = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

request.headers({
    "authorization": process.env.SMS_API_KEY
});

request.form({
    "variables_values": `${otp}`,
    "route": "otp",
    "numbers": `${mobile}`,
});

request.end(function (response) {
    if (response.error) throw new Error(response.error);
    // console.log(response.body);
});