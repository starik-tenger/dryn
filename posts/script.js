function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


var adress = "http://192.168.0.101:8000";

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();
xhr.withCredentials = false;

xhr.timeout = 30000;

var input = document.getElementById("p");
var p = document.getElementById("p1");

var id = 0;

xhr.onload = function() {
  //alert( this.responseText );
  p.innerHTML = decodeURI(this.responseText);
}

xhr.onerror = function() {
  alert( 'Ошибка ' + this.status );
}


function f()
{
	var adress1 = adress + "?" + input.value;
	xhr.open('GET', adress1, true);
	xhr.send();
	adress = "http://192.168.0.101:8000";
}

function f1()
{
	xhr.open('GET', adress + "?test", true);
	xhr.send();
}

setInterval(f1, 1000);