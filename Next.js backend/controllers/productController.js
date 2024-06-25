const { queryDatabase, executeTransaction } = require('./query');
const { generateFullQuery } = require('../utils/generateFullQuery');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { capitalizeFirstLetter } = require("../utils/capitalizeFirstLetter");
const { trim } = require('../utils/trim');
const fs = require("fs");
const winston = require('../winston/config');

//Create new product  => /api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {
  let product_id;
  let code;
  let productDetails = req.body.productDetails ? JSON.parse(req.body.productDetails) : [];
  const name = req.body.name ? trim(req.body.name) : "";
  const description = req.body.description ? trim(req.body.description) : "";
  const seller = req.body.seller ? trim(req.body.seller) : "";
  const discount = req.body.discount ? trim(req.body.discount) : 0;
  const fileName = req.files?.[0]?.filename || null;
  const properties1 = req.body.properties1 ? capitalizeFirstLetter(req.body.properties1) : "";
  const value1 = req.body.value1 ? capitalizeFirstLetter(req.body.value1) : "";
  const properties2 = req.body.properties2 ? capitalizeFirstLetter(req.body.properties2) : "";
  const value2 = req.body.value2 ? capitalizeFirstLetter(req.body.value2) : "";
  const properties3 = req.body.properties3 ? capitalizeFirstLetter(req.body.properties3) : "";
  const value3 = req.body.value3 ? capitalizeFirstLetter(req.body.value3) : "";
  const uploadedFiles = req.files;
  const filenames = uploadedFiles?.map(file => file.filename);
  const productDetailsString = JSON.stringify(req.body.productDetails);


  if (properties1 || properties2 || properties3) {
    code = req.body.code ? trim(req.body.code) : "";
  }

  const productValues = { name, original_price: req.body.original_price, discount, tax_rate: req.body.gst, tax_amount: req.body.gstPrice, sale_price: req.body.sale_price, description, category: req.body.category, seller, stock: req.body.stock, product_code: code, image: fileName, properties1, value1, properties2, value2, properties3, value3, images: JSON.stringify(filenames), specifications: productDetailsString };

  const productSQL = `INSERT INTO products SET ?`;

  // generateFullQuery(productSQL, productValues);

  try {
    const productResult = await queryDatabase(productSQL, productValues);
    product_id = productResult.insertId;

    res.status(200).json({
      success: true,
      product_id,
    });
  } catch (error) {
    winston.error('Error creating product:', error);
    res.status(400).send({ message: "Product could not be created" });
  }
};


//Get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const productsTop = await queryDatabase('SELECT * FROM products WHERE main=?', [1]);
    const products = await queryDatabase('SELECT * FROM products ORDER BY RAND() LIMIT ?', [30]);

    res.status(200).json({
      success: true,
      products,
      productsTop
    });
  } catch (error) {
    winston.error("Error fetching products:", error);
    console.log("Error fetching products:", error);
    return next(new ErrorHandler('Operation could not be completed'));
  }
});

//Get all products (Admin) => /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const rows = await queryDatabase("SELECT * FROM products ORDER BY id Desc");
    const products = rows;

    res.status(200).json({
      success: true,
      products
    });
  } catch (err) {
    console.error("Products could not be identified:", err.message);
    res.status(400).send({ message: 'Products could not be identified' });
  }
});


//Get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.query.id ? req.query.id : 0;
  const EID = Buffer.from(id, 'base64').toString('binary');

  try {
    const productQuery = `SELECT * FROM products WHERE id = ?`;
    const propertiesQuery = `SELECT * FROM products WHERE product_code = (SELECT DISTINCT product_code FROM products WHERE id = ?)`;

    // Execute all queries concurrently
    const [productRows, productProperties] = await Promise.all([
      queryDatabase(productQuery, [EID]),
      queryDatabase(propertiesQuery, [EID])
    ]);
    const product = productRows[0];
    if (!product) {
      return res.status(400).send({ message: "Product not found" });
    }

    const relatedProductQuery = `SELECT * FROM products WHERE category = ?`;
    const relatedProduct = await queryDatabase(relatedProductQuery, [product.category]);

    res.status(200).json({
      success: true,
      product,
      relatedProduct,
      productProperties
    });
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(400).send({ message: `Product could not be identified with ID: ${EID}` });
  }
});


// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary');

  try {
    const original_price = req.body.original_price || 0;
    const discount = req.body.discount || 0;
    const sale_price = req.body.sale_price || 0;
    const stock = req.body.stock || 0;
    const gst = req.body.gst || 0;
    const gstPrice = req.body.gstPrice || 0;

    const name = req.body.name ? trim(req.body.name) : "";
    const description = req.body.description ? trim(req.body.description) : "";
    const seller = req.body.seller ? trim(req.body.seller) : "";

    const code = req.body.code ? trim(req.body.code) : "";
    const properties1 = req.body.properties1 ? capitalizeFirstLetter(req.body.properties1) : "";
    const value1 = req.body.value1 ? capitalizeFirstLetter(req.body.value1) : "";
    const properties2 = req.body.properties2 ? capitalizeFirstLetter(req.body.properties2) : "";
    const value2 = req.body.value2 ? capitalizeFirstLetter(req.body.value2) : "";
    const properties3 = req.body.properties3 ? capitalizeFirstLetter(req.body.properties3) : "";
    const value3 = req.body.value3 ? capitalizeFirstLetter(req.body.value3) : "";
    const fileName = req.files?.[0]?.filename || null;
    const imagePart = fileName ? `image='${fileName}',` : '';

    const uploadedFiles = req.files;
    const filenames = uploadedFiles?.map(file => file.filename);
    const productDetailsString = JSON.stringify(req.body.productDetails);
    const filenames1 = filenames.length > 0 ? `images='${JSON.stringify(filenames)}',` : '';


    if (uploadedFiles.length > 0) {
      const deleteImagesQuery = `SELECT images FROM products WHERE id=?`;
      const deleteImagesResult = await queryDatabase(deleteImagesQuery, [EID]);

      // Ensure deleteImagesResult is handled correctly based on your database structure
      if (deleteImagesResult.length > 0 && deleteImagesResult[0].images) {
        const imagesToDelete = JSON.parse(deleteImagesResult[0].images);

        const deleteImagePromises = imagesToDelete.map(async (img) => {
          try {
            await fs.promises.unlink(`./public/uploads/product/${img}`);
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        });

        await Promise.all(deleteImagePromises);
      }
    }


    const updateQuery = ` UPDATE products SET name = ?, original_price = ?, discount = ?, tax_rate = ?, tax_amount = ?, sale_price = ?, description = ?, category = ?, seller = ?, stock = ?, date = NOW(), product_code = ?, ${imagePart} properties1 = ?, value1 = ?, properties2 = ?, value2 = ?, properties3 = ?, value3 = ?, ${filenames1} specifications=? WHERE id = ?; `;
    const updateValues = [name, original_price, discount, gst, gstPrice, sale_price, description, req.body.category, seller, stock, code, properties1, value1, properties2, value2, properties3, value3, productDetailsString, EID];
    await queryDatabase(updateQuery, updateValues);


    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(400).send({ message: 'Product could not be updated' });
  }
});


