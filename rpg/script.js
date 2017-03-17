screen = document.getElementById("screen");
ctx = screen.getContext("2d");

function inRad(num) {
	return num * Math.PI / 180;
	}
	
function randomInterval(max, min)
{
	return Math.round(Math.random() * (max - min) + min);
}

function checkMouse()
{
	mouseX = event.pageX;
	mouseY = event.pageY;
}

var mouseDown = 0;

var start=1000;
var blocks=[];
var mapSize=1000;
for(var x=0; x<mapSize; x++)
{
	blocks.push([]);
	for(var y=0; y<mapSize; y++)
	{
		blocks[x].push({type: 0, neighbors: 0, resource: 0});
		if(randomInterval(0,start)==0)
		{
			blocks[x][y].type=1;
		}
	}
}



function neighbor()
{
	for(var x=1; x<mapSize-1; x++)
	{
		for(var y=1; y<mapSize-1; y++)
		{
			var block=blocks[x][y];
			block.neighbors=0;
			if(blocks[(x-1)][(y-1)].type==1){blocks[x][y].neighbors++;}
			if(blocks[(x-1)][(y+1)].type==1){blocks[x][y].neighbors++;}
			if(blocks[(x+1)][(y-1)].type==1){blocks[x][y].neighbors++;}
			if(blocks[(x+1)][(y+1)].type==1){blocks[x][y].neighbors++;}
			if(blocks[(x+1)][(y)].type==1){blocks[x][y].neighbors+=2;}
			if(blocks[(x)][(y-1)].type==1){blocks[x][y].neighbors+=2;}
			if(blocks[(x)][(y+1)].type==1){blocks[x][y].neighbors+=2;}
			if(blocks[(x-1)][(y)].type==1){blocks[x][y].neighbors+=2;}
		}
	}
}
neighbor();

function map()
{
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,8-blocks[x][y].neighbors)<2 && blocks[x][y].neighbors!=0)
			{
				blocks[x][y].type=1;
			}
		}
	}
	neighbor();
}

for(var i=0; i<45; i++)
{
	map();
}
function make(n)
{
	blocks=[];
	for(var x=0; x<mapSize; x++)
	{
		blocks.push([]);
		for(var y=0; y<mapSize; y++)
		{
			blocks[x].push({type: 0, neighbors: 0});
			if(randomInterval(0,start)==0)
			{
				blocks[x][y].type=1;
			}
		}
	}
	for(var i=0; i<n; i++)
	{
		map();
	}
}

for(var x=0; x<mapSize; x+=2)
{
	for(var y=0; y<mapSize; y+=2)
	{
		if(randomInterval(0,5)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].resource=1;
		}
	}
}

var size=100;
var player={x: 250*size, y: 250*size, fX: 50, fY: 0};
var cam={x: 0*size, y: 0*size, scale: 35*size};



for(var i=0; i<1000000; i++)
{
	player.x=randomInterval(50,mapSize-50);
	player.y=randomInterval(50,mapSize-50);
	if(blocks[player.x][player.y].type==0)
	{
		break;
	}
}

function camera()
{
	cam.x=player.x-cam.scale/2;
	cam.y=player.y-cam.scale/2;
	cam.x=cam.x%(mapSize*size);
	cam.y=cam.y%(mapSize*size);
}

player.x=player.x*size;
player.y=player.y*size;

function cell(a)
{
	return Math.round((a)/size-0.5);
}

player.move=function()
{
	for(var i=0; i<Math.abs(player.fX); i++)
	{
		if(player.fX>0 && blocks[cell(player.x+1)][cell(player.y)].type==0)
		{
			player.x++;
		}else if(player.fX<0 && blocks[cell(player.x-1)][cell(player.y)].type==0)
		{
			player.x--;
		}else
		{player.fX=0;}
	}
	for(var i=0; i<Math.abs(player.fY); i++)
	{
		if(player.fY>0 && blocks[cell(player.x)][cell(player.y+1)].type==0)
		{
			player.y++;
		}else if(player.fY<0 && blocks[cell(player.x)][cell(player.y-1)].type==0)
		{
			player.y--;
		}else
		{player.fY=0;}
	}
}

player.speed = 10;
function interval()
{
	camera();
	player.move();
	var a = mouseX-screen.width/2;
	var b = mouseY-screen.height/2;
	console.log(a,b);
	var c = Math.sqrt(a*a+b*b);
	if(mouseDown==1)
	{
		player.fX=player.speed*a/c;
		player.fY=player.speed*b/c;
	}else
	{
		player.fX=0; player.fY=0;
	}
	//cam.scale+=500;
}
setInterval(interval, 20);