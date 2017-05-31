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
		case 38:
			key.up=1;
			break;
		case 40:
			key.down=1;
			break;
		case 66:
			key.b=1;
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
		case 38:
			key.up=0;
			break;
		case 40:
			key.down=0;
			break;
		case 66:
			key.b=0;
			break;

	}
}
//--------------------------------------------------------------------------------------------------------------------------------

function onWheel(e) {
  e = e || window.event;
  var delta = e.deltaY || e.detail || e.wheelDelta;
  playerDistance+=delta/1000;
}

//math functions--------------------------------------------------------------------------------------------------------------------------------

function randomInterval(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normal(a,b,n)
{
	var s=0;
	for(var i=0; i<n; i++)
	{
		s+=randomInterval(a,b);
	}
	s=Math.round(s/n);
	return s;
}

function compare(a, b) 
{
  return b.distance - a.distance;
}

function inRad(num) {
	return num * Math.PI / 180;
	}
	
//--------------------------------------------------------------------------------------------------------------------------------
var screen=document.getElementById("screen");
var ctx = screen.getContext("2d");


//instructions--------------------------------------------------------------------------------------------------------------------------------
alert("Управление: \n Движение: w,a,s,d \n Поворот: leftkey, rightkey, upkey, downkey, мышка \n Прыжок:  space");

//--------------------------------------------------------------------------------------------------------------------------------
function checkWindow()
{
	screen.height = document.documentElement.clientHeight-4;
	screen.width = document.documentElement.clientWidth;
	cam.height=screen.height;
	cam.width=screen.width;
	//ctx.imageSmoothingEnabled = false;
}
//camera--------------------------------------------------------------------------------------------------------------------------------
var cam = {
	height: 1000,
	width: 1000,
	FOCUS: 500,
	x: 0,
	y: 98*1000,
	z: 0, distance: 20000,
	directionXZ: 0,
	directionZY: 0,
	points: [
		{x: 0, y: 0, z: 0},
		{x: 0, y: 1000, z: 0},
		{x: -1000, y: -500, z: -1000},
		{x: -1000, y: -500, z: 1000},
		{x: 1000, y: -500, z: -1000},
		{x: 1000, y: -500, z: 1000}
	],
	inBlock: function()
	{
		for(var i=0; i<this.points.length; i++)
		{
			if ( playerCell(this.x + this.points[i].x) < 0 || playerCell(this.y + this.points[i].y) < 0 || playerCell(this.z + this.points[i].z) < 0 || 
			     playerCell(this.x + this.points[i].x) > 99 || playerCell(this.y + this.points[i].y) > 99 || playerCell(this.z + this.points[i].z) > 99)
			return false;
				
			
			if ( blocks[playerCell(this.x + this.points[i].x)][playerCell(this.y + this.points[i].y)][playerCell(this.z + this.points[i].z)].value == 1)
				return true;
		}
		return false;
	},
	cell: function()
	{
		var x = Math.round(this.x/blockSize);
		var y = Math.round(this.y/blockSize);
		var z = Math.round(this.z/blockSize);
		return {x, y, z};
	}
};

//points
var points=[];
function setPoint(x,y,z)
{
	points.push({x: x, y: y, z: z});
}
//polygons--------------------------------------------------------------------------------------------------------------------------------
var polygons=[];
function setPolygon(x,y,z,x1,y1,z1,x2,y2,z2,color)
{
	polygons.push({
		point1: {x: x, y: y, z: z}, 
		point2: {x: x1, y: y1, z: z1}, 
		point3: {x: x2, y: y2, z: z2}, 
		color: color, 
		x: (x+x1+x2)/3, 
		y: (y+y1+y2)/3, 
		z: (z+z1+z2)/3,
		setDistance: function()
		{
			this.distance = Math.sqrt(
				(this.x-cam.x-cam.width/2)*(this.x-cam.x-cam.width/2)+
				(this.y-cam.y-cam.height/2)*(this.y-cam.y-cam.height/2)+
				(this.z-cam.z)*(this.z-cam.z)
			);
		}
	});
	
}

function drawPolygon(polygon)
{
	ctx.beginPath();
	ctx.moveTo(projection(polygon.point1).x, projection(polygon.point1).y);
	ctx.lineTo(projection(polygon.point2).x, projection(polygon.point2).y);
	ctx.lineTo(projection(polygon.point3).x, projection(polygon.point3).y);
	ctx.closePath();
	ctx.fillStyle = polygon.color;
	ctx.lineWidth=1;
	ctx.strokeStyle= polygon.color;
	ctx.fill();
	ctx.stroke();
}

var polygonsOrder=[];
function sortPolygons()
{
	polygonsOrder=[];
	for(var i=0; i<polygons.length; i++)
	{
		polygons[i].setDistance();
		if(polygons[i].distance<cam.distance)
		{
			polygonsOrder.push(i);
		}
	}
	var buffer;
	for(var i=0; i<polygonsOrder.length; i++)
	{
		for(var j=i+1; j<polygonsOrder.length; j++)
		{
			if(polygons[polygonsOrder[j]].distance>polygons[polygonsOrder[i]].distance)
			{
				buffer=polygonsOrder[j];
				polygonsOrder[j]=polygonsOrder[i];
				polygonsOrder[i]=buffer;
			}
		}
	}
}
//projection--------------------------------------------------------------------------------------------------------------------------------
function projection(point)
{
	cam.direction=cam.directionXZ%360;
	var directionXZ = inRad(cam.direction);
	var directionZY = inRad(cam.directionZY%360);
	var x = point.x-cam.x;
	var y = point.y-cam.y;
	var z = point.z-cam.z;
	var x1 = x*Math.cos(directionXZ)-z*Math.sin(directionXZ);
	var z1 = x*Math.sin(directionXZ)+z*Math.cos(directionXZ);
	x=x1;
	z=z1;
	
	z1 = z*Math.cos(directionZY)-y*Math.sin(directionZY);
	y1 = z*Math.sin(directionZY)+y*Math.cos(directionZY);
	z=z1;
	y=y1;
	
	var pX= ((cam.width/2 - x) * z) / (z + cam.FOCUS) + x;
	var pY= ((cam.height/2 - y) * z) / (z + cam.FOCUS) + y;
	if(z<0)return false;
	return {x: Math.round(pX), y: Math.round(pY)};
}

//--------------------------------------------------------------------------------------------------------------------------------

function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	startPointX = Math.round(startPointX);
	startPointY = Math.round(startPointY);
	endPointX = Math.round(endPointX);
	endPointY = Math.round(endPointY);
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	ctx.lineTo(endPointX, endPointY);
	ctx.stroke();
}

