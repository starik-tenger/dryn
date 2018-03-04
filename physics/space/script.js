window.addEventListener('keydown',this.check,false);
function check(e)                                    
{
	
	if(e.keyCode == 13){
		document.getElementById("x").value = cam.cursorX;
		document.getElementById("y").value = cam.cursorY;
	}
	if(e.keyCode == 32){
		state = !state;
	}
}

var helpText = "Enter - указать координаты объекта на карте\nSpace  - пауза \nНаправление объекта указывается в градусах \nПоложение и масштаб регулируется с помощью мыши";

var screen=document.getElementById("screen");
var ctx=screen.getContext("2d");
screen.width = screen.height = 800;

var screenB=document.getElementById("background");
var ctxB=screenB.getContext("2d");
screenB.width = screenB.height = 800;

var screenG=document.getElementById("graphic");
var ctxG=screenG.getContext("2d");
screenG.width = screenG.height = 400;

var output=document.getElementById("text");

var state = true;
var wayLength = 100;

ctx.clearRect(0,0,1000,1000);
var G=1;
var dt=0.000001;
var objects=[];

class Camera{
	constructor(x, y, scale){
		this.x = x;
		this.y = y;
		this.xFixed = this.x;
		this.yFixed = this.y;
		this.scale = scale;
		this.mouse = 0;
		this.cursorX = 0;
		this.cursorY = 0
	}
	mouseDown(){
		ctxB.clearRect(0,0,1000,1000);
		this.mouseFixedX = event.pageX;
		this.mouseFixedY = event.pageY;
		this.xFixed = this.x;
		this.yFixed = this.y;
		this.mouse = 1;
		
	}
	mouseUp(){
		ctxB.clearRect(0,0,1000,1000);
		this.mouse = 0;
	}
	checkMouse(){
		if(this.mouse){
			this.x = this.xFixed + (this.mouseFixedX-event.pageX)/this.scale;
			this.y = this.yFixed + (this.mouseFixedY-event.pageY)/this.scale;
		}
		this.cursorX = (event.pageX-400)/this.scale+this.x;
		this.cursorY = (event.pageY-400)/this.scale+this.y;;
		document.getElementById("cursorX").innerHTML = this.cursorX;
		document.getElementById("cursorY").innerHTML = this.cursorY;
	}
	onWheel(e) {
		//ctxB.clearRect(0,0,1000,1000);
		e = e || window.event;
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(this.scale - (delta/10000) >0)
			this.scale -= (delta/10000);
		//this.x += (this.scale)/200;
		//this.y += (this.scale)/200;
	}
}

var cam = new Camera(500,500,0.5);



class Object{
	constructor(x, y, m, sX, sY, color){
		this.x = x;
		this.y = y;
		this.xPrev = x;
		this.yPrev = y;
		this.m = m;
		this.fX = 0;
		this.fY = 0;
		this.sX = sX;
		this.sY = sY;
		this.color = color;
		this.index = 0;
		this.radius = Math.sqrt(Math.sqrt(this.m/800));
		this.way = [];
	}
	
	calculate(n){
		this.index = n;
		this.radius = (Math.sqrt(this.m/800000)*1);
		this.fX = 0;
		this.fY = 0;
		
		for(var i=0; i<objects.length; i++){
			var object = objects[i];
			var dx = object.x-this.x;
			var dy = object.y-this.y;
			var r = Math.sqrt(dx*dx + dy*dy);
			//text.innerHTML = r;
			if(r > 0){
			
			var m1 = this.m;
			var m2 = object.m;
			var sin  = dy/r;
			var cos = dx/r;
			var f = G*(m1*m2)/(r*r);
			//text.innerHTML = f;
			
			this.fX += f*cos;
			this.fY += f*sin;
			}
		}
		this.sX += this.fX/this.m * dt;
		this.sY += this.fY/this.m *dt;
		
	}
	
	move(){
		
		this.x += this.sX*dt;
		this.y += this.sY*dt;
	}
	
	save(){
		this.xPrev = this.x;
		this.yPrev = this.y;
		this.way.push({x: this.xPrev, y: this.yPrev});
		
	}
	
	join(){
		for(var i=0; i<objects.length; i++){
			var object = objects[i];
			var dx = object.x-this.x;
			var dy = object.y-this.y;
			var r = Math.sqrt(dx*dx + dy*dy);
			if(object != this && r<(this.radius+object.radius)){
				console.log("Join!", object.fX, object.fY)
				this.sX = (object.sX *object.m + this.sX *this.m)/(this.m+object.m);
				this.sY = (object.sY *object.m + this.sY *this.m)/(this.m+object.m);
				this.x = (this.x*this.m + object.x*object.m)/(this.m+object.m);
				this.y = (this.y*this.m + object.y*object.m)/(this.m+object.m);
				this.m += object.m;
				objects.splice(i, 1);
			}
		}
	}
	
	impulse(){
		return {x: this.sX*this.m, y: this.sY*this.m};
		
	}
	
