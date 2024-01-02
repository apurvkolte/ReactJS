const util = require("util");
const connection = require("../config/connection");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const { capitalizeFirstLetter } = require("../utils/capitalizeFirstLetter");
const { trim } = require('../utils/trim');
const fs = require("fs");
const { type } = require("os");
const { log } = require("console");

//Create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  // console.log("req.file", req.files);
  // console.log("req.file images", req.body.images);
  // const data =  fs.readFileSync( req.files[0].path, {encoding:'base64', flag:'r'} );
  // console.log("data", req.body.categoryName);
  // console.log("data", JSON.parse(req.body.productDetails});

  let product;
  let product_id;
  let productImages;
  let productSpecifications;
  const productDetails = req.body.productDetails ? JSON.parse(req.body.productDetails) : "";
  // req.body.images = "imagesLinks";
  const name = req.body.name ? trim(req.body.name) : "";
  const description = req.body.description ? trim(req.body.description) : "";
  const seller = req.body.seller ? trim(req.body.seller) : "";
  const code = req.body.code ? req.body.code
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, "\\`").trim().toUpperCase() : req.body.code;

  const properties1 = req.body.properties1 ? capitalizeFirstLetter(req.body.properties1) : "";
  const value1 = req.body.value1 ? capitalizeFirstLetter(req.body.value1) : "";
  const properties2 = req.body.properties2 ? capitalizeFirstLetter(req.body.properties2) : "";
  const value2 = req.body.value2 ? capitalizeFirstLetter(req.body.value2) : "";
  const properties3 = req.body.properties3 ? capitalizeFirstLetter(req.body.properties3) : "";
  const value3 = req.body.value3 ? capitalizeFirstLetter(req.body.value3) : "";
  const discount = req.body.discount ? trim(req.body.discount) : 0;

  const sql = `insert into products(id,name,original_price,discount, tax_rate, tax_amount, sale_price,description,ratings,category,seller
    ,stock,numOfReviews,date,top,product_code, properties1,value1,properties2,value2,properties3,value3,main) values(NULL, '${name}',${req.body.original_price},${discount},
    ${req.body.gst},${req.body.gstPrice},${req.body.sale_price},'${description}', 0,'${req.body.category}','${seller}',  ${req.body.stock}, 0, NOW(), 0, 
    '${code}', '${properties1}','${value1}','${properties2}','${value2}','${properties3}','${value3}',0);`;

  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      if (properties1 || properties2 || properties3 || value1 || value2 || value3) {
        if (!code) {
          return res.status(400).send({ message: "Product Code Required" });
        }
      }
      const rows = await query(sql);
      product = rows;
      product_id = rows.insertId;


      // console.dir(req.headers['content-type']);
      if (req.files.length) {
        Object.values(req.files).map(async (file) => {
          // console.log("File name : " + file.filename + " ===" + "path : " + file.path);
          const filePath = file.path.replace(/\\/g, "\\\\");
          const sql1 = `insert into images(id, product_id, imageName, path, category) values(NULL, ${product_id},'${file.filename}',
          '${filePath}', '${req.body.category}');`;
          const rows1 = await query(sql1);
          productImages = rows1;
        });
      }

      //product specificatio table adding
      if (productDetails[0].title !== "" && productDetails[0].data !== "") {
        productDetails.map(async (field) => {
          var sql5 = `insert into specifications(id, product_id, title, description) value 
        (Null, ${product_id}, 
         '${field.title ? (field.title).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.title}',
         '${field.description ? (field.description).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.description}');`
          var rows5 = await query(sql5);
          productSpecifications = rows5;
          // console.log("sql5", sql5);
          // console.log("productSpecifications", productSpecifications);
          // console.log("title", field.title, field.desc, product_id);
        })
      }

    } catch (err) {
      console.log(err.message);
      return res.status(400).send({ message: "Product could not be created" });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        product,
        productImages,
        productSpecifications
      });
    })
    .catch((error) => {
      console.log("Product is not created :-", error.message);
      return res.status(400).send({ message: "Product could not be created" });
    });
});

