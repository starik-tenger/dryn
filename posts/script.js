var adress = "http://192.168.0.101:8000";

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();
xhr.withCredentials = false;

var input = document.getElementById("p");
var p = document.getElementById("p1");



xhr.onload = function() {
  //alert( this.responseText );
  p.innerHTML = this.responseText;
}

xhr.onerror = function() {
  alert( 'Ошибка ' + this.status );
}

function f()
{
	adress = adress + "?" + input.value;
	xhr.open('GET', adress, true);
	xhr.send();
	adress = "http://192.168.0.101:8000";
}