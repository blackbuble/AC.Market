var myApp = new Framework7({});

var $$ = Dom7;

// Select Template
var template = $$('#random-template').html();//all product asc
var temp = $$('#detail-template').html();//detail
var tempt = $$('#random-template-product').html(); //product asc
var tempti = $$('#random-template-product-z').html();// product desc
var temptz = $$('#random-template-harga').html();// product desc
var tempts = $$('#random-template-show').html();// product desc


// Compile and render
var compiledTemplate = Template7.compile(template);//all product asc
var compiledTemplate2 = Template7.compile(temp);//detail
var compiledTempt = Template7.compile(tempt);// product asc
var compiledTempti = Template7.compile(tempti);// product desc
var compiledTemptz = Template7.compile(temptz);// product desc
var compiledTempts = Template7.compile(tempts);// product desc


// Cart action
$$(document).on('click', '.cart', function () {
	$$('#ba-item-list').show();
	$$('#ba-item-list-empty').hide();
});

// Content Show
$$(document).on('click', '#content-show', function () {
	
	$("div[id^='price-tab-']").each(function() {
	var id = parseInt(this.id.replace("price-tab-", ""), 10);
	var priceTab = $$("#price-tab-" + id);
	
	// do format currency
		var oldPrice = priceTab.text();
		var newPrice = formatNumber(oldPrice);
		$$("#price-tab-" + id).text(newPrice);
});
	//$$('#ba-item-list-empty').hide();
});

// Detail action
$$(document).on('click', '.detail', function () {
	//alert( '#now-' + this.id);
	var bar = 'back-tab-' + (this.id);
	//alert (bar);
	$$('.third').attr('id', bar);
	$$('#now-' + this.id).removeClass('ba-none');
	var stringName = $$('#name-'+ this.id).text();
	//alert (stringName);
	var maxLength = 18;
	var trimmedString = stringName.substr(0, maxLength);
	$$('#name-'+ this.id).text(trimmedString);
	var priceDec = $$('#price-'+this.id).text();
	//alert (priceDec);
	var priceUpDate = formatNumber(priceDec);
	$$('#price-'+this.id).text(priceUpDate);
	$$('.ba-price-content-center').text(priceUpDate);
});


// Third navbar action
$$(document).on('click', '.third', function () {
	var thirdVal =(this.id);
	//alert (thirdVal);
	var newThirdVal = thirdVal.substr(9);
	//alert (newThirdVal);
	var newValThird = '#now-' + (newThirdVal);
	//alert (newValThird);
	$$(newValThird).addClass('ba-none');
});

$$(document).on('click', '.next', function () {
	var item = $$('.itemRow');
	//alert (item.length);
    if (item.length > 0) {
	$$('#ba-item-list').hide();
	$$('#ba-customer').show();
	} else {
        $$('#ba-item-list').hide();
    }
});



function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function trimedString () {
	var maxLength = 18;
	
}

// Defined as function "getrandom" price lowest first
function getrandom() {
  // Get JSON Data from UrbanDictionary API 
  $$.getJSON('http://belanja.accalls.com/products', function (json) {

    // Insert rendered template
    $$('#content-wrap').html(compiledTemplate(json))
    $$('#content-wraper').html(compiledTemplate2(json))
  });
};

// product lowest first
function getnameAsc() {
  // Get JSON Data from UrbanDictionary API 
  $$.getJSON('http://belanja.accalls.com/products-name-low', function (json) {

    // Insert rendered template
    $$('#content-wrap1').html(compiledTempt(json))
    
  });
};

//product highest first
function getnameDesc() {
  // Get JSON Data from UrbanDictionary API 
  $$.getJSON('http://belanja.accalls.com/products-name-high', function (json) {

    // Insert rendered template
    $$('#content-wrapz').html(compiledTempt(json))
    
  });
};

//name lowest first
function getmerkAsc() {
  // Get JSON Data from UrbanDictionary API 
  $$.getJSON('http://belanja.accalls.com/products-merk-low', function (json) {

    // Insert rendered template
    $$('#content-wrap2').html(compiledTempta(json))
    
  });
};

//show random 3 products
function getrandom3() {
  // Get JSON Data from UrbanDictionary API 
  $$.getJSON('http://belanja.accalls.com/products-show', function (json) {

    // Insert rendered template
    $$('#content-show3').html(compiledTempts(json))
    
  });
};





// Execute to list UrbanDictionary Definitions
getrandom();
getnameAsc();
getnameDesc();
getmerkAsc();
getrandom3();

// Select Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');

// On refresh
ptrContent.on('refresh', function (e) {
  // Emulate 1s loading
  setTimeout(function () {

    // Execute getrandom to get new Definitions
    getrandom();

    myApp.pullToRefreshDone();
  }, 1000);
});


