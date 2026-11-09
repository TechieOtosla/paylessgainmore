var RATE = 0.92; // 1 USD = 0.92 EUR (change as needed)
var PRODUCTS = {
  hardware: [
    ["Intel Core i7 Processor", "12-core desktop CPU, 4.9 GHz boost.", 389],
    ["16GB DDR5 RAM Kit", "2 x 8GB, 5600 MHz memory kit.", 74],
    ["1TB NVMe SSD", "PCIe 4.0 solid state drive, 7000 MB/s.", 89],
    ["RTX Graphics Card", "8GB GDDR6 card for gaming and design.", 449]
  ],
  software: [
    ["Operating System Pro", "64-bit OS with lifetime licence.", 139],
    ["Office Suite", "Word processor, spreadsheet, presentations.", 99],
    ["Antivirus 1-Year", "Real-time protection for 3 devices.", 39],
    ["Photo Editor", "Professional image editing software.", 59]
  ],
  electronics: [
    ["27-inch LED Monitor", "QHD display, 144 Hz refresh rate.", 279],
    ["Mechanical Keyboard", "Backlit keyboard with tactile switches.", 69],
    ["650W Power Supply", "80+ Gold certified modular PSU.", 84],
    ["Wireless Mouse", "Ergonomic 2.4 GHz mouse.", 25]
  ]
};
var TITLES = {hardware: "Hardware", software: "Software", electronics: "Electronics"};

function getCookie(name) {
  var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function requireUser() {
  var u = getCookie("username");
  if (!u) { location.href = "register.html"; return null; }
  document.getElementById("nav").innerHTML =
    '<a href="index.html">Home</a><a href="hardware.html">Hardware</a>' +
    '<a href="software.html">Software</a><a href="electronics.html">Electronics</a>' +
    '<a href="order.html">Order</a>';
  return u;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c];
  });
}
function price(usd) { return "$" + usd.toFixed(2) + " / \u20AC" + (usd * RATE).toFixed(2); }

function showCategory(cat) {
  var html = "<h1>" + TITLES[cat] + "</h1><div class='grid'>";
  PRODUCTS[cat].forEach(function (p) {
    html += "<div class='card'><h3>" + esc(p[0]) + "</h3><p class='mut'>" + esc(p[1]) +
      "</p><p class='price'>" + price(p[2]) + "</p>" +
      "<a class='btn' href='order.html?p=" + encodeURIComponent(p[0]) + "'>Order</a></div>";
  });
  document.getElementById("main").innerHTML = html + "</div>";
}

function showOrderForm() {
  var all = [], opts = "";
  Object.keys(PRODUCTS).forEach(function (c) {
    PRODUCTS[c].forEach(function (p) { all.push(p); });
  });
  all.forEach(function (p, i) { opts += "<option value='" + i + "'>" + esc(p[0]) + "</option>"; });
  document.getElementById("main").innerHTML =
    "<h1>Order Form</h1><div class='card'><label for='pr'>Product</label><select id='pr'>" + opts +
    "</select><label for='qt'>Quantity</label><input id='qt' type='number' min='1' value='1'>" +
    "<p class='price' id='tot'></p><button id='go'>Place Order</button></div>";
  var pre = new URLSearchParams(location.search).get("p");
  all.forEach(function (p, i) { if (p[0] === pre) document.getElementById("pr").value = i; });
  function total() {
    var q = parseInt(document.getElementById("qt").value, 10) || 0;
    document.getElementById("tot").textContent = "Total: " + price(all[document.getElementById("pr").value][2] * q);
  }
  document.getElementById("pr").onchange = total;
  document.getElementById("qt").oninput = total;
  total();
  document.getElementById("go").onclick = function () {
    var p = all[document.getElementById("pr").value];
    var q = parseInt(document.getElementById("qt").value, 10);
    if (!q || q < 1) { alert("Enter a quantity of 1 or more."); return; }
    var t = p[2] * q;
    var w = window.open("", "bill", "width=480,height=520");
    if (!w) { alert("Please allow pop-ups for this site."); return; }
    w.document.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Your Bill</title></head>" +
      "<body style='font-family:Arial;padding:20px'><h2>PayLessGainMore - Bill</h2>" +
      "<p>Customer: " + esc(getCookie("username")) + "<br>Date: " + new Date().toLocaleString() + "</p>" +
      "<table border='1' cellpadding='8' style='border-collapse:collapse'>" +
      "<tr><th>Item</th><th>Qty</th><th>Unit price</th></tr>" +
      "<tr><td>" + esc(p[0]) + "</td><td>" + q + "</td><td>" + price(p[2]) + "</td></tr></table>" +
      "<h3>Total: " + price(t) + "</h3><p>Thank you for shopping with us!</p></body></html>");
    w.document.close();
  };
}
