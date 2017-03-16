screen = document.getElementById("screen");
ctx = screen.getContext("2d");

function inRad(num) {
	return num * Math.PI / 180;
	}
	
function randomInterval(max, min)
{
	return Math.round(Math.random() * (max - min) + min);
}
var start=1000;
var blocks=[];
for(var x=0; x<500; x++)
{
	blocks.push([]);
	for(var y=0; y<500; y++)
	{
		blocks[x].push({type: 0, neighbors: 0});
		if(randomInterval(0,start)==0)
		{
			blocks[x][y].type=1;
		}
	}
}



function neighbor()
{
	for(var x=1; x<499; x++)
	{
		for(var y=1; y<499; y++)
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
	for(var x=0; x<500; x++)
	{
		for(var y=0; y<500; y++)
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
	for(var x=0; x<500; x++)
	{
		blocks.push([]);
		for(var y=0; y<500; y++)
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
	drawField();
}

var size=100;
var player={x: 250*size, y: 250*size, hp: 100};
var cam={x: 250*size, y: 250*size, scale: 200*size};

function drawField()
{
	ctx.clearRect(0,0,1000,1000);
	for(var x=Math.round(cam.x/size)-Math.round(cam.scale/size)-1; x<Math.round(cam.x/size)+Math.round(cam.scale/size)+1; x++)
	{
		for(var y=Math.round(cam.y/size)-Math.round(cam.scale/size)-1; y<Math.round(cam.y/size)+Math.round(cam.scale/size)+1; y++)
		{
			ctx.fillStyle="rgb(0,"+((8-blocks[x%500][y%500].neighbors)*30)+",255)";
			ctx.fillRect((x*size-cam.x)/(cam.scale/(10*size)),(y*size-cam.y)/(cam.scale/(10*size)),size/(cam.scale/(10*size)),size/(cam.scale/(10*size)));
			if(blocks[x%500][y%500].type==0)
			{
				ctx.fillStyle="rgb(0,"+(200-(8-blocks[x%500][y%500].neighbors)*10)+",0)";
				ctx.fillRect((x*size-cam.x)/(cam.scale/(10*size)),(y*size-cam.y)/(cam.scale/(10*size)),size/(cam.scale/(10*size)),size/(cam.scale/(10*size)));
			}
		}
	}
}
function camera()
{
	cam.x=cam.x%(500*size);
	cam.y=cam.y%(500*size);
}
drawField();
function interval()
{
	document.getElementById("level1").value=document.getElementById("level").value;
	drawField();
}
setInterval(interval, 100);