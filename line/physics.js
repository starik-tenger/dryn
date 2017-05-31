var gravity = 40;
var player =
{
	x: 5*1000, 
	y: 80*1000, 
	z: 5*1000, 
	fX: 0, 
	fY: 0, 
	fZ: 0,
	speed: 100,
	points: [
		{x: 0, y: -500, z: 0},
		{x: 0, y: -1500, z: 0},
		{x: -500, y: -500, z: -500},
		{x: -500, y: -500, z: 500},
		{x: 500, y: -500, z: -500},
		{x: 500, y: -500, z: 500}
	],
	cell: function()
	{
		var x = Math.round(this.x/blockSize);
		var y = Math.round((this.y-blockSize/2)/blockSize);
		var z = Math.round(this.z/blockSize);
		return {x, y, z};
	},
	inBlock: function()
	{
		for(var i=0; i<this.points.length; i++)
		{
			
			if ( playerCell(this.x + this.points[i].x) < 0 || playerCell(this.y + this.points[i].y) < 0 || playerCell(this.z + this.points[i].z) < 0 || 
			     playerCell(this.x + this.points[i].x) > 99 || playerCell(this.y + this.points[i].y) > 99 || playerCell(this.z + this.points[i].z) > 99)
			return false;
			
			if(blocks[playerCell(this.x + this.points[i].x)][playerCell(this.y + this.points[i].y)][playerCell(this.z + this.points[i].z)].value == 1)
				return true;
		}
		return false;
	},
	move: function()
	{
		//Y		----------------------------------------------------------------
		this.fY+=gravity;
		for(var i=0; i<Math.abs(this.fY); i++)
		{
			if(!this.inBlock() && player.fY>0)
			{
				this.y++;
			}
			if(!this.inBlock() && player.fY<0)
			{
				this.y--;
			}
		}
		if(this.inBlock()){
			if(player.fY>0)
			{
				this.y--;
			}
			if(player.fY<0)
			{
				this.y++;
			}
			player.fY = 0;
			if(key.space)
			{
				player.fY = -Math.sqrt(2*gravity*jumpHeight);
			}
		}
		//X		----------------------------------------------------------------
		for(var i=0; i<Math.abs(this.fX); i++)
		{
			if(!this.inBlock() && player.fX>0)
			{
				this.x++;
			}
			if(!this.inBlock() && player.fX<0)
			{
				this.x--;
			}
		}
		if(player.fX>0)
		{
			this.x--;
		}
		if(player.fX<0)
		{
			this.x++;
		}
		//Z		----------------------------------------------------------------
		for(var i=0; i<Math.abs(this.fZ); i++)
		{
			if(!this.inBlock() && player.fZ>0)
			{
				this.z++;
			}
			if(!this.inBlock() && player.fZ<0)
			{
				this.z--;
			}
		}
		if(player.fZ>0)
		{
			this.z--;
		}
		if(player.fZ<0)
		{
			this.z++;
		}
		//----------------------------------------------------------------
	}
};

function playerCell(n)
{
	n = Math.round(n/blockSize);
	return n;
}

var blocks = [];
for(var x=0; x<100; x++)
{
	blocks.push([]);
	for(var y=0; y<100; y++)
	{
		blocks[x].push([]);
		for(var z=0; z<100; z++)
		{
			blocks[x][y].push({
				value: 0, 
				color: "rgb("+randomInterval(0,20)+","+(150+randomInterval(-50,50))+","+randomInterval(0,20)+")",
				color_top: 
					"rgb("+(51+randomInterval(-10,10))+","+(25+randomInterval(-10,10))+","+(0+randomInterval(0,10))+")"
			});
		}
	}
}

var sX=10;
var sY=10;
var sZ=10;

function setBlock(x, y, z)
{
	blocks[x][y][z].value=1;
}



setBlock(sX+1, sY, sZ);
setBlock(sX+1, sY, sZ);
setBlock(sX, sY+1, sZ);
setBlock(sX+1, sY+1, sZ);
setBlock(sX+2, sY+1, sZ);
setBlock(sX+1, sY+2, sZ);
sZ+=2;
setBlock(sX+1, sY, sZ);
setBlock(sX+1, sY, sZ);
setBlock(sX, sY+1, sZ);
setBlock(sX+1, sY+1, sZ);
setBlock(sX+2, sY+1, sZ);
setBlock(sX+1, sY+2, sZ);
sZ--;
for(var i=0; i<3; i++)
{
	for(var j=0; j<3; j++)
	{
		setBlock(sX+i, sY+j, sZ);
	}
}


var field = [];
for(var x=0; x<100; x++)
{
	field.push([]);
	for(var y=0; y<100; y++)
	{
		field[x].push(1);
	}
}


for(var i=0; i<10000000; i++)
{
	field[normal(0,99,3)][normal(0,99,3)]+=0.1;
}

for(var x=0; x<100; x++)
{
	field.push([]);
	for(var y=0; y<100; y++)
	{
		field[x][y]=Math.sqrt(field[x][y]);
	}
}

function bomb(r)
{
	var p = player.cell();
	for(var x=0; x<100; x++)
	{
		for(var y=0; y<100; y++)
		{
			for(var z=0; z<100; z++)
			{
				if((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y) + (p.z-z)*(p.z-z) < (r+1)*(r+1))
				{
					blocks[x][y][z].color = "rgb("+(102+randomInterval(-20,20))+","+randomInterval(0,20)+","+randomInterval(0,20)+")";
					blocks[x][y][z].color_top = "rgb("+(50+randomInterval(-20,20))+","+randomInterval(0,20)+","+randomInterval(0,20)+")";
				}
				if((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y) + (p.z-z)*(p.z-z) < r*r)
				{
					blocks[x][y][z].value = 0;
				}
			}
		}
	}
}

for(var x=0; x<100; x++)
{
	for(var z=0; z<100; z++)
	{
		for(var y=1; y<field[x][z]+1; y++)
		{
			setBlock(x, 100-y, z);
		}
	}
}

