function error(a) {
    try {
        console.log(a)
    } catch (b) {}
}
function eraseCookie(a) {
    createCookie(a, "", -1)
}
function readCookie(a) {
    var b = a + "=";
    var c = document.cookie.split(";");
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        while (e.charAt(0) == " ") e = e.substring(1, e.length);
        if (e.indexOf(b) === 0) {
            var f = unescape(e.substring(b.length, e.length));
            return f.replace(/\~/g, "=")
        }
    }
    return null
}
function createCookie(a, b, c) {
    if (c) {
        var d = new Date;
        d.setTime(d.getTime() + c * 24 * 60 * 60 * 1e3);
        var e = "; expires=" + d.toGMTString()
    } else var e = "";
    b = b.replace(/\=/g, "~");
    document.cookie = a + "=" + escape(b) + e + "; path=/"
}
function ShelfItem() {
    this.id = "s" + simpleCart.nextId++
}
function Shelf() {
    this.items = {}
}
function CartItem() {
    while (simpleCart.items["c" + simpleCart.nextId]) simpleCart.nextId++;
    this.id = "c" + simpleCart.nextId
}
function Cart() {
    var a = this;
    a.nextId = 1;
    a.Version = "2.2.2";
    a.Shelf = null;
    a.items = {};
    a.isLoaded = false;
    a.pageIsReady = false;
    a.quantity = 0;
    a.total = 0;
    a.taxRate = 0;
    a.taxCost = 0;
    a.shippingFlatRate = 0;
    a.shippingTotalRate = 0;
    a.shippingQuantityRate = 0;
    a.shippingRate = 0;
    a.shippingCost = 0;
    a.currency = USD;
    a.checkoutTo = PayPal;
    a.email = "";
    a.merchantId = "";
    a.successUrl = null;
    a.cancelUrl = null;
    a.cookieDuration = 30;
    a.storagePrefix = "sc_";
    a.MAX_COOKIE_SIZE = 4e3;
    a.cartHeaders = ["Name", "Price", "Quantity", "Total"];
    a.events = {};
    a.sandbox = false;
    a.paypalHTTPMethod = "GET";
    a.businessName = "";
    a.add = function (a) {
        var b = this;
        if (!b.pageIsReady) {
            b.initializeView();
            b.update()
        }
        if (!b.isLoaded) {
            b.load();
            b.update()
        }
        var c = new CartItem;
        if (!arguments || arguments.length === 0) {
            error("No values passed for item.");
            return null
        }
        var d = arguments;
        if (a && typeof a !== "string" && typeof a !== "number") {
            d = a
        }
        c.parseValuesFromArray(d);
        c.checkQuantityAndPrice();
        if (b.trigger("beforeAdd", [c]) === false) {
            return false
        }
        var e = true;
        if (b.hasItem(c)) {
            var f = b.hasItem(c);
            f.quantity = parseInt(f.quantity, 10) + parseInt(c.quantity, 10);
            c = f;
            e = false
        } else {
            b.items[c.id] = c
        }
        b.update();
        b.trigger("afterAdd", [c, e]);
        return c
    };
    a.remove = function (b) {
        var c = {};
        a.each(function (a) {
            if (a.id !== b) {
                c[a.id] = a
            }
        });
        this.items = c
    };
    a.empty = function () {
        a.items = {};
        a.update()
    };
    a.find = function (b) {
        if (!b) {
            return null
        }
        var c = [];
        a.each(function (d, e, f) {
            fits = true;
            a.each(b, function (a, b, c) {
                if (!d[c] || d[c] != a) {
                    fits = false
                }
            });
            if (fits) {
                c.push(d)
            }
        });
        return c.length === 0 ? null : c
    };
    a.each = function (b, c) {
        var d, e = 0,
            f;
        if (typeof b === "function") {
            var g = b;
            h = a.items
        } else if (typeof c === "function") {
            var g = c,
                h = b
        } else {
            return
        }
        for (d in h) {
            if (typeof h[d] !== "function") {
                f = g.call(a, h[d], e, d);
                if (f === false) {
                    return
                }
                e++
            }
        }
    };
    a.chunk = function (a, b) {
        if (typeof b === "undefined") {
            b = 2
        }
        var c = a.match(RegExp(".{1," + b + "}", "g"));
        return c || []
    };
    a.checkout = function () {
        if (a.quantity === 0) {
            error("Cart is empty");
            return
        }
        switch (a.checkoutTo) {
            case PayPal:
                a.paypalCheckout();
                break;
            case GoogleCheckout:
                a.googleCheckout();
                break;
            case Email:
                a.emailCheckout();
                break;
            default:
                a.customCheckout();
                break
        }
    };
    a.paypalCheckout = function () {
        var b = document.createElement("form"),
            c = 1,
            d, e, f;
        b.style.display = "none";
        b.method = a.paypalHTTPMethod == "GET" || a.paypalHTTPMethod == "POST" ? a.paypalHTTPMethod : "GET";
        b.action = a.sandbox ? "https://www.sandbox.paypal.com/cgi-bin/webscr" : "https://www.paypal.com/cgi-bin/webscr";
        b.acceptCharset = "utf-8";
        b.appendChild(a.createHiddenElement("cmd", "_cart"));
        b.appendChild(a.createHiddenElement("rm", a.paypalHTTPMethod == "POST" ? "2" : "0"));
        b.appendChild(a.createHiddenElement("upload", "1"));
        b.appendChild(a.createHiddenElement("business", a.email));
        b.appendChild(a.createHiddenElement("currency_code", a.currency));
        if (a.taxRate) {
            b.appendChild(a.createHiddenElement("tax_cart", a.taxCost))
        }
        if (a.shipping() !== 0) {
            b.appendChild(a.createHiddenElement("handling_cart", a.shippingCost))
        }
        if (a.successUrl) {
            b.appendChild(a.createHiddenElement("return", a.successUrl))
        }
        if (a.cancelUrl) {
            b.appendChild(a.createHiddenElement("cancel_return", a.cancelUrl))
        }
        a.each(function (d, e) {
            c = e + 1;
            b.appendChild(a.createHiddenElement("item_name_" + c, d.name));
            b.appendChild(a.createHiddenElement("quantity_" + c, d.quantity));
            b.appendChild(a.createHiddenElement("amount_" + c, d.price));
            b.appendChild(a.createHiddenElement("item_number_" + c, c));
            var f = 0;
            a.each(d, function (d, e, g) {
                if (g !== "id" && g !== "price" && g !== "quantity" && g !== "name" && g !== "shipping" && f < 10) {
                    b.appendChild(a.createHiddenElement("on" + f + "_" + c, g));
                    b.appendChild(a.createHiddenElement("os" + f + "_" + c, d));
                    f++
                }
            });
            b.appendChild(a.createHiddenElement("option_index_" + c, f))
        });
        document.body.appendChild(b);
        b.submit();
        document.body.removeChild(b)
    };
    a.googleCheckout = function () {
        var a = this;
        if (a.currency !== USD && a.currency !== GBP) {
            error("Google Checkout only allows the USD and GBP for currency.");
            return
        } else if (a.merchantId === "" || a.merchantId === null || !a.merchantId) {
            error("No merchant Id for google checkout supplied.");
            return
        }
        var b = document.createElement("form"),
            c = 1,
            d, e, f;
        b.style.display = "none";
        b.method = "POST";
        b.action = "https://checkout.google.com/api/checkout/v2/checkoutForm/Merchant/" + a.merchantId;
        b.acceptCharset = "utf-8";
        a.each(function (d, e) {
            c = e + 1;
            b.appendChild(a.createHiddenElement("item_name_" + c, d.name));
            b.appendChild(a.createHiddenElement("item_quantity_" + c, d.quantity));
            b.appendChild(a.createHiddenElement("item_price_" + c, d.price));
            b.appendChild(a.createHiddenElement("item_currency_" + c, a.currency));
            b.appendChild(a.createHiddenElement("item_tax_rate_" + c, a.taxRate));
            b.appendChild(a.createHiddenElement("_charset_", ""));
            f = "";
            a.each(d, function (a, b, c) {
                if (c !== "id" && c !== "quantity" && c !== "price") {
                    f = f + ", " + c + ": " + a
                }
            });
            f = f.substring(1);
            b.appendChild(a.createHiddenElement("item_description_" + c, f))
        });
        if (a.shipping() !== 0) {
            b.appendChild(a.createHiddenElement("ship_method_name_1", "Shipping"));
            b.appendChild(a.createHiddenElement("ship_method_price_1", parseFloat(a.shippingCost).toFixed(2)));
            b.appendChild(a.createHiddenElement("ship_method_currency_1", a.currency))
        }
        document.body.appendChild(b);
        b.submit();
        document.body.removeChild(b)
    };
    a.emailCheckout = function () {
        var b = prompt("Masukkan alamat email anda untuk invoice order: ");
        itemsString = "";
        esubtotal = 0;
        etotal = 0;
        for (var c in this.items) {
            var d = this.items[c];
            esubtotal = Math.round(d.quantity * d.price * 100) / 100;
            itemsString += d.quantity + " x " + d.name + " - " + d.quantity + " x RP " + d.price + " = RP " + String(esubtotal) + "<br>";
            etotal += esubtotal
        }
        etotal = Math.round(etotal * 100) / 100;
        itemsString += "<br>Total: RP " + String(etotal);
        var e = document.createElement("form");
        e.style.display = "none";
        e.method = "POST";
        e.action = "http://accalls.com/android/sendcart.php";
        e.acceptCharset = "utf-8";
        e.appendChild(a.createHiddenElement("jcitems", itemsString));
        e.appendChild(a.createHiddenElement("jcremite", b));
        e.appendChild(a.createHiddenElement("business", this.email));
        e.appendChild(a.createHiddenElement("isiInvoice", this.isiInvoice));
        e.appendChild(a.createHiddenElement("catatanTambahanInvoice", this.catatanTambahanInvoice));
        e.appendChild(a.createHiddenElement("formatsmsKonfirmasi", this.formatsmsKonfirmasi));
        e.appendChild(a.createHiddenElement("urlWebsite", this.urlWebsite));
        e.appendChild(a.createHiddenElement("alamatLengkap", this.alamatLengkap));
        e.appendChild(a.createHiddenElement("noHP", this.noHP));
        e.appendChild(a.createHiddenElement("urlFacebook", this.urlFacebook));
        e.appendChild(a.createHiddenElement("urlTwitter", this.urlTwitter));
        e.appendChild(a.createHiddenElement("akunMandiri", this.akunMandiri));
        e.appendChild(a.createHiddenElement("norekMandiri", this.norekMandiri));
        e.appendChild(a.createHiddenElement("akunBCA", this.akunBCA));
        e.appendChild(a.createHiddenElement("norekBCA", this.norekBCA));
        e.appendChild(a.createHiddenElement("akunBNI", this.akunBNI));
        e.appendChild(a.createHiddenElement("norekBNI", this.norekBNI));
        e.appendChild(a.createHiddenElement("akunBRI", this.akunBRI));
        e.appendChild(a.createHiddenElement("norekBRI", this.norekBRI));
        e.appendChild(a.createHiddenElement("akunBanklain1", this.akunBanklain1));
        e.appendChild(a.createHiddenElement("akunBanklain2", this.akunBanklain2));
        e.appendChild(a.createHiddenElement("businessName", this.businessName));
        document.body.appendChild(e);
        e.submit();
        document.body.removeChild(e);
        return
    };
    a.customCheckout = function () {
        return
    };
    a.load = function () {
        var a = this,
            b;
        a.items = {};
        a.total = 0;
        a.quantity = 0;
        if (readCookie(simpleCart.storagePrefix + "simpleCart_" + "chunks")) {
            var c = 1 * readCookie(simpleCart.storagePrefix + "simpleCart_" + "chunks"),
                d = [],
                e = "",
                f = "",
                g, h, i = 0;
            if (c > 0) {
                for (i = 0; i < c; i++) {
                    d.push(readCookie(simpleCart.storagePrefix + "simpleCart_" + (1 + i)))
                }
                e = unescape(d.join(""));
                f = e.split("++")
            }
            for (var j = 0, k = f.length; j < k; j++) {
                g = f[j].split("||");
                h = new CartItem;
                if (h.parseValuesFromArray(g)) {
                    h.checkQuantityAndPrice();
                    a.items[h.id] = h
                }
            }
        }
        a.isLoaded = true
    };
    a.save = function () {
        var b = "",
            c = [],
            d = 0;
        d = 1 * readCookie(simpleCart.storagePrefix + "simpleCart_" + "chunks");
        for (var e = 0; e < d; e++) {
            eraseCookie(simpleCart.storagePrefix + "simpleCart_" + e)
        }
        eraseCookie(simpleCart.storagePrefix + "simpleCart_" + "chunks");
        a.each(function (a) {
            b = b + "++" + a.print()
        });
        c = simpleCart.chunk(b.substring(2), simpleCart.MAX_COOKIE_SIZE);
        for (var f = 0, g = c.length; f < g; f++) {
            createCookie(simpleCart.storagePrefix + "simpleCart_" + (1 + f), c[f], a.cookieDuration)
        }
        createCookie(simpleCart.storagePrefix + "simpleCart_" + "chunks", "" + c.length, a.cookieDuration)
    };
    a.initializeView = function () {
        var a = this;
        a.totalOutlets = getElementsByClassName("simpleCart_total");
        a.quantityOutlets = getElementsByClassName("simpleCart_quantity");
        a.cartDivs = getElementsByClassName("simpleCart_items");
        a.taxCostOutlets = getElementsByClassName("simpleCart_taxCost");
        a.taxRateOutlets = getElementsByClassName("simpleCart_taxRate");
        a.shippingCostOutlets = getElementsByClassName("simpleCart_shippingCost");
        a.finalTotalOutlets = getElementsByClassName("simpleCart_finalTotal");
        a.addEventToArray(getElementsByClassName("simpleCart_checkout"), simpleCart.checkout, "click");
        a.addEventToArray(getElementsByClassName("simpleCart_empty"), simpleCart.empty, "click");
        a.Shelf = new Shelf;
        a.Shelf.readPage();
        a.pageIsReady = true
    };
    a.updateView = function () {
        a.updateViewTotals();
        if (a.cartDivs && a.cartDivs.length > 0) {
            a.updateCartView()
        }
    };
    a.updateViewTotals = function () {
        var b = [
            ["quantity", "none"],
            ["total", "currency"],
            ["shippingCost", "currency"],
            ["taxCost", "currency"],
            ["taxRate", "percentage"],
            ["finalTotal", "currency"]
        ];
        for (var c = 0, d = b.length; c < d; c++) {
            var e = b[c][0] + "Outlets",
                f, g;
            for (var h = 0, i = a[e].length; h < i; h++) {
                switch (b[c][1]) {
                    case "none":
                        f = "" + a[b[c][0]];
                        break;
                    case "currency":
                        f = a.valueToCurrencyString(a[b[c][0]]);
                        break;
                    case "percentage":
                        f = a.valueToPercentageString(a[b[c][0]]);
                        break;
                    default:
                        f = "" + a[b[c][0]];
                        break
                }
                a[e][h].innerHTML = "" + f
            }
        }
    };
    a.updateCartView = function () {
        var b = [],
            c, d, e, f, g, h, i, j, k;
        d = document.createElement("div");
        for (var c = 0, l = a.cartHeaders.length; c < l; c++) {
            g = document.createElement("div");
            k = a.cartHeaders[c].split("_");
            g.innerHTML = a.print(k[0]);
            g.className = "item" + k[0];
            for (var m = 1, n = k.length; m < n; m++) {
                if (k[m].toLowerCase() == "noheader") {
                    g.style.display = "none"
                }
            }
            d.appendChild(g)
        }
        d.className = "cartHeaders";
        b[0] = d;
        a.each(function (c, e) {
            d = document.createElement("div");
            for (var f = 0, j = a.cartHeaders.length; f < j; f++) {
                g = document.createElement("div");
                h = a.cartHeaders[f].split("_");
                i = a.createCartRow(h, c, i);
                g.innerHTML = i;
                g.className = "item" + h[0];
                d.appendChild(g)
            }
            d.className = "itemContainer";
            b[e + 1] = d
        });
        for (var o = 0, p = a.cartDivs.length; o < p; o++) {
            var q = a.cartDivs[o];
            if (q.childNodes && q.appendChild) {
                while (q.childNodes[0]) {
                    q.removeChild(q.childNodes[0])
                }
                for (var r = 0, s = b.length; r < s; r++) {
                    q.appendChild(b[r])
                }
            }
        }
    };
    a.createCartRow = function (b, c, d) {
        switch (b[0].toLowerCase()) {
            case "total":
                d = a.valueToCurrencyString(parseFloat(c.price) * parseInt(c.quantity, 10));
                break;
            case "increment":
                d = a.valueToLink("+", "javascript:;", "onclick=\"simpleCart.items['" + c.id + "'].increment();\"");
                break;
            case "decrement":
                d = a.valueToLink("-", "javascript:;", "onclick=\"simpleCart.items['" + c.id + "'].decrement();\"");
                break;
            case "remove":
                d = a.valueToLink("Remover", "javascript:;", "onclick=\"simpleCart.items['" + c.id + "'].remove();\"");
                break;
            case "price":
                d = a.valueToCurrencyString(c[b[0].toLowerCase()] ? c[b[0].toLowerCase()] : " ");
                break;
            default:
                d = c[b[0].toLowerCase()] ? typeof c[b[0].toLowerCase()] === "function" ? c[b[0].toLowerCase()].call(c) : c[b[0].toLowerCase()] : " ";
                break
        }
        for (var e = 1, f = b.length; e < f; e++) {
            option = b[e].toLowerCase();
            switch (option) {
                case "image":
                case "img":
                    d = a.valueToImageString(d);
                    break;
                case "input":
                    d = a.valueToTextInput(d, "onchange=\"simpleCart.items['" + c.id + "'].set('" + b[0].toLowerCase() + "' , this.value);\"");
                    break;
                case "div":
                case "span":
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "p":
                    d = a.valueToElement(option, d, "");
                    break;
                case "noheader":
                    break;
                default:
                    error("unkown header option: " + option);
                    break
            }
        }
        return d
    };
    a.addEventToArray = function (a, b, c) {
        var d, e;
        for (var f = 0, g = a.length; f < g; f++) {
            e = a[f];
            if (e.addEventListener) {
                e.addEventListener(c, b, false)
            } else if (e.attachEvent) {
                e.attachEvent("on" + c, b)
            }
        }
    };
    a.createHiddenElement = function (a, b) {
        var c = document.createElement("input");
        c.type = "hidden";
        c.name = a;
        c.value = b;
        return c
    };
    a.bind = function (b, c) {
        if (typeof c !== "function") {
            return a
        }
        if (a.events[b] === true) {
            c.apply(a)
        } else if (typeof a.events[b] !== "undefined") {
            a.events[b].push(c)
        } else {
            a.events[b] = [c]
        }
        return a
    };
    a.trigger = function (b, c) {
        var d = true;
        if (typeof a.events[b] !== "undefined" && typeof a.events[b][0] === "function") {
            for (var e = 0, f = a.events[b].length; e < f; e++) {
                d = a.events[b][e].apply(a, c ? c : [])
            }
        }
        if (d === false) {
            return false
        } else {
            return true
        }
    };
    a.ready = function (b) {
        if (!b) {
            a.trigger("ready");
            a.events["ready"] = true
        } else {
            a.bind("ready", b)
        }
        return a
    };
    a.currencySymbol = function () {
        switch (a.currency) {
            case CHF:
                return "CHF ";
            case CZK:
                return "CZK ";
            case DKK:
                return "DKK ";
            case HUF:
                return "HUF ";
            case NOK:
                return "NOK ";
            case PLN:
                return "PLN ";
            case SEK:
                return "SEK ";
            case JPY:
                return "¥";
            case EUR:
                return "€";
            case GBP:
                return "£";
            case CHF:
                return "CHF ";
            case IDR:
                return "Rp ";
            case USD:
            case CAD:
            case AUD:
            case NZD:
            case HKD:
            case SGD:
                return "Rp";
            default:
                return ""
        }
    };
    a.currencyStringForPaypalCheckout = function (b) {
        if (a.currencySymbol() == "&#36;") {
            return "$" + parseFloat(b).toFixed(2)
        } else {
            return "" + parseFloat(b).toFixed(2)
        }
    };
    a.valueToCurrencyString = function (b) {
        var c = parseFloat(b);
        if (isNaN(c)) c = 0;
        return c.toCurrency(a.currencySymbol())
    };
    a.valueToPercentageString = function (a) {
        return parseFloat(100 * a) + "%"
    };
    a.valueToImageString = function (a) {
        if (a.match(/<\s*img.*src\=/)) {
            return a
        } else {
            return '<img src="' + a + '" />'
        }
    };
    a.valueToTextInput = function (a, b) {
        return '<input type="text" value="' + a + '" ' + b + " />"
    };
    a.valueToLink = function (a, b, c) {
        return '<a href="' + b + '" ' + c + " >" + a + "</a>"
    };
    a.valueToElement = function (a, b, c) {
        return "<" + a + " " + c + " > " + b + "</" + a + ">"
    };
    a.hasItem = function (b) {
        var c, d, e, f = false;
        a.each(function (c) {
            d = true;
            a.each(b, function (a, e, f) {
                if (f !== "quantity" && f !== "id" && b[f] !== c[f]) {
                    d = false
                }
            });
            if (d) {
                f = c
            }
        });
        return f
    };
    a.ln = {
        en_us: {
            quantity: "Quantity",
            price: "Price",
            total: "Total",
            decrement: "Decrement",
            increment: "Increment",
            remove: "Remove",
            tax: "Tax",
            shipping: "Shipping",
            image: "Image"
        }
    };
    a.language = "en_us";
    a.print = function (a) {
        var b = this;
        return b.ln[b.language] && b.ln[b.language][a.toLowerCase()] ? b.ln[b.language][a.toLowerCase()] : a
    };
    a.update = function () {
        if (!simpleCart.isLoaded) {
            simpleCart.load()
        }
        if (!simpleCart.pageIsReady) {
            simpleCart.initializeView()
        }
        a.updateTotals();
        a.updateView();
        a.save()
    };
    a.updateTotals = function () {
        a.total = 0;
        a.quantity = 0;
        a.each(function (b) {
            if (b.quantity < 1) {
                b.remove()
            } else if (b.quantity !== null && b.quantity !== "undefined") {
                a.quantity = parseInt(a.quantity, 10) + parseInt(b.quantity, 10)
            }
            if (b.price) {
                a.total = parseFloat(a.total) + parseInt(b.quantity, 10) * parseFloat(b.price)
            }
        });
        a.shippingCost = a.shipping();
        a.taxCost = parseFloat(a.total) * a.taxRate;
        a.finalTotal = a.shippingCost + a.taxCost + a.total
    };
    a.shipping = function () {
        if (parseInt(a.quantity, 10) === 0) return 0;
        var b = parseFloat(a.shippingFlatRate) + parseFloat(a.shippingTotalRate) * parseFloat(a.total) + parseFloat(a.shippingQuantityRate) * parseInt(a.quantity, 10),
            c;
        a.each(function (a) {
            if (a.shipping) {
                if (typeof a.shipping == "function") {
                    b += parseFloat(a.shipping())
                } else {
                    b += parseFloat(a.shipping)
                }
            }
        });
        return b
    };
    a.initialize = function () {
        a.initializeView();
        a.load();
        a.update();
        a.ready()
    }
}
var Custom = "Custom",
    GoogleCheckout = "GoogleCheckout",
    PayPal = "PayPal",
    Email = "Email",
    AustralianDollar = "AUD",
    AUD = "AUD",
    CanadianDollar = "CAD",
    CAD = "CAD",
    CzechKoruna = "CZK",
    CZK = "CZK",
    DanishKrone = "DKK",
    DKK = "DKK",
    Euro = "EUR",
    EUR = "EUR",
    HongKongDollar = "HKD",
    HKD = "HKD",
    HungarianForint = "HUF",
    HUF = "HUF",
    IsraeliNewSheqel = "ILS",
    ILS = "ILS",
    JapaneseYen = "JPY",
    JPY = "JPY",
    MexicanPeso = "MXN",
    MXN = "MXN",
    NorwegianKrone = "NOK",
    NOK = "NOK",
    NewZealandDollar = "NZD",
    NZD = "NZD",
    PolishZloty = "PLN",
    PLN = "PLN",
    PoundSterling = "GBP",
    GBP = "GBP",
    SingaporeDollar = "SGD",
    SGD = "SGD",
    SwedishKrona = "SEK",
    SEK = "SEK",
    SwissFranc = "CHF",
    CHF = "CHF",
    Rupiah = "Rp",
    IDR = "Rp",
    USDollar = "USD",
    USD = "USD";
