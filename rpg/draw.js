var pixel =1;
var n =(cam.scale/(screen.height))/pixel;

function checkWindow()
{
	screen.height = document.documentElement.clientHeight-4;
	screen.width = document.documentElement.clientWidth;
	ctx.imageSmoothingEnabled = false;
}
//cam.y += screen.height;
function draw()
{
	checkWindow();
	n =cam.scale/screen.width;
	drawField();
}
function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	ctx.lineTo(endPointX, endPointY);
	ctx.stroke();
}

function scrX(a)
{
	return (a-cam.x)/n;
}
function scrY(a)
{
	return (a-cam.y)/n;
}
var l = 5;
var f = screen.height/screen.width;

function drawField()
{
	ctx.translate(0,-(screen.width-screen.height)/2);
	for(var x=Math.round(cam.x/size)-Math.round(cam.scale/size)+17; x<Math.round(cam.x/size)+Math.round(cam.scale/size)+1; x++)
	{
		for(var y=Math.round(cam.y/size)-Math.round(cam.scale/size)+17; y<Math.round(cam.y/size)+Math.round(cam.scale/size)+1; y++)
		{
		var X=x;
		var Y=y;
		if(x<0){X=mapSize+x;}
		if(x>mapSize){X=x-mapSize;}
		if(y<0){Y=mapSize+y;}
		if(y>mapSize){Y=y-mapSize;}
			if(blocks[X%mapSize][Y%mapSize].type==0)
			{
				if(blocks[X%mapSize][Y%mapSize].resource==sand)
				{
					ctx.fillStyle="rgb(170,200,10)";
				}else
				ctx.fillStyle="rgb(0,100,0)";
				ctx.fillRect(scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
			}else{
				ctx.fillStyle="rgb(0,100,255)";
				ctx.fillRect(scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
			}
		}
	}
	for(var y=Math.round(cam.y/size)-Math.round(cam.scale/size)-1; y<Math.round(cam.y/size)+Math.round(cam.scale/size)+1; y++)
	{
		for(var x=Math.round(cam.x/size)-Math.round(cam.scale/size)-1; x<Math.round(cam.x/size)+Math.round(cam.scale/size)+1; x++)
		{
			var X=x;
				var Y=y;
				if(x<0){X=mapSize+x;}
				if(x>mapSize){X=x-mapSize;}
				if(y<0){Y=mapSize+y;}
				if(y>mapSize){Y=y-mapSize;}
			if(blocks[X%mapSize][Y%mapSize].resource==1)
			{
				ctx.strokeStyle="rgb(150,150,0)";
				drawLine(scrX(X*size+size/2),scrY(Y*size+size/2),scrX(X*size+size/2),scrY(Y*size+size/2)-200/n, 50/n);
				ctx.fillStyle="rgb(10,80,10)";
				ctx.fillRect(scrX(X*size-size/2),scrY(Y*size)-250/n,(size*2)/n,size/n);
			}
		}
		if(y==Math.round(Math.round(cam.y/size)+Math.round((cam.scale/size))/2)-1)
		{
			ctx.strokeStyle="red";
			ctx.lineWidth=15/n;
			ctx.strokeRect(scrX(player.x-size/2),scrY(player.y-size/2),size/n,size/n);
		}
	}
}
setInterval(draw, 50);