//Get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 11;
  let productsCount;
  let products;
  let productsTop;
  let products1;
  let productImages = [];
  let filteredProductsCount;
  var imagesData = [];
  var videoImages = [];

  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const find = req.query.keyword || "";
      const category = req.query.category;
      const queryStr = req.query.page;
      const currentPage = Number(queryStr) || 1;
      const skip = resPerPage * (currentPage - 1);
      const ratings = req.query.ratings ? req.query.ratings.gte : 0;
      const discountPriceLTE = req.query.discountPrice ? req.query.discountPrice.lte : 0;
      const discountPriceGTE = req.query.discountPrice ? req.query.discountPrice.gte : 0;
      const sort = req.query.sort;

      var sortValue = '';
      if (sort) {
        if (sort === 'DescTop') {
          sortValue = 'top Desc';
        }
        if (sort === 'Asc') {
          sortValue = 'sale_price Asc';
        }
        if (sort === 'Desc') {
          sortValue = 'sale_price Desc';
        }
      }

      if (find || category || ratings > 0 || discountPriceGTE > 1) {
        if (category) {
          if (find || ratings > 0) {
            var sql = `SELECT * FROM products WHERE (name LIKE '%${find}%' or description Like '%${find}%')
              AND category="${category}" AND sale_price BETWEEN ${discountPriceGTE} AND ${discountPriceLTE}
              AND ratings >=${ratings} order by ${sortValue ? sortValue : "id"} limit ${resPerPage} offset ${skip} `;
            var rows = await query(sql);

            //productsCount
            var sqlSearchCount = `SELECT * FROM products WHERE (name LIKE '%${find}%' or description Like '%${find}%')
              AND category="${category}" AND sale_price BETWEEN ${discountPriceGTE} AND ${discountPriceLTE}
              AND ratings >=${ratings} order by ${sortValue ? sortValue : "id"}`;
            var rowssqlSearchCount = await query(sqlSearchCount);
            productsCount = rowssqlSearchCount.length;
          } else {
            var sql = `SELECT * FROM products WHERE category="${category}" order by ${sortValue ? sortValue : "id"};`;
            var rows = await query(sql);
            productsCount = rows.length;
          }
        } else {
          var sql = `SELECT * FROM products WHERE (name LIKE '%${find}%' or description Like '%${find}%')
              AND sale_price BETWEEN ${discountPriceGTE} AND ${discountPriceLTE}
              AND ratings >=${ratings} order by ${sortValue ? sortValue : "id"} limit ${resPerPage} offset ${skip} ; `;
          var rows = await query(sql);

          //productsCount
          var sqlSearchCount = `SELECT * FROM products WHERE (name LIKE '%${find}%' or description Like '%${find}%')
              AND sale_price BETWEEN ${discountPriceGTE} AND ${discountPriceLTE}
              AND ratings >=${ratings} order by ${sortValue ? sortValue : "id"} ; `;
          var rowssqlSearchCount = await query(sqlSearchCount);
          productsCount = rowssqlSearchCount.length;
        }
      } else {
        var sql = `SELECT * FROM products WHERE name LIKE '%${find}%'or description Like '%${find}%' limit ${resPerPage} offset ${skip}`;
        var rows = await query(sql);

        //Top product
        var sqlTop = `SELECT * FROM products WHERE main=1`;
        var rowsTop = await query(sqlTop);
        productsTop = rowsTop;

        //productsCount
        var sqlSearchCount = `SELECT * FROM products WHERE name LIKE '%${find}%'or description Like '%${find}%'`;
        var rowssqlSearchCount = await query(sqlSearchCount);
        productsCount = rowssqlSearchCount.length;
      }

      var sql2 = `select * from images;`;
      var rows2 = await query(sql2);
      productImages = rows2;

      var sqlSearch = `SELECT * FROM products`;
      products1 = await query(sqlSearch);


      var vimage = `SELECT * FROM images WHERE imageName LIKE '%.gif%'`;
      videoImages = await query(vimage);

      // products = rows || products1;
      products = products1;
      filteredProductsCount = products.length;
    } catch (err) {
      console.log(err);
    } finally {
      await util.promisify(connection.end).bind(connection);
    }
  };
  result()
    .then(
      (value = async () => {
        res.status(200).json({
          success: true,
          count: products.length,
          productsCount,
          resPerPage,
          filteredProductsCount,
          products,
          productImages,
          imagesData,
          productsTop,
          products1,
          videoImages
        });
      })
    )
    .catch((error) => {
      console.log("All products are not showing :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

//Get all products (Admin) => /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  // const products = await Product.find();
  let products;
  let productImages;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query("SELECT * FROM products");
      productsCount = rows.length;
      products = rows;
      var sql1 = `select * from images`;
      var rows1 = await query(sql1);
      productImages = rows1;
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Products could not be identified' });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        products,
        productImages
      });
    })
    .catch((error) => {
      console.log("All admin products are not showing :-", error.message);
      return res.status(404).send({ message: 'Operation could not be completed' });
    });
});