//Delete product  => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary');

  const sql1 = `SELECT images FROM products WHERE id=?`;
  const sql2 = `DELETE FROM products WHERE id=?;`;
  const sql3 = `DELETE FROM review WHERE product_id=?; `;
  const sql4 = "ALTER TABLE review AUTO_INCREMENT=1;"

  try {
    const imageRow = await queryDatabase(sql1, [EID]);
    const productRow = await queryDatabase(sql2, [EID]);


    // if (productRow.affectedRows == 0) {
    //   return res.status(400).send({ message: "Product not found" });
    // }

    await queryDatabase(sql3, [EID]);
    await queryDatabase(sql4, [EID]);
    await queryDatabase(sql3, [EID]);
    await queryDatabase(sql4);

    imageRow.map((imageObject) => {
      const images = JSON.parse(imageObject.images);
      images.forEach((imageName) => {
        try {
          const filename = imageName.split(',').pop();
          const filePath = "public/uploads/product/" + filename;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted ${filename}`);
          }
        } catch (err) {
          console.error(`Error deleting ${imageName}: ${err}`);
        }
      });
    });

    res.status(200).json({ success: true, message: "Product has been deleted" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(400).send({ message: "Product could not be deleted" });
  }
});


// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;
  const userPic = "pic"; // Placeholder for user picture

  const EID = Buffer.from(productId, 'base64').toString('binary');

  const salid = `SELECT id FROM review WHERE user_id=? AND product_id=?;`;

  try {
    const rows = await queryDatabase(salid, [userId, EID]);

    // Check if the user has already reviewed the product
    if (rows.length === 0) {
      const insertReviewSQL = `INSERT INTO review (user_id, product_id, name, rating, comments, date, pic)
      VALUES (?, ?, ?, ?, ?, NOW(), ?);`;

      await queryDatabase(insertReviewSQL, [userId, EID, userName, rating, comment, userPic]);

    } else {
      const reviewId = rows[0].id;
      const updateReviewSQL = `UPDATE review
      SET user_id = ?, product_id = ?, name = ?, rating = ?, comments = ?, date = NOW()
      WHERE id = ?;`;

      await queryDatabase(updateReviewSQL, [userId, EID, userName, rating, comment, reviewId]);

    }

    // Update product ratings and number of reviews
    const updateProductSQL = `UPDATE products 
    SET ratings = (SELECT AVG(rating) FROM review WHERE product_id = ?), 
        numOfReviews = (SELECT COUNT(product_id) FROM review WHERE product_id = ?)
    WHERE id = ?;`;

    await queryDatabase(updateProductSQL, [EID, EID, EID]);


    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error creating product review:", err.message);
    res.status(400).send({ message: 'Product review could not be created' });
  }
});


//Get Product Review   => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(`${req.query.id}`, 'base64').toString('binary');

  try {
    const querySQL = `SELECT * FROM review WHERE product_id=? ORDER BY id DESC;`;
    const reviews = await queryDatabase(querySQL, [EID]);

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching product reviews:", error.message);
    res.status(400).send({ message: 'Product reviews could not be retrieved' });
  }
});

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const Ep = Buffer.from(req.query.productId, 'base64').toString('binary');
  const EID = Buffer.from(req.query.id, 'base64').toString('binary');
  const deleteReviewSQL = `DELETE FROM review WHERE id = ?;`;
  const resetAutoIncrementSQL = `ALTER TABLE review AUTO_INCREMENT = ?;`;
  const updateProductSQL = `UPDATE products 
                            SET ratings = (SELECT IFNULL(AVG(rating), 0) FROM review WHERE product_id = ?), 
                                numOfReviews = (SELECT COUNT(*) FROM review WHERE product_id = ?)
                            WHERE id = ?;`;

  try {
    await queryDatabase(deleteReviewSQL, [EID]);
    await queryDatabase(resetAutoIncrementSQL);
    await queryDatabase(updateProductSQL, [Ep, Ep, Ep]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(400).send({ message: 'Operation could not be completed' });
  }

});


//add category
// Create new review   =>   /api/v1/admin/category/new
exports.addCategory = catchAsyncErrors(async (req, res, next) => {
  const newCategory = req.body.newCategory.trim();
  if (!newCategory) {
    return res.status(400).send({ message: "Category cannot be empty" });
  }

  try {

    if (req.files.length) {
      for (const file of req.files) {
        const insertCategorySQL = `INSERT INTO category (id, category, img) VALUES (NULL, ?, ?);`;
        const rows = await queryDatabase(insertCategorySQL, [newCategory, file.filename]);

        if (rows.affectedRows === 0) {

          return res.status(400).send({ message: "Category could not be added" });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    winston.info("Category could not be added: ", error.message);
    console.log("Category could not be added: ", error.message);
    return res.status(400).send({ message: 'Operation could not be completed' });
  }
});


//Get category   => /api/v1/admin/category
exports.getCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const sql = `SELECT * FROM category`;
    const rows = await queryDatabase(sql);

    res.status(200).json({
      success: true,
      category: rows
    });
  } catch (error) {
    winston.info("Category not found:", error.message);
    console.log("Category not found:", error.message);
    return res.status(400).send({ message: 'Category could not be found' });
  }
});


// Delete category   =>   /api/v1/admin/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const deleteCategorySQL = `DELETE FROM category WHERE id = ?;`;
    const resetAutoIncrementSQL = `ALTER TABLE category AUTO_INCREMENT = 1;`;


    await queryDatabase(deleteCategorySQL, [EID]);
    await queryDatabase(resetAutoIncrementSQL);
    if (deleteCategorySQL.affectedRows === 0) {
      return res.status(400).send({ message: "Category could not be deleted" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    winston.info("Category is not deleted:", error.message);
    console.log("Category is not deleted:", error.message);
    return res.status(400).send({ message: 'Operation could not be completed' });
  } finally {

  }
});


// Update category   =>   /api/v1/admin/category/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const categoryName = req.body.categoryName.trim();
    let rows;

    if (req.files.length) {
      for (const file of Object.values(req.files)) {
        const updateCategorySQL = `UPDATE category SET category = ?, img = ? WHERE id = ?;`;
        const rows = await queryDatabase(updateCategorySQL, [categoryName, file.filename, EID]);

        if (rows.affectedRows === 0) {
          return res.status(400).send({ message: "Category not found" });
        }
      }


    }

    res.status(200).json({ success: true });
  } catch (error) {
    winston.info("Category is not updated:", error.message);
    console.log("Category is not updated:", error.message);
    return res.status(400).send({ message: 'Operation could not be completed' });
  }
});


// Update Banner   =>   /api/v1/update/banner
exports.updateBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');


    if (req.files.length) {
      const sql1 = `SELECT * FROM banner WHERE id=?;`;
      const sql2 = `INSERT INTO banner (id, url) VALUES (?, ?);`;
      const sql = `UPDATE banner SET url=? WHERE id=?;`;

      const rows1 = await query(sql1, [EID]);

      if (!rows1.length) {
        // No record in table then insert
        await query(sql2, EID, `/uploads/banner/${req.files[0].filename}`);
      } else {
        // Delete from directory if exists
        if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
          try {
            fs.unlinkSync('uploads/banner/' + rows1[0].url);
          } catch (err) {
            throw err;
          }
        }

        // Record found then update
        await queryDatabase(sql, [`/uploads/banner/${req.files[0].filename}`, EID]);
      }
    }


    res.status(200).json({ success: true });
  } catch (error) {
    winston.info("Images could not be updated:", error.message);
    console.log("Images could not be updated:", error.message);
    return res.status(400).send({ message: "Side images could not be updated" });
  }
});


// Update Side images   =>  /api/v1/update/side/images
exports.updateSideImage = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');

    if (req.files.length) {
      const keyword = req.body.keyword ? req.body.keyword : "Keyword";
      const sql1 = `SELECT * FROM side_images WHERE id=?;`;
      const insertSideImageSQL = `INSERT INTO side_images (id, keyword, url) VALUES (?, ?, ?);`;
      const updateSideImageSQL = `UPDATE side_images SET url = ?, keyword = ? WHERE id = ?;`;

      const rows1 = await query(sql1, [EID]);

      if (!rows1.length) {
        // No record in table then insert
        await query(insertSideImageSQL, [EID, keyword, req.files[0].filename]);
      } else {
        // Delete from directory if exists
        if (fs.existsSync('./uploads/banner/' + rows1[0].url)) {
          try {
            fs.unlinkSync('uploads/banner/' + rows1[0].url);
          } catch (err) {
            throw err;
          }
        }

        await queryDatabase(updateSideImageSQL, [req.files[0].filename, keyword, EID]);
      }
    }


    res.status(200).json({ success: true });
  } catch (error) {
    winston.info("Images could not be updated:", error.message);
    console.log("Images could not be updated:", error.message);
    return res.status(400).send({ message: "Side images could not be updated" });
  }
});


// Get  Side images   =>  /api/v1/update/side/images/get
exports.getSideImage = catchAsyncErrors(async (req, res, next) => {
  try {
    const sql1 = `SELECT * FROM side_images`;
    const rows1 = await query(sql1);
    const sideImages = rows1;


    res.status(200).json({
      success: true,
      sideImages
    });
  } catch (error) {
    winston.info("Side images could not be retrieved:", error.message);
    console.log("Side images could not be retrieved:", error.message);
    return res.status(400).send({ message: "Side images could not be retrieved" });
  }
});


// Get  Sider images   =>  /api/v1/update/sider/images/get
exports.getSiderImage = catchAsyncErrors(async (req, res, next) => {
  try {


    const sql = `SELECT * FROM banner`;
    const siderImages = await queryDatabase(sql);


    res.status(200).json({
      success: true,
      siderImages
    });
  } catch (error) {
    winston.info("Slider images could not be retrieved:", error.message);
    console.log("Slider images could not be retrieved:", error.message);
    return res.status(400).send({ message: "Slider images could not be retrieved" });
  }
});



// Update checout stock    =>  /api/v1/chekout/update
exports.updateCheckoutStock = catchAsyncErrors(async (req, res, next) => {
  try {
    const selectOrdersSQL = `SELECT * FROM orders WHERE paymentStatus != 'Success' AND paymentStatus != 'Fail' AND user_id = ? AND order_id != ?;`;
    const rows = await queryDatabase(selectOrdersSQL, [req.user.id, req.body.order_id]);

    for (const val of rows) {
      if (val.reason !== 1) {
        const sql3 = `UPDATE orders SET reason = 1 WHERE id = ${val.id}`;
        await query(sql3);

        const sql2 = `UPDATE products SET stock = stock + ${val.quantity}, top = top - 1 WHERE id = ${val.product_id}`;
        await query(sql2);
      }
    }


    res.status(200).json({
      success: true
    });
  } catch (error) {
    winston.info("Operation could not be completed:", error.message);
    console.log("Operation could not be completed:", error.message);
    return res.status(400).send({ message: "Operation could not be completed" });
  }
});



// Delete BAnner images   =>   /api/v1/delete/banner/:id
exports.deleteBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const selectBannerSQL = `SELECT * FROM banner WHERE id = ?;`;
    const updateBannerSQL = `UPDATE banner SET url = '', keyword = '' WHERE id = ?;`;

    const rows1 = await query(selectBannerSQL, [EID]);
    const rows = await queryDatabase(updateBannerSQL, [EID]);

    if (rows1.length && fs.existsSync('./uploads/banner/' + rows1[0].url)) {
      await fs.promises.unlink('./uploads/banner/' + rows1[0].url);
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    winston.info("Banner images could not be deleted:", error.message);
    console.log("Banner images could not be deleted:", error.message);
    return res.status(400).send({ message: 'Operation could not be completed' });
  }
});


// Delete Side images   =>   /api/v1/delete/side/images/:id'
exports.deleteSideImage = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const selectSideImageSQL = `SELECT * FROM side_images WHERE id = ?;`;
    const updateSideImageSQL = `UPDATE side_images SET url = '', keyword = '' WHERE id = ?;`;

    const rows1 = await query(selectSideImageSQL, [EID]);
    const rows = await queryDatabase(updateSideImageSQL, [EID]);

    if (rows1.length && fs.existsSync('./uploads/banner/' + rows1[0].url)) {
      await fs.promises.unlink('./uploads/banner/' + rows1[0].url);
    }


    res.status(200).json({
      success: true,
    });
  } catch (error) {
    winston.info("Side images could not be deleted:", error.message);
    console.log("Side images could not be deleted:", error.message);
    return res.status(400).send({ message: 'Operation could not be completed' });
  }
});



//set top product => /api/v1/top/product/:id
exports.topProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const EID = Buffer.from(req.query.id, 'base64').toString('binary');
    const sql2 = `UPDATE products SET main = CASE WHEN main = 0 THEN 1 ELSE 0 END WHERE id = ?`;
    const rows = await queryDatabase(sql2, [EID]);

    res.status(200).json({
      success: true
    });
  } catch (error) {
    winston.info("Product could not be set as top product:", error.message);
    console.log("Product could not be set as top product:", error.message);
    return res.status(404).send({ status: 1, message: `Product could not be set as top product` });
  }
});
