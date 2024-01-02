const nodemailer = require('nodemailer');

const sendGmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.GMAIL_EMAIL}`,
    pass: `${process.env.GMAIL_PASSWORD}`
  },
  tls: { rejectUnauthorized: false }
});


module.exports = sendGmail;










//verfiy emiol
const sendGmail = require('../utils/sendGmail');
exports.emailVarification = catchAsyncErrors(async (req, res, next) => {
  const email = req.body.email;
  const { getEmailCode } = getEmailToken.getEmailToken();
  const message = otp(getEmailCode);

  let result = async function () {
    try {
      const mailOptions = {
        from: `${process.env.GMAIL_FROM_EMAIL}`,
        to: `${email}`,
        subject: 'SGSRO  Verification Code',
        html: message
      }

      sendGmail.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
      })
    } catch (error) {
      return res.status(500).send({ message: "Verification of E-mail could not be completed" });
    } finally {
      await util.promisify(connection.end).bind(connection);

    }
  }
  result()
    .then(value => {
      res.status(200).json({
        success: true,
        data: getEmailCode
      })
    }).catch(error => {
      console.log(error.message)
      return res.status(500).send({ message: "Verification of E-mail could not be completed" });
    });
})


//Share Promocode => /admin/coupons/share/:id
exports.sharePromocode = catchAsyncErrors(async (req, res, next) => {
  const EID = Buffer.from(req.query.id, 'base64').toString('binary')
  const eid = req.body;
  // eid.map((id) => {
  //     console.log("sed", id);
  // })
  const sql = `select * from coupon where id=${EID}`;
  const query = util.promisify(connection.query).bind(connection);

  let result = async function () {
    try {
      const rows = await query(sql);

      if (rows.length <= 0) {
        return res.status(400).send({ message: 'Coupon not found' });
      } else {
        const url = `https://SGSRO .co.in/`;
        const message = offer(rows[0]);

        try {
          eid.map((user) => {
            const mailOptions = {
              from: `${process.env.GMAIL_FROM_EMAIL}`,
              to: `${user}`,
              subject: 'Best Offer Coupon Code - SGSRO ',
              html: message
            }

            sendGmail.sendMail(mailOptions, function (err, info) {
              if (err)
                console.log(err)
              else
                console.log(info);
            })
          })

        } catch (error) {
          console.log("err coupon email send")
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "Wrong Email! Operation could not be completed" });
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
      return res.status(400).send({ message: "Operation could not be completed" });
    });
})

//send enquiry => /enquiry
exports.sendEnquiry = catchAsyncErrors(async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const message = req.body.message;
  // const pName = req.body.pName ? req.body.pName : "-";
  // const quantity = req.body.quantity ? req.body.quantity : "-";

  let result = async function () {
    try {
      const mailOptions = {
        from: `${process.env.GMAIL_FROM_EMAIL}`,
        to: `apurvkolte10@gmail.com`,
        subject: `SGSRO  Enquiry Form-${name}`,
        html: enquiry(name, message, email, mobile)
      }

      sendGmail.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
      })

    } catch (err) {
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
    });
}