//Get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.query.id ? req.query.id : 0;

  let product;
  let productImages;
  let RelatedProductImages;
  var productDetails;
  var productProperties;
  var relatedProduct;
  const EID = Buffer.from(id, 'base64').toString('binary')

  // if (isNaN(parseInt(EID})) {
  //   return res.status(400).send({ message: "Product not found"});
  // }

  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(`select * from products where id=${EID}`);
      product = rows[0];

      if (product?.category) {
        const rows5 = await query(`select * from products where category="${product.category}"`);
        relatedProduct = rows5;
      }
      if (rows.length == 0) {
        return res.status(400).send({ message: "Product not found" });
      }

      var sql1 = `select * from images where product_id=${EID};`;
      var rows1 = await query(sql1);
      productImages = rows1;

      //get RelatedProductImages
      var sql2 = `select * from images where category='${product.category}';`;
      var rows2 = await query(sql2);
      RelatedProductImages = rows2;
      // console.log("RelatedProductImages", RelatedProductImages);

      //get product specifications
      const sql3 = `select * from specifications where product_id = ${EID};`;
      const rows3 = await query(sql3);
      productDetails = rows3;

      //get product properties
      const sql4 = `select * from products where product_code=(select DISTINCT product_code from products where id=${EID});`;
      const rows4 = await query(sql4);
      productProperties = rows4;

      // console.log("productDetails", productDetails);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: `Product could not be identified with ${EID} ID` });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        product,
        productImages,
        RelatedProductImages,
        relatedProduct,
        productDetails,
        productProperties
      });
    })
    .catch((error) => {
      console.log("Product not found by id :-", error.message);
      return res.status(400).send({ message: "Operation could not be completed" });
    });
});



// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product;

  req.body.user = req.user.id;
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  if (!EID) {
    return res.status(400).send({ message: "Product could not be identified " });
  }
  //if null then set interger value should be 0
  const original_price = req.body.original_price ? req.body.original_price : 0;
  const discount = req.body.discount ? req.body.discount : 0;
  const sale_price = req.body.sale_price ? req.body.sale_price : 0;
  const stock = req.body.stock ? req.body.stock : 0;
  const gst = req.body.gst ? req.body.gst : 0;
  const gstPrice = req.body.gstPrice ? req.body.gstPrice : 0;

  const productDetails = req.body.productDetails ? JSON.parse(req.body.productDetails) : "";
  // console.log("productDetails", productDetails);
  // req.body.images = "imagesLinks";
  //replace ',",` by \'
  const name = req.body.name ? trim(req.body.name) : "";
  const description = req.body.description ? trim(req.body.description) : "";
  const seller = req.body.seller ? trim(req.body.seller) : "";

  const code = req.body.code ? req.body.code
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, "\\`").trim().toUpperCase() : "";

  const properties1 = req.body.properties1 ? capitalizeFirstLetter(req.body.properties1) : "";
  const value1 = req.body.value1 ? capitalizeFirstLetter(req.body.value1) : "";
  const properties2 = req.body.properties2 ? capitalizeFirstLetter(req.body.properties2) : "";
  const value2 = req.body.value2 ? capitalizeFirstLetter(req.body.value2) : "";
  const properties3 = req.body.properties3 ? capitalizeFirstLetter(req.body.properties3) : "";
  const value3 = req.body.value3 ? capitalizeFirstLetter(req.body.value3) : "";


  const sql = `update products set name= '${name}',original_price= ${original_price},
  discount=${discount},  tax_rate=${gst}, tax_amount=${gstPrice}, sale_price=${sale_price}, description='${description}',
  category='${req.body.category}', seller='${seller}', stock= ${stock}, date=NOW(),product_code='${code}', properties1='${properties1}',
  value1='${value1}',properties2='${properties2}',value2='${value2}',properties3='${properties3}',value3='${value3}'
   where id =${EID};`;

  // console.log("sql", sql);
  // const sql = `update products set ?  where id =${EID}`;
  // console.log("[req.body]",[req.body]);

  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      // if (properties1 || properties2 || properties3 || value1 || value2 || value3) {
      //   if (!code) {
      //     return res.status(400).send({ message: "Product Code Required" });
      //   }
      // }
      // const rows = await query(sql, [req.body]);
      const rows = await query(sql);
      product = rows;

      if (req.files?.length) {
        const deleteImages = `select path,id from images where product_id=${EID};`;
        const deleteImages1 = `delete from images where product_id=${EID};
        ALTER TABLE images AUTO_INCREMENT=1;`;
        const row1 = await query(deleteImages);
        // console.log("row1", row1);
        row1.map(async (path) => {
          try {
            fs.unlinkSync(path.path);
            const row12 = await query(deleteImages1);
          } catch (err) {
            console.error(err);
          }
        });

        if (req.files.length) {
          Object.values(req.files).map(async (file) => {
            // console.log("File name : " + file.filename + " ===" + "path : " + file.path);
            const filePath = file.path.replace(/\\/g, "\\\\");
            const sql1 = `insert into images(id, product_id, imageName, path, category) values(NULL, ${EID},'${file.filename}',
            '${filePath}', '${req.body.category}');`;
            const rows1 = await query(sql1);
            productImages = rows1;
          });
        }
        // var filePath = [];
        // var imageName = [];
        // var imagesLinks = {
        //   productImage: Object.values(req.files).map((file) => {
        //     filePath.push(file.path.replace(/\\/g, "\\\\"});
        //     imageName.push(file.filename);
        //   }),
        // };

        // if (filePath.length === imageName.length) {
        //   for (let i = 0; i < imageName.length; i++) {
        //     const sql12 = `update images set imageName='${imageName[i]}', path='${filePath[i]}' 
        //   where product_id=${EID} and id=${row1[i].id};`;
        //     const rows1 = await query(sql12);
        //     productImages = rows1;
        //   }
        // }
      }

      //product specificatio table adding
      if (productDetails[0].title !== "" && productDetails[0].data !== "") {
        const sql7 = `delete from specifications where product_id = ${EID};
                        ALTER TABLE specifications AUTO_INCREMENT=1;`
        var rows7 = await query(sql7);

        productDetails.map(async (field) => {
          var sql5 = `insert into specifications(id, product_id, title, description) value (Null, ${EID}, 
         '${field.title ? (field.title).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.title}',
         '${field.description ? (field.description).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.description}');`
          var rows5 = await query(sql5);
          productSpecifications = rows5;
          // console.log("sql5", sql5);
          // console.log("productSpecifications", productSpecifications);
          // console.log("title", field.title, field.desc, product_id);
        })
      }

      // if (!rows.affectedRows) {
      //   return res.status(400).send({ message: "Product could not be updated" });
      // }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Product could not be updated' });
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
      console.log("Product could not be updated", error.message);
      return res.status(400).send({ message: "Product could not be updated" });
    });
});

