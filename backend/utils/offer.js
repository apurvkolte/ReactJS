exports.offer = (data) => {
   return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
       xmlns="http://www.w3.org/1999/xhtml"
       xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:o="urn:schemas-microsoft-com:office:office"
       >
       <head>
          <!--[if gte mso 9]>
          <xml>
             <o:OfficeDocumentSettings>
                <o:AllowPNG />
                <o:PixelsPerInch>96</o:PixelsPerInch>
             </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta
             name="viewport"
             content="width=device-width, initial-scale=1, maximum-scale=1"
             />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="date=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--[if !mso]><!-->
          <link
             href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i|Rozha+One"
             rel="stylesheet"
             />
          <!--<![endif]-->
          <title>NewsLetter</title>
          <!--[if gte mso 9]>
          <style type="text/css" media="all">
             sup {
             font-size: 100% !important;
             }
          </style>
          <![endif]-->
          <link
             rel="stylesheet"
             href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
             />
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
          <style type="text/css" media="screen">
             /* Linked Styles */
             body {
             padding: 0 !important;
             margin: 0 !important;
             display: block !important;
             min-width: 100% !important;
             width: 100% !important;
             background: #ffffff;
             -webkit-text-size-adjust: none;
             }
             a {
             color: #f43f4d;
             text-decoration: none;
             }
             p {
             padding: 0 !important;
             margin: 0 !important;
             }
             img {
             -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
             }
             .mcnPreviewText {
             display: none !important;
             }
             .footer-nav a {
             color: #b0b0ad;
             }
             .footer-bar a {
             color: #d6d6d6;
             }
             /* Mobile styles */
             @media only screen and (max-device-width: 480px),
             only screen and (max-width: 480px) {
             .mobile-shell {
             width: 100% !important;
             min-width: 100% !important;
             }
             .m-center {
             text-align: center !important;
             }
             .m-left {
             margin-right: auto !important;
             }
             .text-top {
             text-align: center !important;
             }
             .center {
             margin: 0 auto !important;
             }
             .td {
             width: 100% !important;
             min-width: 100% !important;
             }
             .m-br-15 {
             height: 15px !important;
             }
             .m20 {
             padding-bottom: 20px !important;
             }
             .pt50 {
             padding-top: 30px !important;
             }
             .pt40 {
             padding-top: 20px !important;
             }
             .pt30 {
             padding-top: 20px !important;
             }
             .m-td,
             .m-hide {
             display: none !important;
             width: 0 !important;
             height: 0 !important;
             font-size: 0 !important;
             line-height: 0 !important;
             min-height: 0 !important;
             }
             .m-block {
             display: block !important;
             }
             .m-left {
             text-align: left !important;
             }
             .fluid-img img {
             width: 100% !important;
             max-width: 100% !important;
             height: auto !important;
             }
             .m-content {
             padding: 30px 15px !important;
             }
             .m-content-inner {
             padding: 0px 15px !important;
             }
             .header-inner {
             padding: 30px 15px !important;
             }
             .pb50 {
             padding-bottom: 30px !important;
             }
             .content2 {
             padding: 20px 15px !important;
             }
             .section,
             .section2 {
             padding: 30px 15px !important;
             }
             .section5 {
             padding: 0px 15px 30px !important;
             }
             .section3,
             .section4 {
             padding: 30px 15px 0px 15px !important;
             }
             .m-content2 {
             padding: 0px 15px !important;
             }
             .content30 {
             padding: 15px !important;
             }
             .content1530 {
             padding: 15px !important;
             }
             .p1015 {
             padding: 15px !important;
             }
             .mpb20 {
             padding-bottom: 20px !important;
             }
             .mnp {
             padding: 0px !important;
             }
             .m-auto {
             width: auto !important;
             }
             .separator-holder {
             padding-bottom: 25px !important;
             }
             .separator {
             padding-top: 30px !important;
             }
             .separator2 {
             padding-top: 15px !important;
             }
             .separator3 {
             padding-top: 25px !important;
             }
             .content5025 {
             padding: 30px 15px !important;
             }
             .cell1 {
             padding: 10px 10px 10px 10px !important;
             vertical-align: top !important;
             }
             .cell2-1 {
             padding: 10px 10px 10px 10px !important;
             vertical-align: top !important;
             }
             .cell2-2 {
             padding: 10px 10px 10px 0px !important;
             vertical-align: top !important;
             }
             .column,
             .column-dir,
             .column-top,
             .column-bottom,
             .column-empty2,
             .column-empty30,
             .column-dir-top,
             .column-separator,
             .column-empty {
             float: left !important;
             width: 100% !important;
             display: block !important;
             }
             .column-empty30 {
             padding-bottom: 30px !important;
             }
             .column-empty {
             padding-bottom: 20px !important;
             }
             .column-empty2 {
             padding-bottom: 10px !important;
             }
             .column-separator {
             height: 1px !important;
             display: block !important;
             background: #f4f5ea !important;
             }
             .content-spacing {
             width: 15px !important;
             }
             }
          </style>
       </head>
       <body
          class="body"
          style="
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
          min-width: 100% !important;
          width: 100% !important;
          background: #ffffff;
          -webkit-text-size-adjust: none;
          "
          >
          <table
             width="100%"
             border="0"
             cellspacing="0"
             cellpadding="0"
             bgcolor="#ffffff"
             >
             <tr>
                <td align="center" valign="top">
                   <!-- Header -->
                   <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                         <td
                            align="center"
                            valign="top"
                            class="header"
                            bgcolor="#6ec7c2"
                            style="padding: 30px 0px 0px 0px"
                            >
                            <table
                               width="650"
                               border="0"
                               cellspacing="0"
                               cellpadding="0"
                               class="mobile-shell"
                               >
                               <tr>
                                  <td
                                     class="td"
                                     style="
                                     width: 650px;
                                     min-width: 650px;
                                     font-size: 0pt;
                                     line-height: 0pt;
                                     padding: 0;
                                     margin: 0;
                                     font-weight: normal;
                                     "
                                     >
                                     <table
                                        width="100%"
                                        border="0"
                                        cellspacing="0"
                                        cellpadding="0"
                                        >
                                        <tr>
                                           <td style="padding-bottom: 18px">
                                              <table
                                                 width="100%"
                                                 border="0"
                                                 cellspacing="0"
                                                 cellpadding="0"
                                                 >
                                                 <tr>
                                                    <th
                                                       class="column-top"
                                                       style="
                                                       font-size: 0pt;
                                                       line-height: 0pt;
                                                       padding: 0;
                                                       margin: 0;
                                                       font-weight: normal;
                                                       vertical-align: top;
                                                       "
                                                       >
                                                       <table
                                                          width="100%"
                                                          border="0"
                                                          cellspacing="0"
                                                          cellpadding="0"
                                                          >
                                                          <tr></tr>
                                                       </table>
                                                    </th>
                                                    <th
                                                       class="column-empty"
                                                       width="1"
                                                       style="
                                                       font-size: 0pt;
                                                       line-height: 0pt;
                                                       padding: 0;
                                                       margin: 0;
                                                       font-weight: normal;
                                                       vertical-align: top;
                                                       "
                                                       ></th>
                                                    <th
                                                       class="column-top"
                                                       width="200"
                                                       style="
                                                       font-size: 0pt;
                                                       line-height: 0pt;
                                                       padding: 0;
                                                       margin: 0;
                                                       font-weight: normal;
                                                       vertical-align: top;
                                                       "
                                                       >
                                                       <!--<table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                          <tr>
                                                              <td class="text-top white right"style="font-family:'Lato', Arial,sans-serif; font-size:12px; line-height:16px; text-transform:uppercase; color:#ffffff; text-align:right;">
                                                                  <multiline><a href="" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">forward</span></a> &nbsp; | &nbsp; <a href="" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">view online</span></a></multiline>
                                                              </td>
                                                          </tr>
                                                          </table>-->
                                                    </th>
                                                 </tr>
                                              </table>
                                           </td>
                                        </tr>
                                     </table>
                                  </td>
                               </tr>
                            </table>
                            <table
                               width="100%"
                               border="0"
                               cellspacing="0"
                               cellpadding="0"
                               bgcolor="#6ec7c2"
                               >
                               <tr>
                                  <td align="center">
                                     <table
                                        width="650"
                                        border="0"
                                        cellspacing="0"
                                        cellpadding="0"
                                        class="mobile-shell"
                                        bgcolor="#ffffff"
                                        style="background-color: #ffffff; margin-top: -51px;"
                                        >
                                        <tr>
                                           <td
                                              class="td"
                                              style="
                                              width: 650px;
                                              min-width: 650px;
                                              font-size: 0pt;
                                              line-height: 0pt;
                                              padding: 0;
                                              margin: 0;
                                              font-weight: normal;
                                              "
                                              >
                                              <table
                                                 width="100%"
                                                 border="0"
                                                 cellspacing="0"
                                                 cellpadding="0"
                                                 >
                                                 <tr>
                                                    <td
                                                       class=""
                                                       >
                                                       <table
                                                          width="100%"
                                                          border="0"
                                                          cellspacing="0"
                                                          cellpadding="0"
                                                          >
                                                          <tr>
                                                             <td
                                                                class="separator"
                                                                style="
                                                                padding-bottom: 20px;
                                                                border-bottom: 12px solid #60605a;
                                                                "
                                                                >
                                                                <table
                                                                   width="100%"
                                                                   border="0"
                                                                   cellspacing="0"
                                                                   cellpadding="0"
                                                                   >
                                                                   <tr>
                                                                      <!--<td class="img-right m-center"style="font-size:0pt; line-height:0pt; text-align:right;"><img src="images/free.jpg" width="96" height="44" border="0" alt="" /></td>-->
                                                                   </tr>
                                                                </table>
                                                                <table
                                                                   width="100%"
                                                                   border="0"
                                                                   cellspacing="0"
                                                                   cellpadding="0"
                                                                   >
                                                                   <tr>
                                                                      <th
                                                                         class="column"
                                                                         style="
                                                                         font-size: 0pt;
                                                                         line-height: 0pt;
                                                                         padding: 0;
                                                                         margin: 0;
                                                                         font-weight: normal;
                                                                         "
                                                                         >
                                                                         <table
                                                                            width="100%"
                                                                            border="0"
                                                                            cellspacing="0"
                                                                            cellpadding="0"
                                                                            style="margin-left: 92px;"
                                                                            >
                                                                            <tr>
                                                                               <td
                                                                                  class="fluid-img"
                                                                                  style="
                                                                                  padding-top: 30px;
                                                                                  font-size: 0pt;
                                                                                  line-height: 0pt;
                                                                                  text-align: center;
                                                                                  "
                                                                                  >
                                                                                  <img
                                                                                     src="https://SGSRO .co.in/images/logo1.png"
                                                                                     width="20%"
                                                                                     height="20%"
                                                                                     border="0"
                                                                                     alt=""
                                                                                     />
                                                                               </td>
                                                                            </tr>
                                                                         </table>
                                                                      </th>
                                                                      <th
                                                                         class="column-empty"
                                                                         width="1"
                                                                         style="
                                                                         font-size: 0pt;
                                                                         line-height: 0pt;
                                                                         padding: 0;
                                                                         margin: 0;
                                                                         font-weight: normal;
                                                                         vertical-align: top;
                                                                         "
                                                                         ></th>
                                                                      <th
                                                                         class="column"
                                                                         width="200"
                                                                         style="
                                                                         font-size: 0pt;
                                                                         line-height: 0pt;
                                                                         padding: 0;
                                                                         margin: 0;
                                                                         font-weight: normal;
                                                                         "
                                                                         >
                                                                         <table
                                                                            width="100%"
                                                                            border="0"
                                                                            cellspacing="0"
                                                                            cellpadding="0"
                                                                            >
                                                                            <tr>
                                                                               <td align="right">
                                                                                  <table
                                                                                     class="center"
                                                                                     border="0"
                                                                                     cellspacing="0"
                                                                                     cellpadding="0"
                                                                                     style="text-align: center"
                                                                                     ></table>
                                                                               </td>
                                                                            </tr>
                                                                         </table>
                                                                      </th>
                                                                   </tr>
                                                                </table>
                                                             </td>
                                                          </tr>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </table>
                                           </td>
                                        </tr>
                                     </table>
                                  </td>
                               </tr>
                            </table>
                         </td>
                      </tr>
                   </table>
                   <!-- END Header -->
                   <!-- Section 1 -->
                   <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                         <td
                            class="section2 mnp"
                            align="center"
                            valign="top"
                            style="padding: 0px 0px 50px 0px"
                            >
                            <table
                               width="650"
                               border="0"
                               cellspacing="0"
                               cellpadding="0"
                               class="mobile-shell"
                               >
                               <tr>
                                  <td
                                     class="td"
                                     style="
                                     width: 650px;
                                     max-width: 650px;
                                     font-size: 0pt;
                                     line-height: 0pt;
                                     padding: 0;
                                     margin: 0;
                                     font-weight: normal;
                                     "
                                     >
                                     <table
                                        width="100%"
                                        border="0"
                                        cellspacing="0"
                                        cellpadding="0"
                                        >
                                        <tr>
                                           <th
                                              class="column-top"
                                              width="295"
                                              bgcolor="#f43f4d"
                                              style="
                                              font-size: 0pt;
                                              line-height: 0pt;
                                              padding: 0;
                                              margin: 0;
                                              font-weight: normal;
                                              vertical-align: top;
                                              "
                                              >
                                              <table
                                                 width="100%"
                                                 border="0"
                                                 cellspacing="0"
                                                 cellpadding="0"
                                                 >
                                                 <tr>
                                                    <td class="content30" style="padding: 30px">
                                                       <table
                                                          width="100%"
                                                          border="0"
                                                          cellspacing="0"
                                                          cellpadding="0"
                                                          >
                                                          <tr>
                                                             <td
                                                                class="h4 white pb20"
                                                                style="
                                                                font-family: 'Lato', Arial, sans-serif;
                                                                font-size: 20px;
                                                                line-height: 24px;
                                                                text-align: left;
                                                                font-weight: bold;
                                                                text-transform: uppercase;
                                                                color: #ffffff;
                                                                padding-bottom: 20px;
                                                                "
                                                                >
                                                                <multiline>
                                                                   SGSRO 
                                                                </multiline>
                                                             </td>
                                                          </tr>
                                                          <tr>
                                                             <td
                                                                class="pb20"
                                                                style="padding-bottom: 20px"
                                                                >
                                                                <table
                                                                   width="100%"
                                                                   border="0"
                                                                   cellspacing="0"
                                                                   cellpadding="0"
                                                                   >
                                                                   <tr>
                                                                      <td
                                                                         valign="top"
                                                                         class="img"
                                                                         width="20"
                                                                         style="
                                                                         font-size: 0pt;
                                                                         line-height: 0pt;
                                                                         text-align: left;
                                                                         "
                                                                         >
                                                                         <img
                                                                            src="images/ico_check_white.png"
                                                                            width="11"
                                                                            height="16"
                                                                            border="0"
                                                                            alt=""
                                                                            />
                                                                      </td>
                                                                      <td
                                                                         valign="top"
                                                                         class="text white"
                                                                         style="
                                                                         font-family: 'Lato', Arial,
                                                                         sans-serif;
                                                                         font-size: 14px;
                                                                         line-height: 34px;
                                                                         text-align: left;
                                                                         color: #ffffff;
                                                                         "
                                                                         >
                                                                         <multiline>
                                                                            <h1>
                                                                               Great News!<br/> Sale Offers
                                                                            </h1>
                                                                         </multiline>
                                                                      </td>
                                                                   </tr>
                                                                </table>
                                                             </td>
                                                          </tr>
                                                          <tr>
                                                             <!--<td class="text white" style="font-family:'Lato', Arial,sans-serif; font-size:14px; line-height:20px; text-align:left; color:#ffffff;"><multiline><a href="#" target="_blank" class="link-white-u" style="color:#ffffff; text-decoration:underline;"><span class="link-white-u" style="color:#ffffff; text-decoration:underline;">Read More +</span></a></multiline></td>-->
                                                          </tr>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </table>
                                           </th>
                                           <th
                                              class="column-top"
                                              width="10"
                                              style="
                                              font-size: 0pt;
                                              line-height: 0pt;
                                              padding: 0;
                                              margin: 0;
                                              font-weight: normal;
                                              vertical-align: top;
                                              "
                                              ></th>
                                           <th
                                              class="column-top"
                                              width="240"
                                              style="
                                              font-size: 0pt;
                                              line-height: 0pt;
                                              padding: 0;
                                              margin: 0;
                                              font-weight: normal;
                                              vertical-align: top;
                                              "
                                              >
                                              <table
                                                 width="100%"
                                                 border="0"
                                                 cellspacing="0"
                                                 cellpadding="0"
                                                 >
                                                 <tr>
                                                    <td
                                                       class="fluid-img"
                                                       style="
                                                       font-size: 0pt;
                                                       line-height: 0pt;
                                                       text-align: left;
                                                       "
                                                       >
                                                       <img
                                                          src="https://www.nacionalvox.com.br/wp-content/uploads/2021/01/newsletter-estrategia-marketing.jpg"
                                                          width="345"
                                                          height="240"
                                                          border="0"
                                                          alt=""
                                                          />
                                                    </td>
                                                 </tr>
                                                 <tr>
                                                    <!--<td class="content"style="padding:24px 20px;">
                                                       <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                           <tr>
                                                               <td class="h4 pb20"style="color:#60605a; font-family:'Lato', Arial,sans-serif; font-size:20px; line-height:24px; text-align:left; font-weight:bold; text-transform:uppercase; padding-bottom:20px;"><multiline>Text With Title Example</multiline></td>
                                                           </tr>
                                                           <tr>
                                                               <td class="text pb20"style="color:#82827d; font-family:'Lato', Arial,sans-serif; font-size:14px; line-height:20px; text-align:left; padding-bottom:20px;"><multiline>Lorem ipsum dolor sit amet, consectetur dolore adipisicing elit, sed do eiusmod tempor</multiline></td>
                                                           </tr>
                                                           <tr>
                                                               <td class="text pb20"style="color:#82827d; font-family:'Lato', Arial,sans-serif; font-size:14px; line-height:20px; text-align:left; padding-bottom:20px;"><multiline><a href="#" target="_blank" class="link-u"style="color:#f43f4d; text-decoration:underline;"><span class="link-u"style="color:#f43f4d; text-decoration:underline;">Read More +</span></a></multiline></td>
                                                           </tr>
                                                       </table>
                                                       </td>-->
                                                 </tr>
                                              </table>
                                           </th>
                                        </tr>
                                     </table>
                                  </td>
                               </tr>
                               <tr>
                                  <td bgcolor="#f4f5ea" align="center">
                                     <table
                                        width="650"
                                        border="0"
                                        cellspacing="0"
                                        style="margin-bottom: 40px; "
                                        cellpadding="0"
                                        class="mobile-shell"
                                        >
                                        <tr>
                                           <td
                                              class="text pb20 white center"
                                              style="
                                              width: 421px;
                                              font-size: 16px;
                                              line-height: 1.42;
                                              letter-spacing: -.09px;
                                              color: #373737;
                                              font-family: Roboto,Arial,Calibiri,sans-serif;
                                              padding: 25px;
                                              "
                                              >
                                              <multiline>
                                                 <br/>Dear Customer,<br/>   SGSRO  getting Special Offer  On Buy Product &
                                                 Get cashback <b>₹${data.cashback} </b> on minimum <b>₹${data.minValue} </b> Payments. | All Users. For get this offer
                                                 <b> Apply Coupon :- "${data.coupon_code}" </b>. This offer is valid upto ${data.lastDate}.
                                              </multiline>
                                           </td>
                                        </tr>
                                        <tr>
                                           <td
                                              class="td"
                                              style="
                                              width: 650px;
                                              min-width: 650px;
                                              font-size: 0pt;
                                              line-height: 0pt;
                                              padding: 0;
                                              margin: 0;
                                              font-weight: normal;
                                              "
                                              >
                                              <table
                                                 width="100%"
                                                 border="0"
                                                 cellspacing="0"
                                                 cellpadding="0"
                                                 >
                                                 <tr>
                                                    <td align="center">
                                                       <table
                                                          class="center"
                                                          border="0"
                                                          cellspacing="0"
                                                          cellpadding="0"
                                                          style="text-align: center"
                                                          >
                                                          <tr>
                                                             <td
                                                                class="text-button blue-button"
                                                                style="
                                                                font-family: 'Lato', Arial, sans-serif;
                                                                font-size: 12px;
                                                                line-height: 16px;
                                                                text-align: left;
                                                                text-transform: uppercase;
                                                                padding: 10px 26px;
                                                                border-radius: 22px;
                                                                background: #17a5ff;
                                                                color: #ffffff;
                                                                "
                                                                >
                                                                <multiline
                                                                   ><a
                                                                   href="https://SGSRO .co.in/"
                                                                   target="_blank"
                                                                   class="link-white"
                                                                   style="
                                                                   color: #ffffff;
                                                                   text-decoration: none;
                                                                   "
                                                                   ><span
                                                                   class="link-white"
                                                                   style="
                                                                   color: #ffffff;
                                                                   text-decoration: none;
                                                                   "
                                                                   > Visit Now</span
                                                                   ></a
                                                                   ></multiline
                                                                   >
                                                             </td>
                                                          </tr>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </table>
                                           </td>
                                        </tr>
                                     </table>
                                  </td>
                               </tr>
                            </table>
                         </td>
                      </tr>
                   </table>
                   <!-- END Section 1 -->
                   <!-- Section 2 -->
                   <!-- END Section 2 -->
                   <!-- Section 3 -->
                </td>
             </tr>
          </table>
          <link
             href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
             rel="stylesheet"
             />
          <style>
             #EmailId {
             background: transparent;
             border: none;
             border-bottom: 1px solid #000000;
             outline: none;
             box-shadow: none;
             }
          </style>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script type="text/javascript">
             $(function () {
               $("a[class='UpdateModal']").click(function () {
                 $("#MyPopup").modal("show");
                 return false;
               });
             });
          </script>
          <script>
             //function myFunction() {
             //    //var x = document.getElementById("unsubtab");
             //    //if (x.style.display === "none") {
             
             //    //    x.style.display = "block";
             //    //} else {
             //    //    x.style.display = "none";
             //    //}
             
             //    $("#unsubtab").slideToggle();
             
             //}
             
             $("#submitbtn").click(function () {
               var EmailId = $("#EmailId").val();
               if (EmailId == "" || EmailId == null || EmailId == undefined) {
                 alert("Please Enter your registered Email Address");
                 $("#EmailId").focus();
               } else {
                 $.ajax({
                   type: "POST",
                   data: JSON.stringify({ EmailID: EmailId }),
                   url: "Admin/SntReporttoSubscribers.aspx/GetData",
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function (response) {
                     var fname = response.d;
                     alert("You have Unsubscribed Successfully..!!");
                   },
                   failure: function () {
                     alert(response.d);
                   },
                 });
               }
             });
          </script>
       </body>
    </html>`;
}