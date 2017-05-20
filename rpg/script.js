//HTML objects
var screen = document.getElementById("screen");
var ctx = screen.getContext("2d");

var input=document.getElementById("input");
var inputSize=document.getElementById("size");
var inputStart=document.getElementById("startWaterPoints");
var inputSteps=document.getElementById("steps");
var inputStartLake=document.getElementById("startLakePoints");
var inputLakeSize=document.getElementById("lakesSize");
var inputSmoothing=document.getElementById("smoothing");

//--------------------------------------------------------------------------------------------------------------------------------
//monster types
const cow = 0;
const wolf = 1;

//resources const
const wood=1;

//tools const
const axe = 1;
const gun = 2;

var mouseDown = 0;
var size=100;
var player={
	x: 250*size, 
	y: 250*size, 
	fX: 50, 
	fY: 0, 
	HP: 20,
	maxHP: 20,
	resources: {wood: 0},
	tools: [{type: axe, strength: 100, recharge: 50, time: 0}, {type: gun, strength: 100, recharge: 100, time: 0}],
	tool: 0
};
var cam={x: 0*size, y: 0*size, scale: 20*size};
var cursor={x: 0, y: 0};

//drop
var dropList=[];
function drop(type,x,y)
{
	dropList.push({
		x: x+randomInterval(-size/2,size/2),
		y: y+randomInterval(-size/2,size/2),
		fX: 0,
		fY: 0,
		type: type,
		type: wood,
		move: function()
		{
			for(var i=0; i<Math.abs(this.fX); i++)
			{	
				if(this.fX>0 && blocks[cell(this.x+1)][cell(this.y)].type==0)
				{
					this.x++;
				}else if(this.fX<0 && blocks[cell(this.x-1)][cell(this.y)].type==0)
				{
					this.x--;
				}
				else
				{this.fX=0;}
			}
			for(var i=0; i<Math.abs(this.fY); i++)
			{
				if(this.fY>0 && blocks[cell(this.x)][cell(this.y+1)].type==0)
				{
					this.y++;
				}else if(this.fY<0 && blocks[cell(this.x)][cell(this.y-1)].type==0)
				{
					this.y--;
				}else
				{this.fY=0;}
			}
		}
	});
}

