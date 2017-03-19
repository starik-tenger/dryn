function inRad(num) {
	return num * Math.PI / 180;
	}
	
function randomInterval(max, min)
{
	return Math.round(Math.random() * (max - min) + min);
}

function checkMouse()
{
	mouseX = event.pageX;
	mouseY = event.pageY;
}

function onWheel(e) {
  e = e || window.event;
  var delta = e.deltaY || e.detail || e.wheelDelta;
  cam.scale+=delta/2;
}