//Delete product  => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql2 = `select imageName from images where product_id=${EID}`;
  const sql = `delete from products where id=${EID};
  delete from images where product_id=${EID};
  ALTER TABLE images AUTO_INCREMENT=1;`;
  const sql3 = `delete from specifications where product_id = ${EID};
  ALTER TABLE specifications AUTO_INCREMENT=1;`
  const sql4 = `delete from review where product_id=${EID};
  ALTER TABLE review AUTO_INCREMENT=1;`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows1 = await query(sql2);
      // rows1.map((imageName) => {
      //   try {
      //     fs.unlinkSync("uploads/product/" + imageName.imageName);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // });
      const rows = await query(sql);
      const rows3 = await query(sql3);
      const rows4 = await query(sql4);
      if (rows.affectedRows === 0) {
        return res.status(400).send({ message: "Product not found" });
      }
      if (rows3.affectedRows === 0) {
        return res.status(400).send({ message: "Product Specifications could not be deleted" });
      }
      if (rows4.affectedRows === 0) {
        return res.status(400).send({ message: "Product review could not be deleted" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Operation could not be completed' })
    }
    finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        message: "Product has been deleted",
      });
    })
    .catch((error) => {
      console.log("Product could not be deleted :-", error.message);
      return res.status(400).send({ message: "Product could not be deleted" });
    });
});

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    product_id: productId,
    name: req.user.name,
    rating: Number(rating),
    comment,
    pic: "pic"
  };

  const EID = Buffer.from(review.product_id, 'base64').toString('binary')

  // console.log("review", review);
  const salid = `select id from review where user_id=${review.user} and product_id=${EID};`;
  const query = util.promisify(connection.query).bind(connection);

  const commentReview = review.comment.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim()
  // console.log("salid", salid);
  //No of review in products
  //ratings values of products
  const sql3 = `update products set ratings=(select avg(rating) from review where product_id=${EID}), 
  numOfReviews=(SELECT COUNT(product_id) FROM review where product_id =${EID}) where id =${EID};`;
  // console.log("sql3", sql3);
  // console.log("ss", rows.length);

  let result = async function () {
    try {
      const rows = await query(salid);

      //check new user or not
      if (rows.length === 0) {
        const sql = `insert into review(id, user_id, product_id, name, rating, comments, date, pic)
        values(NULL, ${review.user}, ${EID}, '${review.name}', ${review.rating}, '${commentReview}', NOW(), '${review.pic}');`;
        // console.log("sql", sql);
        const rows2 = await query(sql);
        const rows1 = await query(sql3);

      } else {
        const sql = `update review set  user_id =${review.user}, product_id= ${EID}, name='${review.name}',
        rating=${review.rating}, comments='${review.comment}', date= NOW() where id =${rows[0].id} `;
        // console.log("sql", sql);
        const rows2 = await query(sql);
        const rows1 = await query(sql3);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Product review could not be created' });
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
      console.log("Review could not be created :-", error.message);
      return res.status(400).send({ message: "Review could not be created" });
    });
});