CartItem.prototype = {
    set: function (a, b) {
        a = a.toLowerCase();
        if (typeof this[a] !== "function" && a !== "id") {
            b = "" + b;
            if (a == "quantity") {
                b = b.replace(/[^(\d|\.)]*/gi, "");
                b = b.replace(/,*/gi, "");
                b = parseInt(b, 10)
            } else if (a == "price") {
                b = b.replace(/[^(\d|\.)]*/gi, "");
                b = b.replace(/,*/gi, "");
                b = parseFloat(b)
            }
            if (typeof b == "number" && isNaN(b)) {
                error("Improperly formatted input.")
            } else {
                if (typeof b === "string") {
                    if (b.match(/\~|\=/)) {
                        error("Special character ~ or = not allowed: " + b)
                    }
                    b = b.replace(/\~|\=/g, "")
                }
                this[a] = b;
                this.checkQuantityAndPrice()
            }
        } else {
            error("Cannot change " + a + ", this is a reserved field.")
        }
        simpleCart.update()
    },
    increment: function () {
        this.quantity = parseInt(this.quantity, 10) + 1;
        simpleCart.update()
    },
    decrement: function () {
        if (parseInt(this.quantity, 10) < 2) {
            this.remove()
        } else {
            this.quantity = parseInt(this.quantity, 10) - 1;
            simpleCart.update()
        }
    },
    print: function () {
        var a = "",
            b;
        simpleCart.each(this, function (b, c, d) {
            a += escape(d) + "=" + escape(b) + "||"
        });
        return a.substring(0, a.length - 2)
    },
    checkQuantityAndPrice: function () {
        if (!this.quantity || this.quantity == null || this.quantity == "undefined") {
            this.quantity = 1;
            error("No quantity for item.")
        } else {
            this.quantity = ("" + this.quantity).replace(/,*/gi, "");
            this.quantity = parseInt(("" + this.quantity).replace(/[^(\d|\.)]*/gi, ""), 10);
            if (isNaN(this.quantity)) {
                error("Quantity is not a number.");
                this.quantity = 1
            }
        }
        if (!this.price || this.price == null || this.price == "undefined") {
            this.price = 0;
            error("No price for item or price not properly formatted.")
        } else {
            this.price = ("" + this.price).replace(/,*/gi, "");
            this.price = parseFloat(("" + this.price).replace(/[^(\d|\.)]*/gi, ""));
            if (isNaN(this.price)) {
                error("Price is not a number.");
                this.price = 0
            }
        }
    },
    parseValuesFromArray: function (a) {
        if (a && a.length && a.length > 0) {
            for (var b = 0, c = a.length; b < c; b++) {
                a[b] = a[b].replace(/\|\|/g, "| |");
                a[b] = a[b].replace(/\+\+/g, "+ +");
                if (a[b].match(/\~/)) {
                    error("Special character ~ not allowed: " + a[b])
                }
                a[b] = a[b].replace(/\~/g, "");
                var d = a[b].split("=");
                if (d.length > 1) {
                    if (d.length > 2) {
                        for (var e = 2, f = d.length; e < f; e++) {
                            d[1] = d[1] + "=" + d[e]
                        }
                    }
                    this[unescape(d[0]).toLowerCase()] = unescape(d[1])
                }
            }
            return true
        } else {
            return false
        }
    },
    remove: function () {
        simpleCart.remove(this.id);
        simpleCart.update()
    }
};
Shelf.prototype = {
    readPage: function () {
        this.items = {};
        var a = getElementsByClassName("simpleCart_shelfItem"),
            b;
        me = this;
        for (var c = 0, d = a.length; c < d; c++) {
            b = new ShelfItem;
            me.checkChildren(a[c], b);
            me.items[b.id] = b
        }
    },
    checkChildren: function (a, b) {
        if (!a.childNodes) return;
        for (var c = 0; a.childNodes[c]; c++) {
            var d = a.childNodes[c];
            if (d.className && d.className.match(/item_[^ ]+/)) {
                var e = /item_[^ ]+/.exec(d.className)[0].split("_");
                if (e[1] == "add" || e[1] == "Add") {
                    var f = [];
                    f.push(d);
                    var g = simpleCart.Shelf.addToCart(b.id);
                    simpleCart.addEventToArray(f, g, "click");
                    d.id = b.id
                } else {
                    b[e[1]] = d
                }
            }
            if (d.childNodes[0]) {
                this.checkChildren(d, b)
            }
        }
    },
    empty: function () {
        this.items = {}
    },
    addToCart: function (a) {
        return function () {
            if (simpleCart.Shelf.items[a]) {
                simpleCart.Shelf.items[a].addToCart()
            } else {
                error("Shelf item with id of " + a + " does not exist.")
            }
        }
    }
};
ShelfItem.prototype = {
    remove: function () {
        simpleCart.Shelf.items[this.id] = null
    },
    addToCart: function () {
        var a = [],
            b, c;
        for (c in this) {
            if (typeof this[c] !== "function" && c !== "id") {
                b = "";
                switch (c) {
                    case "price":
                        if (this[c].value) {
                            b = this[c].value
                        } else if (this[c].innerHTML) {
                            b = this[c].innerHTML
                        }
                        b = b.replace(/[^(\d|\.)]*/gi, "");
                        b = b.replace(/,*/, "");
                        break;
                    case "image":
                        b = this[c].src;
                        break;
                    default:
                        if (this[c].value) {
                            b = this[c].value
                        } else if (this[c].innerHTML) {
                            b = this[c].innerHTML
                        } else if (this[c].src) {
                            b = this[c].src
                        } else {
                            b = this[c]
                        }
                        break
                }
                a.push(c + "=" + b)
            }
        }
        simpleCart.add(a)
    }
};
var getElementsByClassName = function (a, b, c) {
    if (document.getElementsByClassName) {
        getElementsByClassName = function (a, b, c) {
            c = c || document;
            var d = c.getElementsByClassName(a),
                e = b ? new RegExp("\\b" + b + "\\b", "i") : null,
                f = [],
                g;
            for (var h = 0, i = d.length; h < i; h += 1) {
                g = d[h];
                if (!e || e.test(g.nodeName)) {
                    f.push(g)
                }
            }
            return f
        }
    } else if (document.evaluate) {
        getElementsByClassName = function (a, b, c) {
            b = b || "*";
            c = c || document;
            var d = a.split(" "),
                e = "",
                f = "http://www.w3.org/1999/xhtml",
                g = document.documentElement.namespaceURI === f ? f : null,
                h = [],
                i, j;
            for (var k = 0, l = d.length; k < l; k += 1) {
                e += "[contains(concat(' ', @class, ' '), ' " + d[k] + " ')]"
            }
            try {
                i = document.evaluate(".//" + b + e, c, g, 0, null)
            } catch (m) {
                i = document.evaluate(".//" + b + e, c, null, 0, null)
            }
            while (j = i.iterateNext()) {
                h.push(j)
            }
            return h
        }
    } else {
        getElementsByClassName = function (a, b, c) {
            b = b || "*";
            c = c || document;
            var d = a.split(" "),
                e = [],
                f = b === "*" && c.all ? c.all : c.getElementsByTagName(b),
                g, h = [],
                i;
            for (var j = 0, k = d.length; j < k; j += 1) {
                e.push(new RegExp("(^|\\s)" + d[j] + "(\\s|$)"))
            }
            for (var l = 0, m = f.length; l < m; l += 1) {
                g = f[l];
                i = false;
                for (var n = 0, o = e.length; n < o; n += 1) {
                    i = e[n].test(g.className);
                    if (!i) {
                        break
                    }
                }
                if (i) {
                    h.push(g)
                }
            }
            return h
        }
    }
    return getElementsByClassName(a, b, c)
};
String.prototype.reverse = function () {
    return this.split("").reverse().join("")
};
Number.prototype.withCommas = function () {
    var a = 6,
        b = parseFloat(this).toFixed(2).toString().reverse();
    while (a < b.length) {
        b = b.substring(0, a) + "," + b.substring(a);
        a += 4
    }
    return b.reverse()
};
Number.prototype.toCurrency = function () {
    return (arguments[0] ? arguments[0] : "$") + this.withCommas()
};
var simpleCart = new Cart;
if (typeof jQuery !== "undefined") $(document).ready(function () {
    simpleCart.initialize()
});
else if (typeof Prototype !== "undefined") Event.observe(window, "load", function () {
    simpleCart.initialize()
});
else window.onload = simpleCart.initialize