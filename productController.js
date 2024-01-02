const util = require('util');
const connection = require('../config/connection');
const { trim } = require('../utils/trim');



//Get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    // trim is used for remove specific character like '," / & extra white space trim()
    const description = req.body.description ? trim(req.body.description) : "";
    const sql = `select * from products where id=${req.body.id}`;
    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql);
            product = rows
        } catch (err) {
            console.log(err);
            return res.status(400).send({ message: 'Operation could not be completed' })
        } finally {
            await util.promisify(connection.end).bind(connection);
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                products
            });
        }).catch((error) => {
            console.log("All products are not showing :-", error.message);
            return res.status(400).send({ message: 'Operation could not be completed' })
        });
});