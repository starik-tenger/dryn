//key events
window.addEventListener('keydown',this.keydown,false);
window.addEventListener('keyup',this.keyup,false);

var key={};
function keydown(e)
{
	switch(e.keyCode)
	{
		case 87:
			key.w=1;
			break;
		case 65:
			key.a=1;
			break;
		case 83:
			key.s=1;
			break;
		case 68:
			key.d=1;
			break;
			
		case 16:
			key.shift=1;
			break;
		case 32:
			key.space=1;
			break;
		case 69:
			key.e=1;
			break;
		case 37:
			key.left=1;
			break;
		case 39:
			key.right=1;
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
		case 65:
			key.a=0;
			break;
		case 83:
			key.s=0;
			break;
		case 68:
			key.d=0;
			break;
			
		case 16:
			key.shift=0;
			break;
		case 32:
			key.space=0;
			break;
		case 69:
			key.e=0;
			break;
		case 37:
			key.left=0;
			break;
		case 39:
			key.right=0;
			break;
	}
}
//--------------------------------------------------------------------------------------------------------------------------------

function onWheel(e) {
  e = e || window.event;
  var delta = e.deltaY || e.detail || e.wheelDelta;
  cam.FOCUS+=delta/20;
}

//--------------------------------------------------------------------------------------------------------------------------------

function random(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}
//--------------------------------------------------------------------------------------------------------------------------------
var screen=document.getElementById("screen");
var ctx = screen.getContext("2d");

var cam = {height: 1000, width: 1000, FOCUS: 500, x: 1666, y: 1666, z: 0};
var points=[];
function setPoint(x,y,z)
{
	points.push({x: x, y: y, z: z});
}
//--------------------------------------------------------------------------------------------------------------------------------
function projection(n)
{
	var point = points[n];
	var x = point.x-cam.x;
	var y = point.y-cam.y;
	var z = point.z-cam.z;
	var pX= ((cam.width/2 - x) * z) / (z + cam.FOCUS) + x;
	var pY= ((cam.height/2 - y) * z) / (z + cam.FOCUS) + y;
	return {x: pX, y: pY};
}
//--------------------------------------------------------------------------------------------------------------------------------
function randomInterval(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//--------------------------------------------------------------------------------------------------------------------------------
function setSquare()
{
setPoint(0,0,1000);//1
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
setPoint(0,0,500);
}

function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	ctx.lineTo(endPointX, endPointY);
	ctx.stroke();
}

//--------------------------------------------------------------------------------------------------------------------------------

function draw()
{
	ctx.fillRect(0,0,1000,1000);
	ctx.strokeStyle="white";
	//ctx.beginPath();
	//ctx.moveTo(projection(0).x, projection(0).y);
	prevX = projection(0).x;
	prevY = projection(0).y;
	for(var i=0; i<points.length-0; i++)
	{
		//ctx.lineWidth = points[i].z/100;
		//ctx.lineTo(projection(i).x, projectokion(i).y);
		var color = points[i].z/10;
		var point=points[i];
		//ctx.strokeStyle="rgb("+color+","+color+","+color+")";
		if(points[i].z>cam.z && points[i].z-cam.z<50000){
		drawLine(prevX, prevY, projection(i).x, projection(i).y, 2);
		//drawCube(point.x,point.y,point.z,1000);
		}
		prevX = projection(i).x;
		prevY = projection(i).y;
		//ctx.fillRect(projection(i).x, projection(i).y,10,10);
	}
}

//--------------------------------------------------------------------------------------------------------------------------------
setSquare();
//--------------------------------------------------------------------------------------------------------------------------------
for(var i=0; i<666; i++)
{
	setSquare();
	var d=randomInterval(500,1000);
	var d1=randomInterval(-100,100);
	var d2=randomInterval(-100,100);
	for(var j=0; j<points.length; j++)
	{
		points[j].z+=d;
		points[j].x+=d1;
		points[j].y+=d2;
	}
}
//--------------------------------------------------------------------------------------------------------------------------------
var sX=300;
var sY=300;
var sZ=500;
var sStep = 20;
var choose=randomInterval(2,5);
var time=0;
//--------------------------------------------------------------------------------------------------------------------------------
var speed = 50;
function step()
{

	//setPoint(sX,sY,sZ);
	if(time%100==0)
	{
		choose=randomInterval(2,5);
		//setSquare();
	}
	//points.splice(0,1);
	
	if(key.w)cam.z+=speed;
	if(key.s)cam.z-=speed;
	if(key.a)cam.x-=speed;
	if(key.d)cam.x+=speed;
	if(key.shift)cam.y+=speed;
	if(key.space)cam.y-=speed;
	
	time++;
	//cam.FOCUS-=2;
	draw();
}
//--------------------------------------------------------------------------------------------------------------------------------
setInterval(step,50);


