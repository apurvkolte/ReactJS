//https://whats-api.rcsoft.in/
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'https://whats-api.rcsoft.in/api/create-message',
    'headers': {
    },
    formData: {
        'appkey': 'e602af5a-5a0e-4d12-927d-fe0727e501db',
        'authkey': 'lGy4VzLs5suHrRRgFUkdTpcptKiOpq41Wd70bigFHems7bVLXWKHARAKP',
        'to': '919766',
        'message': 'Example message',
        // 'file': 'https://www.africau.edu/images/default/sample.pdf'
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});