var monsters=[];
function setMonster(type,x,y)
{
	monsters.push({type: type, x: x, y: y, direction: randomInterval(0,360), fX: 0, fY: 0, speed: 0, time: 0});
	var monster = monsters[monsters.length-1];
	if(monster.type==cow)monsters[monsters.length-1].speed=2;
	if(monster.type==wolf)monsters[monsters.length-1].speed=5;
	monster.wait = 100;
	monsters[monsters.length-1].end = function()
	{
	}
	monsters[monsters.length-1].move = function()
	{
		this.think();
		if(blocks[cell(this.x)][cell(this.y)].surface==bogSurface){this.fX=this.fX/1.5;this.fY=this.fY/1.5;}
		if(blocks[cell(this.x)][cell(this.y)].surface==puddle){this.fX=this.fX/2;this.fY=this.fY/2;}
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
	if(type==cow)monsters[monsters.length-1].think = function()
	{
		if(distance(player.x,player.y,this.x,this.y)<3*size)
		{
			this.speed=5;
			var a = player.x-this.x;
			var b = player.y-this.y;
			var c = Math.sqrt(a*a+b*b);
			this.fX=-a*this.speed/c;
			this.fY=-b*this.speed/c;
		}else 
		{
			
			this.speed=2;
			if(this.time%50==0){this.direction=randomInterval(0,360);}
			this.fX = Math.cos(this.direction)*this.speed;
			this.fY = Math.sin(this.direction)*this.speed;
			if(blocks[cell(this.x)][cell(this.y)].biom!=field)
			{
				if(blocks[cell(this.x)-1][cell(this.y)].biom==field)
				{
					this.fX=-this.speed;
					this.fY=0;
				}
				if(blocks[cell(this.x)+1][cell(this.y)].biom==field)
				{
					this.fX=this.speed;
					this.fY=0;
				}
				if(blocks[cell(this.x)][cell(this.y)-1].biom==field)
				{
					this.fY=-this.speed;
					this.fX=0;
				}
				if(blocks[cell(this.x)][cell(this.y)+1].biom==field)
				{
					this.fY=this.speed;
					this.fX=0;
				}
			}
		}
		
	}
	if(type==wolf)monsters[monsters.length-1].think = function()
	{
		if(distance(player.x,player.y,this.x,this.y)<5*size)
		{
			this.speed=10;
			var a = player.x-this.x;
			var b = player.y-this.y;
			var c = Math.sqrt(a*a+b*b);
			this.fX=a*this.speed/c;
			this.fY=b*this.speed/c;
		}else
		{
			this.speed=5;
			this.direction+=inRad(randomInterval(-30,30));
			this.fX = Math.cos(this.direction)*this.speed;
			this.fY = Math.sin(this.direction)*this.speed;
			if(time%200==0)
			{
				if(blocks[cell(this.x)-1][cell(this.y)].type==1)
				{
					this.fX=this.speed;
				}
				if(blocks[cell(this.x)+1][cell(this.y)].type==1)
				{
					this.fX=-this.speed;
				}
				if(blocks[cell(this.x)][cell(this.y-1)].type==1)
				{
					this.fY=this.speed;
				}
				if(blocks[cell(this.x)][cell(this.y+1)].type==1)
				{
					this.fY=-this.speed;
				}
			}
		}
		if(distance(player.x,player.y,this.x,this.y)<1*size && this.wait>100)
		{
			player.HP-=3;
			this.wait=0;
		}
		this.wait++;
	}
}
//monsters
function generateMonsters()
{
	for(var x=00; x<mapSize-1; x++)
	{
		for(var y=0; y<mapSize-1; y++)
		{
			if(randomInterval(0,100)==0 && blocks[x][y].biom==field)
			{
				setMonster(cow,x*size,y*size);
				//console.log(blocks[x][y].biom);
			}
			if(randomInterval(0,100)==0 && blocks[x][y].biom==forest)
			{
				setMonster(wolf,x*size,y*size);
			}
		}
	}
}

//--------------------------------------------------------------------------------------------------------------------------------
//spawn player
function spawnPlayer()
{
	for(var i=0; i<1000000; i++)
	{
		player.x=randomInterval(0,mapSize-1);
		player.y=randomInterval(0,mapSize-1);
		if(blocks[player.x][player.y].type==0 && blocks[player.x][player.y].biom==field)
		{
			break;
		}
	}	
	player.x=player.x*size;
	player.y=player.y*size;
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

function cursorMove()
{
	cursor.x=mouseX*n+cam.x;
	cursor.y=(mouseY+(screen.width-screen.height)/2)*n+cam.y;
	if(mouseDown)
	{
		if(blocks[cell(cursor.x)][cell(cursor.y)].resource==tree && player.tools[player.tool].type==axe && player.tools[player.tool].time<=0)
		{
			var count = randomInterval(1,5);
			for(var i=0; i<count; i++)
			{
				drop(wood,cursor.x,cursor.y);
			}
			player.tools[player.tool].strength--;
			player.tools[player.tool].time=50;
			blocks[cell(cursor.x)][cell(cursor.y)].resource=0;
		}
		if(player.tools[player.tool].type==gun && player.tools[player.tool].time<=0)
		{
			setMonster(cow,cursor.x,cursor.y);
			player.tools[player.tool].time=player.tools[player.tool].recharge;
		}
	}
	player.tools[player.tool].time--;
	if(player.tools[player.tool].time<0)
	{
		player.tools[player.tool].time=0;
	}
}

function cell(a)
{
	return Math.round((a)/size-0.5);
}

player.move=function()
{
	if(player.HP<=0)
	{
		clearInterval(game);
	}
	if(blocks[cell(player.x)][cell(player.y)].surface==bogSurface){player.fX=player.fX/1.5;player.fY=player.fY/1.5;}
	if(blocks[cell(player.x)][cell(player.y)].surface==puddle){player.fX=player.fX/2;player.fY=player.fY/2;}
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


var time = 0;
var keyTime=0;
function interval()
{
	
	if(key.shift==1)
	{
		player.speed=20;
	}else
	{
		player.speed=10;
	}
	if(time%4==0)
	{
		if(key.right && player.tool<player.tools.length-1)player.tool++;
		if(key.left && player.tool>0)player.tool--;
	}
	
	camera();
	cursorMove();
	player.move();
	
	for(var i=0; i<dropList.length; i++)
	{
		dropList[i].move();
		if(distance(dropList[i].x,dropList[i].y,player.x,player.y)<size*3)
		{
			var a = player.x-dropList[i].x;
			var b = player.y-dropList[i].y;
			var c = Math.sqrt(a*a+b*b);
			var speed = (3-distance(dropList[i].x,dropList[i].y,player.x,player.y)/size)*10;
			dropList[i].fX=a*speed/c;
			dropList[i].fY=b*speed/c;
		}else
		{
			dropList[i].fX=0;
			dropList[i].fY=0;
		}
		if(distance(dropList[i].x,dropList[i].y,player.x,player.y)<size/2)
		{
			dropList.splice(i,1);
			player.resources.wood++;
		}
	}
	
	for(var i=0; i<monsters.length; i++)
	{
		monsters[i].move();
	}
	var a = mouseX-screen.width/2;
	var b = mouseY-screen.height/2;
	var c = Math.sqrt(a*a+b*b);
	if(key.w==1)
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

function startGame()
{
	input.className = "invisible";
	screen.className = "visible";
	
	ctx.font = "500% Arial";
	ctx.fillText("LOADING",100,100);
	
	setTimeout(startWorld, 100);
}

function startWorld()
{
	
	generate(
		inputSize.value,
		inputStart.value,
		inputSteps.value,
		inputStartLake.value,
		inputLakeSize.value,
		inputSmoothing.value
	);
	player={
		x: 250*size, 
		y: 250*size, 
		fX: 50, 
		fY: 0, 
		HP: 20,
		maxHP: 20,
		speed: 10,
		resources: {wood: 0},
		tools: [{type: axe, strength: 100, recharge: 50, time: 0}, {type: gun, strength: 100, recharge: 100, time: 0}],
		tool: 0,
		move: function()
		{
			if(player.HP<=0)
			{
				clearInterval(game);
			}
			if(blocks[cell(player.x)][cell(player.y)].surface==bogSurface){player.fX=player.fX/1.5;player.fY=player.fY/1.5;}
			if(blocks[cell(player.x)][cell(player.y)].surface==puddle){player.fX=player.fX/2;player.fY=player.fY/2;}
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
	};
	spawnPlayer();
	generateMonsters();
	var game = setInterval(interval, 20);
}