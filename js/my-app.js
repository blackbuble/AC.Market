var myApp = new Framework7({});

var $$ = Dom7;

// Select Template
var template = $$('#random-template').html();//all product asc
var temp = $$('#detail-template').html();//detail
var tempt = $$('#random-template-product').html(); //product asc
var tempti = $$('#random-template-product-z').html();// product desc
var temptz = $$('#random-template-harga').html();// product desc


// Compile and render
var compiledTemplate = Template7.compile(template);//all product asc
var compiledTemplate2 = Template7.compile(temp);//detail
var compiledTempt = Template7.compile(tempt);// product asc
var compiledTempti = Template7.compile(tempti);// product desc
var compiledTemptz = Template7.compile(temptz);// product desc





// Cart action
$$(document).on('click', '.cart', function () {
	//alert(this.id);
	//$$('#output').show();
	//$$('#output').html(function(i, val) { return val*1+1 });
	$$('#ba-item-list').show();
	$$('#ba-item-list-empty').hide();
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
	var item = $$('.itemContainer');
	alert (item.length);
    if (item.length > 0) {
	$$('#ba-item-list').hide();
	$$('#ba-customer').show();
	} else {
        $$('#ba-item-list').hide();
    }
});

function cartCheck (){
	var item = $$('#output').text();
	var itemQty = document.getElementById('output'), itemQtyVal = parseInt(itemQty);
	//alert (itemQtyVal);
    if (item.length > 0) {
        $$('#ba-item-list').show();
    } else {
        $$('#ba-item-list').hide();
		$$('#ba-customer').hide();
    }
	
}

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





// Execute to list UrbanDictionary Definitions
getrandom();
getnameAsc();
getnameDesc();
getmerkAsc();
cartCheck();

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


