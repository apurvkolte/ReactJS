const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const errorMiddeware = require('./middlewares/error')
var cors = require('cors');
const compression = require('compression')
//public files
app.use(express.static(__dirname + '/uploads'))
app.use(express.static(__dirname + '/uploads/banner'))
app.use(express.static(__dirname + '/uploads/product'))

//Setting up config file
dotenv.config({ path: 'config/config.env' })
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'config/config.env' })
app.use(compression())
app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(fileUpload())

app.use(cookieParser());
// app.use(bodyparser.json({ limit: '50mb' }));
// app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));


app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)



// if (process.env.NODE_ENV === 'PRODUCTION') {
//     app.use(express.static(path.join(__dirname, './frontend/build')))

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, './frontend/build/index.html'))
//     })
// }

// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })

//Middleware to handle errors
app.use(errorMiddeware);

module.exports = app