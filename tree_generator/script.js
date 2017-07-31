//html objectes
var screen = document.getElementById("screen");
	var ctx = screen.getContext("2d");
var startColorScreen = document.getElementById("startColor");
	var start = startColorScreen.getContext("2d");
var endColorScreen = document.getElementById("endColor");
	var end = endColorScreen.getContext("2d");

//basic functions----------------------------------------------------------------
function inRad(num) {
	return num * Math.PI / 180;
}
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
var steps = 2;
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

//dispersions
var normalCoefficientAngle = 30;
var normalCoefficientLength = 30;
var angleDispersionBranches = 60;
var lengthDispersion = 0;
var branchesDispersion = 2;

//making lines array
for(var i=0; i<steps; i++)
{
	lines.push([]);
}

function branch(x, y, angle, step)
{
	if(step>=steps)
	{
		return;
	}
	var nextLength = length + normal(-lengthDispersion,lengthDispersion,normalCoefficientLength);
	for(var i=0; i<step; i++)
	{
		nextLength = nextLength/decrease;
	}
	var newBranches = Math.round(Math.abs(branches+normal(-branchesDispersion, branchesDispersion, normalCoefficientBranches)));
	if(newBranches==0)
		newBranches = 1;
	var newBranchAngle = (angleWidth)/(newBranches);
	var newNAngle = -newBranchAngle*(newBranches-1)/2+k;
	angle += newNAngle;
	for(var i=0; i<newBranches; i++)
	{
		
		
		var newAngle = inRad(angle+newBranchAngle*i + normal(-angleDispersion,angleDispersion,normalCoefficientAngle));

		var newPoint = {x: x+Math.cos(newAngle)*nextLength, y: y+Math.sin(newAngle)*nextLength};
		branch(newPoint.x, newPoint.y, angle+newBranchAngle*i, step+1);
		ctx.strokeStyle = "rgb("
			+Math.round( startColor.r + (step+1) / (steps) * (endColor.r-startColor.r) )+ ","
			+Math.round( startColor.g + (step+1) / (steps) * (endColor.g-startColor.g) )+ ","
			+Math.round( startColor.b + (step+1) / (steps) * (endColor.b-startColor.b) )+ ")";
		if(step==steps-1 && leafesOnly || !leafesOnly)
		{
			if(detalDraw)
				lines[step].push(new Line(x, y, newPoint.x, newPoint.y));
			drawLine(x, y, newPoint.x, newPoint.y, startWidth+(step+1)/(steps)*(endWidth-startWidth));
		}
		
	}
	
}
var startWidth = 5;
var endWidth = 1;
var blackBackground = 0;
function draw()
{
	ctx.fillStyle = "black";
	if(blackBackground)
		ctx.fillRect(0,0,1000,1000);
	else
		ctx.clearRect(0,0,1000,1000);
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, startWidth);
	if(invert)
	{
		for(var i=steps-1; i>=0; i--)
		{
			for(var j=0; j<lines[i].length; j++)
			{
				ctx.fillStyle = ctx.strokeStyle = "rgb("
					+Math.round( startColor.r + (i+1) / (steps) * (endColor.r-startColor.r) )+ ","
					+Math.round( startColor.g + (i+1) / (steps) * (endColor.g-startColor.g) )+ ","
					+Math.round( startColor.b + (i+1) / (steps) * (endColor.b-startColor.b) )+ ")";
				drawLine(lines[i][j].start.x, lines[i][j].start.y, lines[i][j].end.x, lines[i][j].end.y, startWidth+(i+1)/(steps)*(endWidth-startWidth));
				ctx.beginPath();
				ctx.arc(lines[i][j].end.x, lines[i][j].end.y, (startWidth+(i+1)/(steps)*(endWidth-startWidth))/2, 0, 2 * Math.PI, false);
				ctx.fill();
			}
		}
	}
	else
	{
		for(var i=0; i<steps; i++)
		{
			for(var j=0; j<lines[i].length; j++)
			{
				ctx.fillStyle = ctx.strokeStyle = "rgb("
					+Math.round( startColor.r + (i+1) / (steps) * (endColor.r-startColor.r) )+ ","
					+Math.round( startColor.g + (i+1) / (steps) * (endColor.g-startColor.g) )+ ","
					+Math.round( startColor.b + (i+1) / (steps) * (endColor.b-startColor.b) )+ ")";
				drawLine(lines[i][j].start.x, lines[i][j].start.y, lines[i][j].end.x, lines[i][j].end.y, startWidth+(i+1)/(steps)*(endWidth-startWidth));
				ctx.beginPath();
				ctx.arc(lines[i][j].end.x, lines[i][j].end.y, (startWidth+(i+1)/(steps)*(endWidth-startWidth))/2, 0, 2 * Math.PI, false);
				ctx.fill();
			}
		}
		ctx.strokeStyle = "rgb("
			+Math.round( startColor.r )+ ","
			+Math.round( startColor.g )+ ","
			+Math.round( startColor.b )+ ")";
		drawLine(startPointX, startPointY+length*2, startPointX, startPointY, startWidth);
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
	if(document.getElementById("invert").checked)
		document.getElementById("detal").checked = true;
	
	start.fillStyle = "rgb("
		+document.getElementById("r").value+","
		+document.getElementById("g").value+","
		+document.getElementById("b").value+")";
	start.fillRect(0,0,20,20);
	end.fillStyle = "rgb("
		+document.getElementById("r1").value+","
		+document.getElementById("g1").value+","
		+document.getElementById("b1").value+")";
	end.fillRect(0,0,20,20);
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
	ctx.fillStyle = "black";
	if(blackBackground)
		ctx.fillRect(0,0,1000,1000);
	else
		ctx.clearRect(0,0,1000,1000);
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, startWidth);
	branch(startPointX, startPointY, 270, 0);
	ctx.strokeStyle = "rgb("
			+Math.round( startColor.r )+ ","
			+Math.round( startColor.g )+ ","
			+Math.round( startColor.b )+ ")";
	drawLine(startPointX, startPointY+length*2, startPointX, startPointY, startWidth);
	if(detalDraw)
		draw();
}

function buttonClick()
{
	normalCoefficientAngle = Number(document.getElementById("normalCoefficientAngle").value);
	normalCoefficientLength = Number(document.getElementById("normalCoefficientLength").value);
	normalCoefficientBranches = Number(document.getElementById("normalCoefficientBranches").value);
	angleDispersion = Number(document.getElementById("angleDispersion").value);
	lengthDispersion = Number(document.getElementById("lengthDispersion").value);
	branchesDispersion = Number(document.getElementById("branchesDispersion").value);
	
	startWidth = Number(document.getElementById("startWidth").value);
	endWidth = Number(document.getElementById("endWidth").value);
	
	blackBackground = document.getElementById("blackBackground").checked;
	
	create(
		Number(document.getElementById("branches").value), 
		Number(document.getElementById("steps").value), 
		Number(document.getElementById("angleWidth").value), 
		Number(document.getElementById("decrease").value), 
		Number(document.getElementById("length").value), 
		document.getElementById("detal").checked, 
		document.getElementById("invert").checked, 
		document.getElementById("leafesOnly").checked, 
		new Color(
			Number(document.getElementById("r").value),
			Number(document.getElementById("g").value),
			Number(document.getElementById("b").value)), 
		new Color(
			Number(document.getElementById("r1").value),
			Number(document.getElementById("g1").value),
			Number(document.getElementById("b1").value))
	);
}
buttonClick();
setInterval(play, 50);