var screen=document.getElementById("screen");
var ctx=screen.getContext("2d");
screen.height = 800;
screen.width = 4000;

ctx.fillStyle = "green";
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

var xInterval = 30;
var width = 4000;

var heightMap = [width];
for(var i=0; i<width; i++)
{
	heightMap[i] = 0;
}


function interpolate(a, b, t, xInterval){
	t = t/xInterval;
	t = t * t * t * (t * (t * 6 - 15) + 10);
	return a + (b - a) * t;
}

function cell(x, xInterval)
{
	return Math.floor(x/xInterval);
}



function heightLayer(xInterval, width, maxValue){
	var points = [];
	points.length = Math.ceil(width/xInterval)+1;
	for(var i=0; i<points.length; i++)
	{
		points[i] = normal(0,maxValue, 1);
	}

	for(var x=0; x<width; x++)
	{
		if(x%width == 0){
			heightMap[x] = heightMap[x/width];
			continue;
		}
		var a = points[cell(x, xInterval)];
		var b = points[cell(x, xInterval)+1];
		var t = x%xInterval;
		heightMap[x] += interpolate(a, b ,t, xInterval);
	}
}

function draw(){
	for(var x=0; x<width; x++)
	{
		ctx.fillRect(x, 800-heightMap[x], 1, heightMap[x]);
	}
}

for(var i=0; i<5; i++){
	heightLayer(400/Math.pow(2, i), width, 300/Math.pow(Math.E, i));
}
draw();
