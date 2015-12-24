<?php
// setting currency symbol
// id_ID are Indonesian code
setlocale(LC_MONETARY,"id_ID");
/* ========================================= Section Send Email to Customer =============================================*/
$to = $_POST['email'];
$nama = $_POST['name'];
$alamat = $_POST['alamat'];
$kota = $_POST['kota'];
$phone = $_POST['phone'];

// seed random number generator 
srand((double)microtime()*10000); 

function gen_id() 
{ 
    $id = 'DEP'; 

    for ($i=1; $i<=5; $i++) { 
        if (rand(0,1)) { 
            // letter 
            $id .= chr(rand(65, 90)); 
        } else { 
            // number; 
            $id .= rand(0, 9); 
        } 
    } 
    return $id; 

} 

$newID = gen_id(); // Invoice number 
$waktu = date('d-M-y'); // Date
$copy = date('Y');

$subject = 'Order - ' . $newID; //subject that appear on customer, ex. Order - DEPXL1F2
$content = $_POST;


// body email
$body ='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice Email</title>
  <!-- Designed by https://github.com/kaytcat -->
  <!-- Header image designed by Freepik.com -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css">	

  <style type="text/css">
  /* Take care of image borders and formatting */

  img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
  a img { border: none; }
  table { border-collapse: collapse !important; }
  #outlook a { padding:0; }
  .ReadMsgBody { width: 100%; }
  .ExternalClass {width:100%;}
  .backgroundTable {margin:0 auto; padding:0; width:100% !important;}
  table td {border-collapse: collapse;}
  .ExternalClass * {line-height: 115%;}


  /* General styling */

  td {
    font-family: Arial, sans-serif;
    color: #6f6f6f;
  }

  body {
    -webkit-font-smoothing:antialiased;
    -webkit-text-size-adjust:none;
    width: 100%;
    height: 100%;
    color: #6f6f6f;
    font-weight: 400;
    font-size: 18px;
  }


  h1 {
    margin: 10px 0;
  }

  a {
    color: #27aa90;
    text-decoration: none;
  }

  .force-full-width {
    width: 100% !important;
  }

  .force-width-80 {
    width: 80% !important;
  }


  .body-padding {
    padding: 0 75px;
  }

  .mobile-align {
    text-align: right;
  }



  </style>

  <style type="text/css" media="screen">
      @media screen {
        @import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,900);
        /* Thanks Outlook 2013! http://goo.gl/XLxpyl */
       
        .w280 {
          width: 280px !important;
        }

      }
  </style>

  <style type="text/css" media="only screen and (max-width: 480px)">
    /* Mobile styles */
    @media only screen and (max-width: 480px) {

      table[class*="w320"] {
        width: 320px !important;
      }

      td[class*="w320"] {
        width: 280px !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      img[class*="w320"] {
        width: 250px !important;
        height: 67px !important;
      }

      td[class*="mobile-spacing"] {
        padding-top: 10px !important;
        padding-bottom: 10px !important;
      }

      *[class*="mobile-hide"] {
        display: none !important;
      }

      *[class*="mobile-br"] {
        font-size: 12px !important;
      }

      td[class*="mobile-w20"] {
        width: 20px !important;
      }

      img[class*="mobile-w20"] {
        width: 20px !important;
      }

      td[class*="mobile-center"] {
        text-align: center !important;
      }

      table[class*="w100p"] {
        width: 100% !important;
      }

      td[class*="activate-now"] {
        padding-right: 0 !important;
        padding-top: 20px !important;
      }

      td[class*="mobile-block"] {
        display: block !important;
      }

      td[class*="mobile-align"] {
        text-align: left !important;
      }

    }
  </style>
</head>
<body  offset="0" class="body" style="padding:0; margin:0; display:block; background:#eeebeb; -webkit-text-size-adjust:none" bgcolor="#eeebeb">
<table align="center" cellpadding="0" cellspacing="0" width="100%" height="100%">
  <tr>
    <td align="center" valign="top" style="background-color:#eeebeb" width="100%">

    <center>

      <table cellspacing="0" cellpadding="0" width="600" class="w320">
        <tr>
          <td align="center" valign="top">


          <table style="margin:0 auto;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td style="text-align: center;">
                <a href="#"><img class="w320" width="250" height="83" src="http://accalls.com/images/logo.png" alt="Belanja AC" ></a>
              </td>
            </tr>
          </table>


          <table cellspacing="0" cellpadding="0" class="force-full-width" style="background-color:#3bcdb0;">
            <tr>
              <td style="background-color:#30C3B9;">

                <table cellspacing="0" cellpadding="0" class="force-full-width">
                  <tr>
                    <td style="font-size:40px; font-weight: 600; color: #ffffff; text-align:center;" class="mobile-spacing">
                    <div class="mobile-br">&nbsp;</div>
                      Terima kasih <br>telah berbelanja <br>di AC CALLS
                    <br>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:24px; text-align:center; padding: 0 75px; color:#6f6f6f;" class="w320 mobile-spacing">
                     Berikut adalah tagihan keranjang belanja anda.
                    </td>
                  </tr>
                </table>

                <table cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    <td>
                      <img src="http://pentagram-it.com/demo4/img/belanjaac.png" style="max-width:100%; display:block;">
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

          <table cellspacing="0" cellpadding="0" class="force-full-width" bgcolor="#ffffff" width="100%">
            <tr>
              <td style="background-color:#ffffff; padding-top: 15px;">

              <center>
                <table style="margin:0 auto;" cellspacing="0" cellpadding="0" class="force-width-80" width="80%">
                  <tr>
                    <td style="text-align:left;">
                    <br>
                      <b>'. $nama .'</b> <br>
                      '. $alamat .'<br>
                      '. $kota .' <br>
                      '. $phone .'
                    </td>
                    <td style="text-align:right; vertical-align:top;">
                    <br>
                      <b>Invoice: '.  $newID .'</b> <br>
                    '. $waktu .'
                    
                    </td>
                  </tr>
                </table>
				
				
				<table style="margin:0 auto;" cellspacing="0" cellpadding="0" class="force-width-80" width="80%">
                  <tr>
                    <td class="mobile-block" >
                    <br>

                      <table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
                        <tr>
                          <th style="border-bottom:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                            Item
                          </th>
						  <th style="border-bottom:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                            Qty
                          </th>
						  <th style="border-bottom:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                            Harga
                          </th><th style="border-bottom:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                            Total
                          </th>
                        </tr>';
				
		


 
//magic section begin here ^_^, loop all order and print it
for($i=1; $i < $content['itemCount'] + 1; $i++) {
$name = 'item_name_'.$i;
$quantity = 'item_quantity_'.$i;
$price = 'item_price_'.$i;
$total = $content[$quantity]*$content[$price];
$grandTotal += $total; 
//$body .= 'Order #'.$i.': '.$content[$name].' --- Qty x '.$content[$quantity].' --- Unit Price $'.$content[$price]."\n";

//}		 
$body 				.= '<tr>
                          <td style="text-align: left;">
                           '.$content[$name].'
                          </td>
						  <td style="text-align: left;">
                          '.$content[$quantity].'
                          </td>
						  <td style="text-align: left;">
                           '. money_format("%.2n",$content[$price]).'
                          </td>
						  <td style="text-align: left;">
                             '. money_format("%.2n",$total) .'
                          </td>
                        </tr>';
}
						
$body				.= '<tr>
						  <td style="border-bottom:1px solid #e3e3e3;border-top:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                           
                          </td>
						  <td style="border-bottom:1px solid #e3e3e3;border-top:1px solid #e3e3e3; font-weight: bold; text-align: left;">
                           
                          </td>
						  <td style="border-bottom:1px solid #e3e3e3;border-top:1px solid #e3e3e3; font-weight: bold; text-align:left;" class="mobile-align">
                           Grand Total
                          </td>
						  
						  <td style="border-bottom:1px solid #e3e3e3;border-top:1px solid #e3e3e3; font-weight: bold; text-align:left;" class="mobile-align">
                           '.  money_format("%.2n",$grandTotal) .'
                          </td>
						  
						</tr>
						
                      </table>
                    </td>
                    
                    
					
					
                  </tr>
                </table>';


 $body          .='<table style="margin: 0 auto;" cellspacing="0" cellpadding="0" class="force-width-80" width="80%">
                  <tr>
                    <td style="text-align: left;">
                    <br>
                      Pembayaran invoice dapat dilakukan melalui transfer bank dengan nomor rekening sebagai berikut :
					  
					  
					     <table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
                        <tr>
                          <td class="mobile-block">
								<table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
								<tbody><tr>
								  <td>
									<img src="http://accalls.com/images/bca.jpg" width="90" height="80">
								  </td>
								</tr>
								
							  </tbody>
							  </table>
                              
                          </td>
                        </tr>
                        <tr>
                          <td class="mobile-block">
								<table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
								<tbody><tr>
								  <td style="    font-size: 14px;padding-bottom: 10px;font-weight: bold;">
									204-006-2524 A.n Mustapa
								  </td>
								</tr>
								
							  </tbody>
							  </table>
                          </td>
                        </tr>
                      </table>
                      <p>Bila anda mengalami kesulitan dalam bertransaksi, silahkan hubungi hotline kami di nomor +6221 - 29910331 atau melalui email <a href="mailto:belanja@accalls.com">belanja@accalls.com</a> <br><br>
                      </p>
					  <p align="right">Terimakasih, <br>
                      AC Calls</p>
					  <br>
					  <br>
					  
						 <table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
                        <tbody><tr>
                          <td class="mobile-block">
								<table cellspacing="0" cellpadding="0" class="force-full-width" width="100%">
								<tbody><tr>
								  <td style="text-align:center;">
									<img src="http://accalls.com/images/delivery.png" width="60" height="50"> <p style="font-size:12px;">Free Delivery</p>
								  </td>
								  <td style="text-align:center;">
									<img src="http://accalls.com/images/cuci.png" width="60" height="50"> <p style="font-size:12px;">Free Cuci <br/><small>3x dalam 1 tahun</small></p>
								  </td>
								  <td style="text-align:center;">
									<img src="http://accalls.com/images/freon.png" width="60" height="50"> <p style="font-size:12px;">Free Freon <br/><small>1 tahun</small></p>
								  </td>
								  <td style="text-align:center;">
									<img src="http://accalls.com/images/pipa.png" width="60" height="50"> <p style="font-size:12px;">Free Pipa <br/><small>5 meter</small></p>
								  </td>
								</tr>
								
							  </tbody>
							  </table>
                              
                          </td>
                        </tr>
                        <tr>
                         
                        </tr>
                      </tbody></table>
					  
                    </td>
                  </tr>
                </table>
              </center>

             


              <table cellspacing="0" cellpadding="0" bgcolor="#363636"  class="force-full-width" width="100%">
                <tr>
                  <td style="background-color:#363636; text-align:center;">
                  <br>
                  <br>

					<ul style="list-style:none;margin:10px 10px auto;padding:10px;">
							<li style=" display: inline;  padding: 14px 16px;"><a href="https://www.facebook.com/accalls"><img src="http://accalls.com/images/facebook.png"></a></li>
							<li style=" display: inline;  padding: 14px 16px;"><a href="#"><img src="http://accalls.com/images/plus.png"></a></li>
							<li style=" display: inline;  padding: 14px 16px;"><a href="https://twitter.com/AC_CALLS"><img src="http://accalls.com/images/twitter.png"></a></li>
							
					</ul>
				  
                  <br>
                  <br>
                  </td>
                </tr>
                <tr>
                  <td style="color:#f0f0f0; font-size: 14px; text-align:center; padding-bottom:4px;">
                    &copy; '. $copy .' All Rights Reserved
                  </td>
                </tr>
                <tr>
                  <td style="color:#27aa90 !important; font-size: 14px; text-align:center;">
                    <a href="www.accalls.com">PT. AC Calls Wahana Indonesia</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;">
                    &nbsp;
                  </td>
                </tr>
              </table>

              </td>
            </tr>
          </table>







          </td>
        </tr>
      </table>

    </center>




    </td>
  </tr>
</table>
</body>
</html>

';

//header email
$headers = 'From: AC Calls Indonesia<belanja@accalls.com>'."\r\n".
'Reply-To: AC Calls Indonesia <belanja@accalls.com>' . "\r\n" .
'MIME-Version: 1.0' . "\r\n" .
'Content-Type: text/html; charset=ISO-8859-1' . "\r\n" .
'X-Mailer: PHP/' . phpversion();
//email sending
mail($to, $subject, $body, $headers);

/* ====================================== End Section Send Email Customer ==============================================*/

/* ============================================= Send Email to Admin ===================================================*/
$to2 = 'belanja@accalls.com';
$subject2 = 'Order dari ' . $nama . '- Invoice #' . $newID ;

$content2 = $_POST;

$body2 = '';
for($i=1; $i < $content2['itemCount'] + 1; $i++) {
$name2 = 'item_name_'.$i;
$quantity2 = 'item_quantity_'.$i;
$price2 = 'item_price_'.$i;
$body2 .= 'Order #'.$i.': '.$content[$name].' --- Qty x '.$content[$quantity].' --- Unit Price Rp'.$content[$price]."\n";

}

$headers2 = 'From: '. $nama .' <'.$to.'> '."\r\n".
'Reply-To: '. $nama .' <'.$to.'> ' . "\r\n" .
'MIME-Version: 1.0' . "\r\n" .
'Content-Type: text/html; charset=ISO-8859-1' . "\r\n" .
'X-Mailer: PHP/' . phpversion();
mail($to2, $subject2, $body, $headers2);

/* ====================================== End Section Send Email Customer ==============================================*/



Header('Location: http://pentagram-it.com/demo4/success.html');


?>