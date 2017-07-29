//html objectes
var screen = document.getElementById("screen");
	var ctx = screen.getContext("2d");

//basic functions----------------------------------------------------------------
function inRad(num) {
	return num * Math.PI / 180;
}

function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	ctx.lineTo(endPointX, endPointY);
	ctx.stroke();
}
//classes----------------------------------------------------------------
class Line{
	constructor(x, y, x1, y1)
	{
		this.start = {x: x, y: y};
		this.end = {x: x1, y: y1};
		//this.color = color;
	}
}
class Color{
	constructor(r, g, b)
	{
		this.r = r;
		this.g = g;
		this.b = b;
	}
}
//----------------------------------------------------------------
var lines = [];

var branches = 2;
var steps = 7;
var length = 200;
var decrease = 2;
var angleWidth = 180;
var branchAngle = (angleWidth)/(branches);
var k = 0;
var nAngle = -branchAngle*(branches-1)/2+k;

var detalDraw = 1;
var invert = 1;
var leafesOnly = 0;

var startPointX = 500;
var startPointY = 700;

var startColor = new Color(102,51,0);
var endColor = new Color(0,153,0);

for(var i=0; i<steps; i++)
{
	lines.push([]);
}

function branch(x, y, angle, step)
{
	angle += +nAngle;
	if(step>=steps)
	{
		return;
	}
	var nextLength = length;
	for(var i=0; i<step; i++)
	{
		nextLength = nextLength/decrease;
	}
	for(var i=0; i<branches; i++)
	{
		var newAngle = inRad(angle+branchAngle*i);
		var newPoint = {x: x+Math.cos(newAngle)*nextLength, y: y+Math.sin(newAngle)*nextLength};
		branch(newPoint.x, newPoint.y, angle+branchAngle*i, step+1);
		ctx.strokeStyle = "rgb("
			+Math.round( startColor.r + (step+1) / (steps) * (endColor.r-startColor.r) )+ ","
			+Math.round( startColor.g + (step+1) / (steps) * (endColor.g-startColor.g) )+ ","
			+Math.round( startColor.b + (step+1) / (steps) * (endColor.b-startColor.b) )+ ")";
		if(step==steps-1 && leafesOnly || !leafesOnly)
		{
			if(detalDraw)
				lines[step].push(new Line(x, y, newPoint.x, newPoint.y));
			drawLine(x, y, newPoint.x, newPoint.y, width/step);
		}
	}
	
}
var width = 5;
function draw()
{
	ctx.clearRect(0,0,1000,1000);
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, width);
	if(invert)
		for(var i=steps-1; i>=0; i--)
		{
			for(var j=0; j<lines[i].length; j++)
			{
				ctx.strokeStyle = "rgb("
					+Math.round( startColor.r + (i+1) / (steps) * (endColor.r-startColor.r) )+ ","
					+Math.round( startColor.g + (i+1) / (steps) * (endColor.g-startColor.g) )+ ","
					+Math.round( startColor.b + (i+1) / (steps) * (endColor.b-startColor.b) )+ ")";
				drawLine(lines[i][j].start.x, lines[i][j].start.y, lines[i][j].end.x, lines[i][j].end.y, width/i);
			}
		}
	else
		for(var i=0; i<steps; i++)
		{
			for(var j=0; j<lines[i].length; j++)
			{
				ctx.strokeStyle = "rgb("
					+Math.round( startColor.r + (i+1) / (steps) * (endColor.r-startColor.r) )+ ","
					+Math.round( startColor.g + (i+1) / (steps) * (endColor.g-startColor.g) )+ ","
					+Math.round( startColor.b + (i+1) / (steps) * (endColor.b-startColor.b) )+ ")";
				drawLine(lines[i][j].start.x, lines[i][j].start.y, lines[i][j].end.x, lines[i][j].end.y, width/i);
			}
		}
}

ctx.strokeStyle = "rgb("
			+Math.round( startColor.r )+ ","
			+Math.round( startColor.g )+ ","
			+Math.round( startColor.b )+ ")";
drawLine(startPointX, startPointY+length*2, startPointX, startPointY, 5);
//branch(startPointX, startPointY, 270, 0);
draw();
var time = 0;
function play()
{
	buttonClick();
}

function create(branches1, steps1, angleWidth1, decrease1, length1, detal, invert1, leafesOnly1, startColor1, endColor1)
{
	branches = branches1;
	steps = steps1;
	length = length1;
	decrease = decrease1;
	angleWidth = angleWidth1;
	detalDraw = detal;
	branchAngle = (angleWidth)/(branches);
	invert = invert1;
	leafesOnly = leafesOnly1;
	k = 0;
	nAngle = -branchAngle*(branches-1)/2+k;
	startColor = startColor1;
	endColor = endColor1;
	lines = [];
	for(var i=0; i<steps; i++)
	{
		lines.push([]);
	}
	ctx.clearRect(0,0,1000,1000);
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, 5);
	branch(startPointX, startPointY, 270, 0);
	ctx.strokeStyle = "rgb("
			+Math.round( startColor.r )+ ","
			+Math.round( startColor.g )+ ","
			+Math.round( startColor.b )+ ")";
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, 5);
	if(detalDraw)
		draw();
}

function buttonClick()
{
	create(
		Number(document.getElementById("branches").value), 
		Number(document.getElementById("steps").value), 
		Number(document.getElementById("angleWidth").value), 
		Number(document.getElementById("decrease").value), 
		Number(document.getElementById("length").value), 
		document.getElementById("detal").checked, 
		document.getElementById("invert").checked, 
		document.getElementById("leafesOnly").checked, 
		new Color(100,50,0), 
		new Color(0,200,50)
	);
}
buttonClick();
//setInterval(play, 50);