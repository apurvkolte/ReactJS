exports.enquiry = (name, message, email, mobile) => {
    return `<!DOCTYPE html>
   <html>
   <head>
       <title></title>
   </head>
   
   <body>
   
       <div width="100%" style="min-width:100%!important;margin:0!important;padding:0!important">
           <table cellpadding="0" cellspacing="0" style="border:0px;padding:0px;margin:0px;display:none;float:left">
               <tbody>
                   <tr>
                       <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                           <img src="$Logoimg1$">
                       </td>
                   </tr>
               </tbody>
           </table>
           <table cellpadding="0" cellspacing="0" border="0" style="display:none;float:left">
               <tbody>
                   <tr>
                       <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                           <a href="#" style="text-decoration:underline;color:#ffffff" target="_blank">
                               <img height="1" width="1" alt="" src="$Logoimg2$">
                           </a>
                       </td>
                   </tr>
               </tbody>
           </table>
           <table width="660" border="0" cellpadding="0" cellspacing="0" align="center">
               <tbody>
                   <tr>
                       <td width="100%" style="min-width:100%">
                           <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block">
                               <tbody>
                                   <tr>
                                       <td width="100%" align="center" style="display:block;text-align:center;vertical-align:top;font-size:16;min-width:100%;background-color:#edece6">
                                           <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important" bgcolor="#ffffff">
                                               <tbody>
                                                   <tr>
                                                       <td>&nbsp;</td>
                                                       <td width="100%" align="center" style="text-align:center;padding:20px 0px">
                                                           <a href="#" target="_blank"><img src='https://SGSRO .co.in/images/logo1.png' alt="Industry Cantral" height="150" width="150"></a>
                                                       </td>
                                                       <td>&nbsp;</td>
                                                   </tr>
                                               </tbody>
                                           </table>
                                           <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0">&nbsp;</div>
                                           <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block;min-width:100%;background-color:#edece6">
                                               <tbody>
                                                   <tr style="background-color:#1a263a">
                                                       <td>&nbsp;</td>
                                                       <td width="660" style="padding:20px 0px 20px 0px;text-align:center"><a href="#" style="text-decoration:none;font-size:25px;color:#ffffff" target="_blank">SGSRO </a></td>
                                                       <td>&nbsp;</td>
                                                   </tr>
                                                   <tr>
                                                       <td>&nbsp;</td>
                                                       <td valign="middle" align="left" width="100%" style="padding:0px 21px 0px 21px">&nbsp;</td>
                                                       <td>&nbsp;</td>
                                                   </tr>
                                                   <tr>
                                                       <td>&nbsp;</td>
                                                       <td width="100%">
                                                           <table cellpadding="0" cellspacing="0" border="0" align="center" style="border-bottom:2px solid #b8b8b8; width:90%" bgcolor="#ffffff">
                                                               <tbody>
                                                                   <tr>
                                                                       <td width="100%" align="left" valign="top" style="padding:10px;">
                                                                          
                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                                                   <tbody>
                                                                                       <tr height="40">
                                                                                           <td style="text-align:center;padding:0px 1px 1px 15px;font-size:14px;color:#333333;line-height:1.4!important;word-wrap:break-word" valign="top">
                                                                                               <p class="pdata" align="center" style="font-size: 16px; text-align: left;">
                                                                                                   Dear Sir,<br /><br />
                                                                                                   <a href="$WlcmFactsheet$" style="text-decoration:none;color:#333333;">Greetings from SGSRO  !</a><br />
                                                                                                   Users are sending a below response for inquiry and will get in touch with a reply shortly.
                                                                                               </p>
                                                                                               <!--<p class="pdata" align="center" style="font-size: 15px; text-align: center;">
                                                                                                   $message2$
                                                                                               </p>-->
                                                                                           </td>
                                                                                       </tr>
   
                                                                                       <tr border="0">
                                                                                     <!-- Client Information -->   
                                                                                           <table width="100%" height="105px" border="1" style="line-height:24px;border:1px solid #000;font-size:14px;color:#000;">
                                                                                              
                                                                                                   <tr>
                                                                                                       <td width="25%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>Cutomer Name</td>
                                                                                                       <td width="75%" style='border-top:none;border-right:none;padding-left:5px;'>${name}</td>
                                                                                                   </tr>
                                                                                                   <tr>
                                                                                                       <td width="25%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>Message</td>
                                                                                                       <td width="75%" style='border-top:none;border-right:none;padding-left:5px;'> ${message} </td>
                                                                                                   </tr>
                                                                                                   <tr>
                                                                                                       <td width="25%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>Email:</td>
                                                                                                       <td width="75%" style='border-top:none;border-right:none;padding-left:5px;'>${email}</td>
                                                                                                   </tr>
   
                                                                                                   <tr>
                                                                                                       <td width="25%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>Contact No.</td>
                                                                                                       <td width="75%" style='border-top:none;border-right:none;padding-left:5px;'>${mobile}</td>
                                                                                                   </tr>
   
                                                                                           </table>
                                                                                       </tr>
                                                                                   </tbody>
                                                                               </table>
                                                                           
                                                                       </td>
                                                                   </tr>
                                                               </tbody>
                                                           </table>
                                                           <br />
                                                       </td>
                                                       <td>&nbsp;</td>
                                                   </tr>
                                               </tbody>
                                           </table>
                                           <table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;line-height:1.5px" bgcolor="#d5d5d5">
                                               <tbody>
                                                   <tr>
                                                       <td></td>
                                                       <td>&nbsp;</td>
                                                       <td></td>
                                                   </tr>
                                               </tbody>
                                           </table>
   
                                           
                                           <br />
                                           <!--<table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important">
          <tbody>
              <tr>
                  <td style="background-color:#edece6; padding-top: 10px;">-->
                                           <center>
                                               <a href="https://api.whatsapp.com/send?phone=${mobile}&lang=en&text=Welcome to SGSRO !" target="_blank" style="text-decoration: none;">
                                                   <span class="" style="background-color:#ec6300;padding: 9px;color: white;border-radius: 3px;">Vist Now...!</span>
                                                   <br />
                                               </a>
                                           </center><br />
                                           <!--</td>
               </tr>
           </tbody>
       </table>-->
   
                                          
                                       </td>
                                   </tr>
                               </tbody>
                           </table>
                       </td>
                   </tr>
               </tbody>
           </table>
       </div>
   
   
   </body>
   
   </html>`;
}