//Get Product Review   => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  let review;
  const EID = Buffer.from(`${req.query.id}`, 'base64').toString('binary')
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(`select * from review where product_id=${EID} order by id DESC`);
      review = rows;
    } catch (err) {
      console.log(err);
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        reviews: review
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
});
// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  console.log("eq.params0", req.query);
  const Ep = Buffer.from(req.query.productId, 'base64').toString('binary')
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql = `delete from review where id=${EID};`;
  const sql2 = `update products set ratings=(select IFNULL(avg(rating),0) from review where product_id=${Ep}), numOfReviews=(SELECT COUNT(*) FROM review
  where product_id=${Ep}) where id=${Ep};`;
  const sql1 = `ALTER TABLE review AUTO_INCREMENT=1;`;
  const query = util.promisify(connection.query).bind(connection);


  let result = async function () {
    try {
      result2();
      const rows1 = await query(sql2);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Operation could not be completed' });
    }
  };
  let result2 = async function () {
    try {
      const rows = await query(sql);
      const rows2 = await query(sql1);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Operation could not be completed' });
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
      console.log("Review is not deleted :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

//add category
// Create new review   =>   /api/v1/admin/category/new
exports.addCategory = catchAsyncErrors(async (req, res, next) => {
  const newCategory = req.body.newCategory.trim();
  if (!req.body.newCategory) {
    return res.status(400).send({ message: "Category cannot be empty" });
  }

  let result = async function () {
    try {
      if (req.files.length) {
        Object.values(req.files).map(async (file) => {
          const sql = `insert into category(id, category, img) values(NULL,'${newCategory}','${file.filename}');`;
          const query = util.promisify(connection.query).bind(connection);

          const rows = await query(sql);
          if (rows.affectedRows === 0) {
            return res.status(400).send({ message: "Category could not be added" });
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Same category could not be added' });
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
      console.log("Category is not added :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

//Get category   => /api/v1/admin/category
exports.getCategory = catchAsyncErrors(async (req, res, next) => {
  var category;
  const sql = `select * from category`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(sql);
      category = rows;
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Category could not be found' });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };
  result()
    .then((value) => {
      res.status(200).json({
        success: true,
        category: category
      });
    })
    .catch((error) => {
      console.log("category not found:-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

// Delete category   =>   /api/v1/admin/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql = `delete from category where id=${EID}; ALTER TABLE category AUTO_INCREMENT=1;`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(sql);
      if (rows.affectedRows === 0) {
        return res.status(400).send({ message: "Category could not be deleted" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Category could not be deleted' });
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
      console.log("Category is not deleted :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

// Update category   =>   /api/v1/admin/category/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const categoryName = req.body.categoryName.trim();
  var rows;

  let result = async function () {
    try {
      if (req.files.length) {
        Object.values(req.files).map(async (file) => {
          const sql = `update category set category = '${categoryName}', img='${file.filename}' where id=${EID};`;
          const query = util.promisify(connection.query).bind(connection);

          rows = await query(sql);
          // console.log("rows", rows);
          if (rows.affectedRows === 0) {
            return res.status(400).send({ message: "Category not found" });
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Same category could not be updated' });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  };

  result()
    .then((value) => {
      if (rows) {
        res.status(200).json({
          success: true,
        });
      }
    })
    .catch((error) => {
      console.log("Category is not updated :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});

// Update Banner   =>   /api/v1/update/banner
exports.updateBanner = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      if (req.files.length) {
        sql1 = `select * from banner where id=${EID};`;
        sql2 = `insert into banner(id, url) values(${EID},"/uploads/banner/${req.files[0].filename}");`;
        sql = `update banner set url='/uploads/banner/${req.files[0].filename}' where id=${EID};`;

        const rows1 = await query(sql1);

        if (!rows1.length) {
          //No record in table then insert
          const rows2 = await query(sql2);
        } else {
          //dele from dir 
          if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
            try {
              fs.unlinkSync('uploads/banner/' + rows1[0].url);
            } catch (err) {

            }
          }

          //record found then update
          const rows = await query(sql);
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "Images could not updated" });
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
      console.log(error.message);
      return res.status(400).send({ message: "Side images could not updated" });
    });
})

// Update Side images   =>  /api/v1/update/side/images
exports.updateSideImage = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      if (req.files.length) {
        const keyword = req.body.keyword ? req.body.keyword : "Keyword"
        sql1 = `select * from side_images where id=${EID};`;
        sql2 = `insert into side_images(id,keyword, url) values(${EID},"${keyword}","${req.files[0].filename}");`;
        sql = `update side_images set url='${req.files[0].filename}', keyword="${keyword}" where id=${EID};`;
        const rows1 = await query(sql1);

        if (!rows1.length) {
          //No record in table then insert
          const rows2 = await query(sql2);
        } else {
          //dele from dir 
          if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
            try {
              fs.unlinkSync('uploads/banner/' + rows1[0].url);
            } catch (err) {

            }
          }

          //record found then update
          const rows = await query(sql);
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "Images could not updated" });
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
      console.log(error.message);
      return res.status(400).send({ message: "Side images could not updated" });
    });
})

// Get  Side images   =>  /api/v1/update/side/images/get
exports.getSideImage = catchAsyncErrors(async (req, res, next) => {
  const query = util.promisify(connection.query).bind(connection);

  var sideImages;
  let result = async function () {
    try {
      sql1 = `select * from side_images`;
      const rows1 = await query(sql1);
      sideImages = rows1;

    } catch (err) {
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  }
  result()
    .then(value => {
      res.status(200).json({
        success: true,
        sideImages
      })
    }).catch(error => {
      console.log(error.message);
      return res.status(400).send({ message: "Side images could not getting" });
    });
})

// Get  Sider images   =>  /api/v1/update/sider/images/get
exports.getSiderImage = catchAsyncErrors(async (req, res, next) => {
  const query = util.promisify(connection.query).bind(connection);

  var siderImages;
  let result = async function () {
    try {
      sql1 = `select * from banner`;
      const rows1 = await query(sql1);
      siderImages = rows1;

    } catch (err) {

    }
  }
  result()
    .then(value => {
      res.status(200).json({
        success: true,
        siderImages
      })
    }).catch(error => {
      console.log(error.message);
      return res.status(400).send({ message: "Sider images could not getting" });
    });
})


// Update checout stock    =>  /api/v1/chekout/update
exports.updateCheckoutStock = catchAsyncErrors(async (req, res, next) => {
  const sql = `select * from orders where paymentStatus!= 'Success' and paymentStatus!= 'Fail' and user_id=${req.user.id} and order_id != ${req.body.order_id};`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(sql);
      if (rows.length) {
        rows.map(async (val) => {
          if (val.reason != 1) {
            const sql3 = `update orders set reason=1 where id=${val.id}`;
            const rows3 = await query(sql3);

            const sql2 = `update products set stock=stock+${val.quantity}, top=top-1 where id=${val.product_id}`;
            const rows2 = await query(sql2);
          }

          // const sql1 = `delete from orders where paymentStatus!= 'Success' and paymentStatus!= 'Fail' and user_id=${req.user.id} and order_id != ${req.body.order_id};`;
          // const rows1 = await query(sql1);
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
      res.status(200).json({
        success: true
      });
    }).catch(error => {
      console.log("Operation could not be completed:-", error.message);
    });
})


// Delete BAnner images   =>   /api/v1/delete/banner/:id
exports.deleteBanner = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql1 = `select * from banner where id=${EID};`;
  const sql = `update banner set url="", keyword="" where id =${EID};`;
  const query = util.promisify(connection.query).bind(connection);


  let result = async function () {
    try {
      const rows1 = await query(sql1);
      const rows = await query(sql);

      if (rows1.length) {
        if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
          try {
            fs.unlinkSync('uploads/banner/' + rows1[0].url);
          } catch (err) {

          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Operation could not be completed' });
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
      console.log("Banner images is not deleted :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});


// Delete Side images   =>   /api/v1/delete/side/images/:id'
exports.deleteSideImage = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql1 = `select * from side_images where id=${EID};`;
  const sql = `update side_images set url="", keyword="" where id =${EID};`;
  const query = util.promisify(connection.query).bind(connection);


  let result = async function () {
    try {
      const rows1 = await query(sql1);
      const rows = await query(sql);

      if (rows1.length) {
        if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
          try {
            fs.unlinkSync('uploads/banner/' + rows1[0].url);
          } catch (err) {

          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Operation could not be completed' });
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
      console.log("Banner images is not deleted :-", error.message);
      return res.status(400).send({ message: 'Operation could not be completed' })
    });
});


//set top product => /api/v1/top/product/:id
exports.topProduct = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const sql = `select * from products where id =${EID};`;
  const sql2 = `update products set main = 1 where id =${EID};`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(sql);
      if (rows[0].main === 1) {
        const sql3 = `update products set main = 0 where id =${EID};`;
        const rows3 = await query(sql3);
      } else {
        const rows2 = await query(sql2);
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ status: 1, message: `Product could not set as top product` });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  }
  result()
    .then(value => {
      res.status(200).json({
        success: true
      });
    }).catch(error => {
      console.log(error.message)
      return res.status(400).send({ message: `Operation could not be completed` });
    });
})
