var pixel =1;
var n =(cam.scale/(screen.height))/pixel;
//----------------------------------------------------------------------------------------------------------------------------------------
//images
var playerImg = new Image();
	playerImg.src="textures/player.png";
var cursorImg = new Image();
	cursorImg.src="textures/cursor.png";

//rersources(player)
var woodImg = new Image();
	woodImg.src="textures/resources/wood.png";
	
//surfaces
var waterImg = new Image();
	waterImg.src="textures/blocks/water/water.png";
var grassImg = new Image();
	grassImg.src="textures/blocks/grass.png";
var sandBlock = new Image();
	sandBlock.src="textures/blocks/sand.png";
var bogImg = new Image();
	bogImg.src="textures/blocks/bog.png";
var puddleImg = new Image();
	puddleImg.src="textures/blocks/puddle.png";
	
//resources
var treeImg = new Image();
	treeImg.src="textures/blocks/tree2.png";
var cactusImg = new Image();
	cactusImg.src="textures/blocks/cactus.png";
var flowerImg = new Image();
	flowerImg.src="textures/blocks/flower.png";
var stoneImg = new Image();
	stoneImg.src="textures/blocks/stone.png";
	
//monsters
var cowImg = new Image();
	cowImg.src = "textures/monsters/cow.png";
var wolfImg = new Image();
	wolfImg.src = "textures/monsters/wolf.png";

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
	scaleImg(grassImg);
	scaleImg(waterImg);
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
	ctx.save();
	checkWindow();
	n =cam.scale/screen.width;
	scaleImages();
	drawField();
	ctx.restore();
	
	for(var i=0; i<dropList.length; i++)
	{
		ctx.drawImage(woodImg,scrX(dropList[i].x),scrY(dropList[i].y),size/2/n,size/2/n);
	}
	
	ctx.drawImage(woodImg,20,(screen.width-screen.height)/2+20,64,64);
	ctx.font= "60px Arial";
	ctx.fillStyle="black";
	ctx.fillText(player.resources.wood, 84, (screen.width-screen.height)/2+84);
	
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
	ctx.drawImage(img, scrX(X*size)-l,scrY(Y*size)-l,size/n+l,size/n+l);
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

function data(data,x,y)
{
	ctx.putImageData(data,scrX(x*size),scrY(y*size)-(screen.width-screen.height)/2);
}

function newData(img,width,height)
{
	c.fillStyle="rgb(0,0,0)";
	c.fillRect(0,0,1000,1000);
	c.drawImage(img,0,0,size/n+l,size/n+l);
		var data = c.getImageData(0,0,Math.round(size/n+l),Math.round(size/n+l));
	pix = data.data;
	for (var i = 0; i <pix.length; i += 4)
	{
		var r = pix[i],
			g = pix[i+1],
			b = pix[i+2],
			a = pix[i+3];
		//----------
		if(r+g+b==0)
		{
			a=0;
		}
		//----------
		pix[i] = r;
		pix[i+1] = g;
		pix[i+2] = b;
		pix[i+3] = a;
	}
	return data;
}

var canvas = document.createElement("canvas");canvas.height=1000;canvas.width=1000;
		var c = canvas.getContext("2d");
		
