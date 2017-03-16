var pixel =1;
var n =(cam.scale/(10*size));
function draw()
{
	n =(cam.scale/(10*size));
	drawField();
	ctx.strokeStyle="red";
	ctx.strokeRect(scrX(player.x),scrY(player.y),300/(cam.scale/(10*size)),300/(cam.scale/(10*size)));
}
function drawLine(startPointX, startPointY, endPointX, endPointY, width)
{
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(startPointX*pixel, startPointY*pixel);
	ctx.lineTo(endPointX*pixel, endPointY*pixel);
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
var l = 30;
function drawField()
{
	ctx.clearRect(0,0,1000,1000);
	for(var x=Math.round(cam.x/size)-Math.round(cam.scale/size)-1; x<Math.round(cam.x/size)+Math.round(cam.scale/size)+1; x++)
	{
		for(var y=Math.round(cam.y/size)-Math.round(cam.scale/size)-1; y<Math.round(cam.y/size)+Math.round(cam.scale/size)+1; y++)
		{
		var X=x;
		var Y=y;
		if(x<0){X=mapSize+x;}
		if(x>mapSize){X=x-mapSize;}
		if(y<0){Y=mapSize+y;}
		if(y>mapSize){Y=y-mapSize;}
			if(blocks[X%mapSize][Y%mapSize].type==0)
			{
				ctx.fillStyle="rgb(0,"+(200-(8-blocks[X%mapSize][Y%mapSize].neighbors)*10)+",0)";
				ctx.fillRect(scrX(X*size),scrY(Y*size),size/n,size/n+l);
			}else{
				ctx.fillStyle="rgb(0,"+((8-blocks[X%mapSize][Y%mapSize].neighbors)*30)+",255)";
				ctx.fillRect(scrX(X*size),scrY(Y*size),size/n,size/n+l);
			}
		}
	}
	for(var x=Math.round(cam.x/size)-Math.round(cam.scale/size)-1; x<Math.round(cam.x/size)+Math.round(cam.scale/size)+1; x++)
	{
		for(var y=Math.round(cam.y/size)-Math.round(cam.scale/size)-1; y<Math.round(cam.y/size)+Math.round(cam.scale/size)+1; y++)
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
	}
}
setInterval(draw, 50);