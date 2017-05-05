function onWheel(e) {
  e = e || window.event;
  var delta = e.deltaY || e.detail || e.wheelDelta;
  cam.FOCUS+=delta/20;
}

function random(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}
var screen=document.getElementById("screen");
var ctx = screen.getContext("2d");

var cam = {height: 1000, width: 1000, FOCUS: 300};
var points=[];
function setPoint(x,y,z)
{
	points.push({x: x, y: y, z: z});
}

function projection(n)
{
	var point = points[n];
	var pX= ((cam.width/2 - point.x) * point.z) / (point.z + cam.FOCUS) + point.x;
	var pY= ((cam.height/2 - point.y) * point.z) / (point.z + cam.FOCUS) + point.y;
	return {x: pX, y: pY};
}

function randomInterval(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*setPoint(0,0,1000);//1
setPoint(0,1000,1000);//2
setPoint(1000,1000,1000);//3
setPoint(1000,0,1000);//4
setPoint(0,0,1000);
setPoint(0,0,500);//1
setPoint(0,1000,500);//2
	setPoint(0,1000,1000);
	setPoint(0,1000,500);
setPoint(1000,1000,500);//3
	setPoint(1000,1000,1000);
	setPoint(1000,1000,500);
setPoint(1000,0,500);//4
	setPoint(1000,0,1000);
	setPoint(1000,0,500);
setPoint(0,0,500);*/

for(var i=0; i<1; i++)
{
	setPoint(500,500,500);
}

function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	ctx.lineTo(endPointX, endPointY);
	ctx.stroke();
}

function draw()
{
	ctx.clearRect(0,0,1000,1000);
	//ctx.beginPath();
	//ctx.moveTo(projection(0).x, projection(0).y);
	var prevX = projection(0).x;
	var prevY = projection(0).y;
	for(var i=0; i<points.length; i++)
	{
		//ctx.lineWidth = points[i].z/100;
		//ctx.lineTo(projection(i).x, projection(i).y);
		var color = points[i].z/10;
		ctx.strokeStyle="rgb("+color+","+color+","+color+")";
		drawLine(prevX, prevY, projection(i).x, projection(i).y, 2);
		prevX = projection(i).x;
		prevY = projection(i).y;
		//ctx.fillRect(projection(i).x, projection(i).y,10,10);
	}
}

draw();

var sX=500;
var sY=500;
var sZ=1000;
var sStep = 20;
var choose=randomInterval(0,5);
var time=0;
function step()
{

	setPoint(sX,sY,sZ);
	if(time%10==0)
	{
		choose=randomInterval(0,5);
	}
	//points.splice(0,1);
	switch(choose)
	{
		case 0:
			sX+=sStep;
			break;
		case 1:
			sX-=sStep;
			break;
		case 2:
			sY+=sStep;
			break;
		case 3:
			sY-=sStep;
			break;
		case 4:
			sZ+=sStep;
			break;
		case 5:
			sZ-=sStep;
			break;
	}
	time++;
	draw();
}

setInterval(step,20);


