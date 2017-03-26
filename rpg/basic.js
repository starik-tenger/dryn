window.addEventListener('keydown',this.keydown,false);
window.addEventListener('keyup',this.keyup,false);

var key = {};
key.w = 13;

var mouseX=0;
var mouseY=0;


function inRad(num) {
	return num * Math.PI / 180;
	}
	
function randomInterval(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkMouse()
{
	mouseX = event.pageX;
	mouseY = event.pageY;
}

function distance(x,y,x1,y1)
{
	var a = x-x1;
	var b = y-y1;
	return Math.sqrt(a*a+b*b);
}

function rotation(x,y,x1,y1)
{
	var a = x-x1;
	var b = y-y1;
	var c =  Math.sqrt(a*a+b*b);
	if(c>0)
	{
		return Math.asin(b/c);
	}else
	{
		return -Math.asin(b/c);
	}
}

function onWheel(e) {
  e = e || window.event;
  var delta = e.deltaY || e.detail || e.wheelDelta;
  cam.scale+=delta/2;
}

function keydown(e)
{
	switch(e.keyCode)
	{
		case 87:
			key.w=1;
			break;
		case 16:
			key.shift=1;
			break;
	}
}

function keyup(e)
{
	switch(e.keyCode)
	{
		case 87:
			key.w=0;
			break;
		case 16:
			key.shift=0;
			break;
	}
}