var pixel =1;
var n =(cam.scale/(screen.height))/pixel;
//----------------------------------------------------------------------------------------------------------------------------------------
//images
var playerImg = new Image();
	playerImg.src="textures/player.png";
var water = new Image();
	water.src="textures/blocks/water/water.png";
var water1 = new Image();
	water1.src="textures/blocks/water/water1.png";
var water2 = new Image();
	water2.src="textures/blocks/water/water2.png";
var water3 = new Image();
	water3.src="textures/blocks/water/water3.png";
var grass = new Image();
	grass.src="textures/blocks/grass.png";
var sandBlock = new Image();
	sandBlock.src="textures/blocks/sand.png";
var treeImg = new Image();
	treeImg.src="textures/blocks/tree.png";
var flowerImg = new Image();
	flowerImg.src="textures/blocks/flower.png";
	

//corners
var corner1 = new Image();
	corner1.src = "textures/blocks/corners/corner1.png";
var corner2 = new Image();
	corner2.src = "textures/blocks/corners/corner2.png";
var corner3 = new Image();
	corner3.src = "textures/blocks/corners/corner3.png";
var corner4 = new Image();
	corner4.src = "textures/blocks/corners/corner4.png"
//grass corners
var grassCorner1 = new Image();
	grassCorner1.src = "textures/blocks/corners/sand/corner1.png";
var grassCorner2 = new Image();
	grassCorner2.src = "textures/blocks/corners/sand/corner2.png";
var grassCorner3 = new Image();
	grassCorner3.src = "textures/blocks/corners/sand/corner3.png";
var grassCorner4 = new Image();
	grassCorner4.src = "textures/blocks/corners/sand/corner4.png";
//sand corners
var sandCorner1 = new Image();
	sandCorner1.src = "textures/blocks/corners/sand1/corner1.png";
var sandCorner2 = new Image();
	sandCorner2.src = "textures/blocks/corners/sand1/corner2.png";
var sandCorner3 = new Image();
	sandCorner3.src = "textures/blocks/corners/sand1/corner3.png";
var sandCorner4 = new Image();
	sandCorner4.src = "textures/blocks/corners/sand1/corner4.png";
	



//----------------------------------------------------------------------------------------------------------------------------------------
function scaleImg(img)
{
	img.height=size/n+l;
	img.width=size/n+l;
}

function scaleImages()
{
	scaleImg(grass);
	scaleImg(water);
	scaleImg(sandBlock);
}
	
function checkWindow()
{
	screen.height = document.documentElement.clientHeight-4;
	screen.width = document.documentElement.clientWidth;
	ctx.imageSmoothingEnabled = false;
}
function draw()
{
	checkWindow();
	n =cam.scale/screen.width;
	scaleImages();
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

function drawBlock(img, X, Y)
{
	ctx.drawImage(img, scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
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
				if(blocks[X%mapSize][Y%mapSize].resource==sand)
				{
					drawBlock(sandBlock,X,Y);
				}else
				{
					drawBlock(grass,X,Y);
				}				
			}else{
				ctx.fillStyle="rgb(0,100,255)";
				ctx.fillRect(scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
				var step = 7;
				if(time%(8*step)<2*step)
				{
					ctx.drawImage(water, scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
				}else if(time%(8*step)<4*step){
					ctx.drawImage(water1, scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
				}else if(time%(8*step)<6*step){
					ctx.drawImage(water2, scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
				}else{
					ctx.drawImage(water3, scrX(X*size),scrY(Y*size),size/n+l,size/n+l);
				}
			}
			//resources
			if(blocks[X%mapSize][Y%mapSize].resource==flower)
			{
				drawBlock(flowerImg,X,Y);
			}
			//corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1)
			{
				if(blocks[X-1][Y].type==1 && blocks[X][Y-1].type==1){drawBlock(corner1,X,Y);}
				if(blocks[X+1][Y].type==1 && blocks[X][Y-1].type==1){drawBlock(corner2,X,Y);}
				if(blocks[X-1][Y].type==1 && blocks[X][Y+1].type==1){drawBlock(corner3,X,Y);}
				if(blocks[X+1][Y].type==1 && blocks[X][Y+1].type==1){drawBlock(corner4,X,Y);}
			}
			//grass corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1 && (blocks[X][Y].resource==sand || blocks[X][Y].type==1))
			{
				if(blocks[X-1][Y].resource!=sand && blocks[X][Y-1].resource!=sand && blocks[X-1][Y].type==0 && blocks[X][Y-1].type==0){drawBlock(grassCorner1,X,Y);}
				if(blocks[X+1][Y].resource!=sand && blocks[X][Y-1].resource!=sand && blocks[X+1][Y].type==0 && blocks[X][Y-1].type==0){drawBlock(grassCorner2,X,Y);}
				if(blocks[X-1][Y].resource!=sand && blocks[X][Y+1].resource!=sand && blocks[X-1][Y].type==0 && blocks[X][Y+1].type==0){drawBlock(grassCorner3,X,Y);}
				if(blocks[X+1][Y].resource!=sand && blocks[X][Y+1].resource!=sand && blocks[X+1][Y].type==0 && blocks[X][Y+1].type==0){drawBlock(grassCorner4,X,Y);}
			}
			//sand corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1 && blocks[X][Y].resource!=sand)
			{
				if(blocks[X-1][Y].resource==sand && blocks[X][Y-1].resource==sand && blocks[X-1][Y-1].resource==sand){drawBlock(sandCorner1,X,Y);}
				if(blocks[X+1][Y].resource==sand && blocks[X][Y-1].resource==sand && blocks[X+1][Y-1].resource==sand){drawBlock(sandCorner2,X,Y);}
				if(blocks[X-1][Y].resource==sand && blocks[X][Y+1].resource==sand && blocks[X-1][Y+1].resource==sand){drawBlock(sandCorner3,X,Y);}
				if(blocks[X+1][Y].resource==sand && blocks[X][Y+1].resource==sand && blocks[X+1][Y+1].resource==sand){drawBlock(sandCorner4,X,Y);}
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
			if(blocks[X%mapSize][Y%mapSize].resource==1) //trees
			{
				ctx.strokeStyle="rgb(150,150,0)";
				ctx.fillStyle="rgb(10,80,10)";
				ctx.drawImage(treeImg, scrX(X*size),scrY(Y*size-size),size/n+l,size*2/n+l);
			}
		}
		if(y==Math.round(player.y/size)-1) //player
		{
			ctx.strokeStyle="red";
			ctx.lineWidth=15/n;
			ctx.drawImage(playerImg,scrX(player.x-size/2),scrY(player.y-size*2),size/n,size*2/n);
		}
	}
}