screen = document.getElementById("screen");
ctx = screen.getContext("2d");

//monster types
const cow = 0;

var mouseDown = 0;
var size=100;
var player={x: 250*size, y: 250*size, fX: 50, fY: 0};
var cam={x: 0*size, y: 0*size, scale: 20*size};

var monsters=[];
function setMonster(type,x,y)
{
	monsters.push({type: type, x: x, y: y, direction: randomInterval(0,360), fX: 40, fY: 0, speed: 0, time: 0});
	if(monsters[monsters.length-1].type==cow)monsters[monsters.length-1].speed=2;
	monsters[monsters.length-1].end = function()
	{
		if(this.x<1)this.x=mapSize*size-1;
		if(this.x>mapSize*size-1)this.x=1;
		if(this.y<1)this.y=mapSize*size-1;
		if(this.y>mapSize*size-1)this.y=1;
	}
	monsters[monsters.length-1].move = function()
	{
		this.think();
		
		for(var i=0; i<Math.abs(this.fX); i++)
		{	this.end();
			if(this.fX>0 && blocks[cell(this.x+1)][cell(this.y)].type==0)
			{
				this.end();
				this.x++;
			}else if(this.fX<0 && blocks[cell(this.x-1)][cell(this.y)].type==0)
			{
				this.end();
				this.x--;
			}
			else
			{this.fX=0;}
		}
		for(var i=0; i<Math.abs(this.fY); i++)
		{
			if(this.fY>0 && blocks[cell(this.x)][cell(this.y+1)].type==0)
			{
				this.end();
				this.y++;
			}else if(this.fY<0 && blocks[cell(this.x)][cell(this.y-1)].type==0)
			{
				this.end();
				this.y--;
			}else
			{this.fY=0;}
		}
		this.time++;
	}
	monsters[monsters.length-1].think = function()
	{
		if(distance(player.x,player.y,this.x,this.y)<3*size)
		{
			this.speed=5;
			var a = player.x-this.x;
			var b = player.y-this.y;
			var c = Math.sqrt(a*a+b*b);
			this.fX=-a*this.speed/c;
			this.fY=-b*this.speed/c;
		}else if(this.time%50==0)
		{
			this.speed=2;
			this.direction=randomInterval(0,360);
			this.fX = Math.cos(this.direction)*this.speed;
			this.fY = Math.sin(this.direction)*this.speed;
			if(blocks[cell(this.x)][cell(this.y)].biom==forest)
			{
				if(blocks[cell(this.x)-1][cell(this.y)].biom==field)
				{
					this.fX=-this.speed;
				}
				if(blocks[cell(this.x)+1][cell(this.y)].biom==field)
				{
					this.fX=this.speed;
				}
				if(blocks[cell(this.x)][cell(this.y-1)].biom==field)
				{
					this.fY=-this.speed;
				}
				if(blocks[cell(this.x)][cell(this.y+1)].biom==field)
				{
					this.fY=this.speed;
				}
			}
		}
		
	}
}

//monsters
for(var x=50; x<mapSize-50; x++)
{
	for(var y=50; y<mapSize-50; y++)
	{
		if(blocks[x][y].type==0 && randomInterval(0,100)==0 && blocks[x][y].biom==field)
		{
			setMonster(cow,x*size,y*size);
		}
	}
}

//--------------------------------------------------------------------------------------------------------------------------------
//spawn player
for(var i=0; i<1000000; i++)
{
	player.x=randomInterval(50,mapSize-50);
	player.y=randomInterval(50,mapSize-50);
	if(blocks[player.x][player.y].type==0)
	{
		break;
	}
}

var maxZoom = 100;
function camera()
{
	cam.x=player.x-cam.scale/2;
	cam.y=player.y-cam.scale/2;
	cam.x=cam.x%(mapSize*size);
	cam.y=cam.y%(mapSize*size);
	if(cam.scale<4*size)cam.scale=4*size;
	if(cam.scale>maxZoom*size)cam.scale=maxZoom*size;
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
var time = 0;
function interval()
{
	if(key.shift==1)
	{
		player.speed=20;
	}else
	{
		player.speed=10;
	}
	camera();
	player.move();
	for(var i=0; i<monsters.length; i++)
	{
		monsters[i].move();
	}
	var a = mouseX-screen.width/2;
	var b = mouseY-screen.height/2;
	var c = Math.sqrt(a*a+b*b);
	if(mouseDown==1 || key.w==1)
	{
		player.fX=player.speed*a/c;
		player.fY=player.speed*b/c;
	}else
	{
		player.fX=0; player.fY=0;
	}
	if(time%2==0)
	{
		draw(); 
	}
	
	time++;
}
setInterval(interval, 20);