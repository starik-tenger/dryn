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
	monsters.push({type: type, x: x, y: y, direction: 0, fX: 0, fY: 0, speed: 0});
	if(monster.type==cow)monster.speed=0;
	monsters[monsters.lenght].move = function()
	{
		
	}
}

for(var i=0; i<1000000; i++)
{
	
}

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
	if(cam.scale<4*size)cam.scale=4*size;
	if(cam.scale>50*size)cam.scale=50*size;
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
	camera();
	player.move();
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