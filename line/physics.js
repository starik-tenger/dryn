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
	cell: function()
	{
		var x = Math.round(this.x/blockSize);
		var y = Math.round((this.y-blockSize/2)/blockSize);
		var z = Math.round(this.z/blockSize);
		return {x, y, z};
	},
	move: function()
	{
		//Y		----------------------------------------------------------------
		this.fY+=gravity;
		for(var i=0; i<Math.abs(this.fY); i++)
		{
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fY>0)
			{
				this.y++;
			}
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fY<0)
			{
				this.y--;
			}
		}
		if(blocks[this.cell().x][this.cell().y][this.cell().z].value==1){
			if(player.fY>0)
			{
				this.y--;
			}
			if(player.fY<0)
			{
				this.y++;
			}
			player.fY = 0;
		}
		//X		----------------------------------------------------------------
		for(var i=0; i<Math.abs(this.fX); i++)
		{
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fX>0)
			{
				this.x++;
			}
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fX<0)
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
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fZ>0)
			{
				this.z++;
			}
			if(blocks[this.cell().x][this.cell().y][this.cell().z].value==0 && player.fZ<0)
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
				if((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y) + (p.z-z)*(p.z-z) < r*r)
				{
					blocks[x][y][z].value=0;
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

