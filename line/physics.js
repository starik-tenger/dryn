var gravity = 10;
var player={x: 2000, y: -50*1000, z: 2000, fX: 0, fY: 0, fZ: 0};
player.move = function()
{
	this.fY+=gravity;
	this.x+=this.fX;
	if(player.y<100*blockSize)
	{
		this.y+=this.fY;
	}
	this.z+=this.fZ;
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

			if(y!=100)
			{
				blocks[x][y].push(0);
			}else{
				blocks[x][y].push(1);
			}

		}
	}
}

var sX=10;
var sY=10;
var sZ=10;

function setBlock(x, y, z)
{
	blocks[x][y][z]=1;
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
	field[normal(0,99,3)][normal(0,99,3)]+=0.01;
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