	draw(){
		ctx.beginPath();
		var r = 1+this.radius;
		ctx.arc((this.x-cam.x)*cam.scale+400, (this.y-cam.y)*cam.scale+400, r*cam.scale, 0, 2*Math.PI, 0);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	
}

function setObject(x, y, m, speed, direction, color){
	var a = inRad(direction);
	var sX = speed*Math.cos(a);
	var sY = speed*Math.sin(a);
	objects.push(new Object(x, y, m, sX, sY, color));
}


function pif(a, b)
{
    return Math.sqrt(a*a+b*b);
}

function inRad(n){
    return n*Math.PI/180;
}

function random(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normal(a,b,n)
{
	var s=0;
	for(var i=0; i<n; i++)
	{
		s+=random(a,b);
	}
	s=Math.round(s/n);
	return s;
}

function drawWay()
{
	ctxB.clearRect(0,0,800,800);
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		ctxB.beginPath();
		var x = object.x;
		var y = object.y;
		
		while(object.way.length>wayLength){
			object.way.splice(0, 1);
		}
		
		//c.moveTo((x-cam.x)*cam.scale+400, (y-cam.y)*cam.scale+400);
		for(var j=0; j<object.way.length; j++){
			var x = object.way[j].x;
			var y = object.way[j].y;
			ctxB.lineTo((x-cam.x)*cam.scale+400, (y-cam.y)*cam.scale+400);
		}
		ctxB.strokeStyle = object.color;
		ctxB.stroke();
	}
}

  
function drawLine(c, x, y, x1, y1, color){
	c.beginPath();
	c.moveTo((x-cam.x)*cam.scale+400, (y-cam.y)*cam.scale+400);
	c.lineTo((x1-cam.x)*cam.scale+400, (y1-cam.y)*cam.scale+400);
	c.strokeStyle = color;
	c.fillStyle = color;
	c.stroke();
}

function line(c, x, y, x1, y1, color){
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x1, y1);
	c.strokeStyle = color;
	c.fillStyle = color;
	c.stroke();
}

var impulse = 0;
var impulseX = 0;
var impulseY = 0;
var mass = 0;

function calculateImpulse(){
	impulse = 0;
	impulseX = 0;
	impulseY = 0;
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		impulseX += object.impulse().x;
		impulseY += object.impulse().y;
	}
	impulse = pif(impulseX, impulseY);
	ctxG.clearRect(0,0,400,400);
	line(ctxG, 200, 200, 200+impulseX/mass/4,200+impulseY/mass/4)
}

function calculateMass(){
	mass = 0;
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		mass += object.m;
	}
	output.innerHTML = mass + "kg";
}

function deleteObjects(){
	objects = [];
}

function step(){
	
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		object.calculate(i);
	}
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		object.move();
	}
	
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		object.join();
	}
	
}

function getValue(s){
	return document.getElementById(s).value;
}

function create(){
	
	setObject(
		Number(getValue("x")),
		Number(getValue("y")),
		Number(getValue("mass")),
		Number(getValue("speed")),
		Number(getValue("direction")),
		getValue("color")
	);
}



ctx.globalAlpha = 0.8;
var time = 0;
function play()
{
	
	wayLength = Number(getValue("trajectory"));
	document.getElementById("trajectory_value").innerHTML = wayLength;
	
	if (document.activeElement.type == "button") document.activeElement.blur();
	drawWay();
	if(state){
		document.getElementById("pause").innerHTML = "PAUSE";
		for(var i=0; i<objects.length; i++){
			var object = objects[i];
			object.save();
		}
		for(var i=0; i<1000; i++){
			step();
		}
	}else{
		document.getElementById("pause").innerHTML = "PLAY";
	}
	ctx.clearRect(0,0,1000,1000);
	for(var i=0; i<objects.length; i++){
		var object = objects[i];
		object.draw();
	}
	
	if(document.getElementById("x").value && document.getElementById("y").value){
		var x = getValue("x");
		var y = getValue("y");
		ctx.beginPath();
		var r = 5;
		ctx.arc((x-cam.x)*cam.scale+400, (y-cam.y)*cam.scale+400, r, 0, 2*Math.PI, 0);
		ctx.strokeStyle = "red";
		ctx.stroke();
	}
	var x = 0;
	var y = 0;
	ctx.beginPath();
	var r = 3;
	ctx.arc((x-cam.x)*cam.scale+400, (y-cam.y)*cam.scale+400, r, 0, 2*Math.PI, 0);
	ctx.strokeStyle = "black";
	ctx.stroke();
	
	calculateMass();
	calculateImpulse();
	
	
	time++;
	
	setTimeout(play, 0);

}

//set objects--------------------------------------------------------------------------


for(var i=0; i<50; i++){
	var c = "rgb(" + random(0,255) +","+ random(0,255) +","+ random(0,255) +")";
	setObject(random(0,1000), random(0,1000), normal(0,500000000, 3), normal(-50000,50000, 50), random(0,360), c);
}
calculateMass();
//--------------------------------------------------------------------------

play();