//mouse--------------------------------------------------------------------------------------------------------------------------------
var mouseX=0;
var mouseXprev=0;
var mouseY=0;
var mouseYprev=0;
var sensitivityXZ = 0.05;
var sensitivityZY = 0.05;
var mouseDown=0;

function mouseD()
{
	mouseX=event.pageX;
	mouseXprev=event.pageX;
	mouseY=event.pageY;
	mouseYprev=event.pageY;
}
function checkMouse()
{
	if(mouseDown==1)
	{
		mouseXprev=mouseX;
		mouseX=event.pageX;
		cam.directionXZ-=(mouseX-mouseXprev)*sensitivityXZ;
		
		mouseYprev=mouseY;
		mouseY=event.pageY;
		cam.directionZY+=(mouseY-mouseYprev)*sensitivityZY;
	}
}


sortPolygons();
//draw--------------------------------------------------------------------------------------------------------------------------------
function draw()
{
	ctx.save();
	ctx.globalAlpha = alphaInput.value;
	
	
	for(var i=0; i<polygons.length; i++)
	{
		polygons[i].setDistance();
	}
	//sortPolygons();
	polygons.sort(compare);
	ctx.clearRect(0,0,cam.width,cam.height);
	//for(var i=0; i<polygonsOrder.length; i++)
	for(var i=0; i<polygons.length; i++)
	{
		if(polygons[i].distance<cam.distance)
		drawPolygon(polygons[i]);
	}
	ctx.restore();
	ctx.fillStyle="black";
	ctx.font = "200% Arial";
	ctx.fillText(FPS,30,30);
}

