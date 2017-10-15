var screen=document.getElementById("screen");
var ctx=screen.getContext("2d");
screen.height = 800;
screen.width = 800;


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

//var interval = 100;
var width1 = 800;

var heightMap = [];
for(var i=0; i<width1; i++)
{
	heightMap.push([]);
	for(var j=0; j<width1; j++)
	{
		heightMap[i].push(0);
	}
}


function interpolate(a, b, t, interval){
	t = t/interval;
	//t = t * t * t * (t * (t * 6 - 15) + 10);
	return a + (b - a) * t;
}

function cell(a, i)
{
	return Math.floor(a/i);
}



function heightLayer(interval, width, maxValue){
	var points = [];
	var size = Math.ceil(width/interval)+1
	for(var i=0; i<size; i++)
	{
		points.push([]);
		for(var j=0; j<size; j++)
		{
			points[i].push(normal(0, 1, 1)*100);
		}
	}
	points = [
		[0,100],
		[0,100]];
	console.log(size, points);
	for(var x=0; x<width; x++)
	{
		for(var y=0; y<width; y++)
		{
			if(x%interval == 0 && y%interval == 0){
				heightMap[x][y] = heightMap[x/interval][y/interval];
				continue;
			}
			var cellX = cell(x, interval);
			var cellY = cell(y, interval);
			//
			var a0 = points[cellX][cellY];
			var b0 = points[cellX+1][cellY];
			var a1 = points[cellX][cellY+1];
			var b1 = points[cellX+1][cellY+1];
			//
			var ty = y%interval;
			var tx = x%interval;
			
			var a = interpolate(a0, a1, ty, interval);
			var b = interpolate(b0, b1, ty, interval);
			
			
			heightMap[x][y] = interpolate(a, b , tx, interval);
			//heightMap[x][y] = points[cellX][cellY];
		}
	}
}

function draw(){
	for(var x=0; x<width1; x++)
	{
		for(var y=0; y<width1; y++)
		{
			var c = heightMap[x][y]*1;
			ctx.fillStyle = "rgb("+c+",0,0)"
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

heightLayer(800, 800, 300);
draw();