ctx.imageSmoothingEnabled = false;
c.imageSmoothingEnabled = false;
function drawField()
{
	ctx.translate(0,-(screen.width-screen.height)/2);
	//creating image datas
	c.drawImage(grassImg,0,0,size/n+l,size/n+l);
		var grassData = c.getImageData(0,0,Math.round(size/n+l),Math.round(size/n+l));
	c.drawImage(sandBlock,0,0,Math.round(size/n+l),Math.round(size/n+l));
		var sandData = c.getImageData(0,0,Math.round(size/n+l),Math.round(size/n+l));
	var waterData = newData(waterImg,Math.round(size/n+l),Math.round(size/n+l));
	c.drawImage(grassImg,0,0,Math.round(size/n+l),Math.round(size/n+l));
	c.drawImage(bogImg,0,0,Math.round(size/n+l),Math.round(size/n+l));
		var bogData = c.getImageData(0,0,Math.round(size/n+l),Math.round(size/n+l));
	c.drawImage(grassImg,0,0,Math.round(size/n+l),Math.round(size/n+l));
	c.drawImage(puddleImg,0,0,Math.round(size/n+l),Math.round(size/n+l));
		var puddleData = c.getImageData(0,0,Math.round(size/n+l),Math.round(size/n+l));
	
	//corners
	var corner1Data = newData(corner1,Math.round(size/n+l),Math.round(size/n+l));
		
	//-----------------------------------------------------
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
			switch(blocks[X%mapSize][Y%mapSize].surface)
			{
				case sand: 
					data(sandData,X,Y);
					break;
				case grass:
					data(grassData,X,Y);
					break;
				case water:
					data(waterData,X,Y);
					break;
				case bogSurface:
					data(bogData,X,Y);
					break;
				case puddle:
					data(puddleData,X,Y);
					break;
			}
			//resources
			if(blocks[X%mapSize][Y%mapSize].resource==flower)
			{
				drawBlock(flowerImg,X,Y);
			}
			//corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1)
			{
				if(blocks[X-1][Y].surface==water && blocks[X][Y-1].surface==water && blocks[X][Y].surface!=water){drawBlock(corner1,X,Y);}
				if(blocks[X+1][Y].surface==water && blocks[X][Y-1].surface==water && blocks[X][Y].surface!=water){drawBlock(corner2,X,Y);}
				if(blocks[X-1][Y].surface==water && blocks[X][Y+1].surface==water && blocks[X][Y].surface!=water){drawBlock(corner3,X,Y);}
				if(blocks[X+1][Y].surface==water && blocks[X][Y+1].surface==water && blocks[X][Y].surface!=water){drawBlock(corner4,X,Y);}
			}
			//grass corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1 && (blocks[X][Y].surface==sand || blocks[X][Y].surface==water))
			{
				if(blocks[X-1][Y].surface!=sand && blocks[X][Y-1].surface!=sand && blocks[X-1][Y].surface!=water && blocks[X][Y-1].surface!=water && blocks[X-1][Y-1].surface!=water){drawBlock(grassCorner1,X,Y);}
				if(blocks[X+1][Y].surface!=sand && blocks[X][Y-1].surface!=sand && blocks[X+1][Y].surface!=water && blocks[X][Y-1].surface!=water && blocks[X+1][Y-1].surface!=water){drawBlock(grassCorner2,X,Y);}
				if(blocks[X-1][Y].surface!=sand && blocks[X][Y+1].surface!=sand && blocks[X-1][Y].surface!=water && blocks[X][Y+1].surface!=water && blocks[X-1][Y+1].surface!=water){drawBlock(grassCorner3,X,Y);}
				if(blocks[X+1][Y].surface!=sand && blocks[X][Y+1].surface!=sand && blocks[X+1][Y].surface!=water && blocks[X][Y+1].surface!=water && blocks[X+1][Y+1].surface!=water){drawBlock(grassCorner4,X,Y);}
			}
			//sand corners
			if(X>0 && X<mapSize-1 && Y>0 && Y<mapSize-1 && blocks[X][Y].surface!=sand)
			{
				if(blocks[X-1][Y].surface==sand && blocks[X][Y-1].surface==sand && blocks[X-1][Y-1].surface==sand){drawBlock(sandCorner1,X,Y);}
				if(blocks[X+1][Y].surface==sand && blocks[X][Y-1].surface==sand && blocks[X+1][Y-1].surface==sand){drawBlock(sandCorner2,X,Y);}
				if(blocks[X-1][Y].surface==sand && blocks[X][Y+1].surface==sand && blocks[X-1][Y+1].surface==sand){drawBlock(sandCorner3,X,Y);}
				if(blocks[X+1][Y].surface==sand && blocks[X][Y+1].surface==sand && blocks[X+1][Y+1].surface==sand){drawBlock(sandCorner4,X,Y);}
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
			switch(blocks[X%mapSize][Y%mapSize].resource)
			{
				case tree:
					ctx.drawImage(treeImg, scrX(X*size),scrY(Y*size-size*1.5),size/n+l,size*2/n+l);
					break;
				case cactus:
					ctx.drawImage(cactusImg, scrX(X*size),scrY(Y*size-size*1.5),size/n+l,size*2/n+l);
					break;
				case stone:
					ctx.drawImage(stoneImg, scrX(X*size),scrY(Y*size-size*1.5),size/n+l,size*2/n+l);
					break;
			}
		}
		//player
		if(y==Math.round((player.y-size/4)/size)-1) //
		{
			ctx.strokeStyle="red";
			ctx.lineWidth=15/n;
			ctx.drawImage(playerImg,scrX(player.x-size/2),scrY(player.y-size*2),size/n,size*2/n);
		}
		//monsters
		for(var i=0; i<monsters.length; i++)
		{
			if(y==Math.round((monsters[i].y-size/4)/size)-1) //
			{
				if(monsters[i].type==cow)ctx.drawImage(cowImg, scrX(monsters[i].x-size/2), scrY(monsters[i].y-size), size/n, size/n);
				if(monsters[i].type==wolf)ctx.drawImage(wolfImg, scrX(monsters[i].x-size/2), scrY(monsters[i].y-size), size/n, size/n);
			}
		}
	}
	drawBlock(cursorImg,cursor.x,cursor.y)
	
}