//--------------------------------------------------------------------------------------------------------------------------------
var sX=300;
var sY=300;
var sZ=500;
var sStep = 20;
var choose=randomInterval(2,5);
var time=0;
//--------------------------------------------------------------------------------------------------------------------------------
var speed = 400;
var blockSize = 1000;

var FRAMES = 0;
var FPS=0;
function second()
{
	FPS=FRAMES;
	FRAMES=0;
}

//HTML objects
var alphaInput = document.getElementById("alpha");
var alphaText = document.getElementById("alphaValue");

var drawInput = document.getElementById("draw");
var drawText = document.getElementById("drawValue");

var modelInput = document.getElementById("model");
var modelText = document.getElementById("modelValue");

var speedInput = document.getElementById("speed");
var speedText = document.getElementById("speedValue");

var jumpInput = document.getElementById("jump");
var jumpText = document.getElementById("jumpValue");

//control--------------------------------------------------------------------------------------------------------------------------------
var jumpHeight = 2*blockSize;
function control()
{
	if(key.left)cam.directionXZ-=3;
	if(key.right)cam.directionXZ+=3;
	if(key.up)cam.directionZY+=1;
	if(key.down)cam.directionZY-=1;
	
	player.fX=0;
	player.fZ=0;
	
	var s = player.speed;
	if(key.w)
	{
		player.fX = Math.sin(inRad(cam.directionXZ)) * s;
		player.fZ = Math.cos(inRad(cam.directionXZ)) * s;
	}
	if(key.s)
	{
		player.fX = -Math.sin(inRad(cam.directionXZ)) * s;
		player.fZ = -Math.cos(inRad(cam.directionXZ)) * s;
	}
	if(key.a)
	{
		player.fX = Math.sin(inRad(cam.direction-90)) * s;
		player.fZ = Math.cos(inRad(cam.direction-90)) * s;
	}
	if(key.d)
	{
		player.fX = Math.sin(inRad(cam.direction+90)) * s;
		player.fZ = Math.cos(inRad(cam.direction+90)) * s;
	}
	if(key.b)
	{
		bomb(3);
	}
	
	

	
	
}

var k = 0;
var playerDistance = 2;

var time=0;
function step()
{
	
	//return player to map
	if(player.y>150*blockSize)
	{
		player.y = 0;
		player.x = randomInterval(5,95)*blockSize;
		player.z = randomInterval(5,95)*blockSize;
	}
	
	//HTML
	ctx.globalAlpha = alphaInput.value;
	alphaText.innerHTML = alphaInput.value;
	
	cam.distance = Number(drawInput.value) *blockSize;
	drawText.innerHTML = drawInput.value;
	
	modelDistance = Number(modelInput.value);
	modelText.innerHTML = modelInput.value;
	
	player.speed = Number(speedInput.value);
	speedText.innerHTML = speedInput.value;
	
	jumpHeight = Number(jumpInput.value) *blockSize;
	jumpText.innerHTML = jumpInput.value;
	
	/*if(time%(21-FPS)==0)
	{
		model();
	}*/	
	model();
	checkWindow();
	control();	
	player.move();
	
	/*cam.x = player.x-0*blockSize - playerDistance * blockSize * Math.sin(inRad(cam.directionXZ));
	cam.y = player.y-2*blockSize + playerDistance * blockSize * Math.sin(inRad(cam.directionZY));
	cam.z = player.z-0*blockSize - playerDistance * blockSize * Math.cos(inRad(cam.directionXZ));*/
	cam.x = player.x;
	cam.y = player.y- 2*blockSize;
	cam.z = player.z;
	for(var i = 0; i < playerDistance*blockSize; i++)
	{
		var c = cam.cell();
		if(!cam.inBlock())
		{
			cam.x +=  -  Math.sin(inRad(cam.directionXZ));
			cam.y +=  +  Math.sin(inRad(cam.directionZY));
			cam.z +=  -  Math.cos(inRad(cam.directionXZ));
		}
	}
	
	time++;
	FRAMES++;
	draw();
	
	time++;
}
//--------------------------------------------------------------------------------------------------------------------------------
setInterval(step,50);
setInterval(second,1000);


