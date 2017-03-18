var start=1000;
var blocks=[];
var mapSize=1000;

const tree = 1;
const sand = 2;

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
function sandNeighbor()
{
	for(var x=1; x<mapSize-1; x++)
	{
		for(var y=1; y<mapSize-1; y++)
		{
			var block=blocks[x][y];
			block.neighbors=0;
			if(blocks[(x-1)][(y-1)].resource==sand){blocks[x][y].sandNeighbors++;}
			if(blocks[(x-1)][(y+1)].resource==sand){blocks[x][y].sandNeighbors++;}
			if(blocks[(x+1)][(y-1)].resource==sand){blocks[x][y].sandNeighbors++;}
			if(blocks[(x+1)][(y+1)].resource==sand){blocks[x][y].sandNeighbors++;}
			if(blocks[(x+1)][(y)].resource==sand){blocks[x][y].sandNeighbors+=2;}
			if(blocks[(x)][(y-1)].resource==sand){blocks[x][y].sandNeighbors+=2;}
			if(blocks[(x)][(y+1)].resource==sand){blocks[x][y].sandNeighbors+=2;}
			if(blocks[(x-1)][(y)].resource==sand){blocks[x][y].sandNeighbors+=2;}
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
			if(randomInterval(0,12-blocks[x][y].neighbors)<2 && blocks[x][y].neighbors!=0)
			{
				blocks[x][y].type=1;
			}
		}
	}
	neighbor();
}

for(var i=0; i<30; i++)
{
	map();
}
for(var x=0; x<mapSize; x+=1)
{
	for(var y=0; y<mapSize; y+=1)
	{
		if(randomInterval(0,200)==0)
		{
			blocks[x][y].type=1;
		}
	}
}
for(var i=0; i<7; i++)
{
	map();
}

//trees
for(var x=0; x<mapSize; x+=2)
{
	for(var y=0; y<mapSize; y+=2)
	{
		if(randomInterval(0,4)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].resource=tree;
		}
	}
}

//sand
for(var x=0; x<mapSize; x+=1)
{
	for(var y=0; y<mapSize; y+=1)
	{
		if(blocks[x][y].neighbors && blocks[x][y].type==0 && randomInterval(0,7)<5)
		{
			blocks[x][y].resource=sand;
		}
	}
}

sandNeighbor();
for(var i=0; i<5; i++)
{
	sandNeighbor();
	for(var x=0; x<mapSize; x++)
		{
			for(var y=0; y<mapSize; y++)
			{
				if(randomInterval(0,6-blocks[x][y].sandNeighbors)<2 && blocks[x][y].sandNeighbors!=0 && blocks[x][y].type==0)
				{
					blocks[x][y].resource=sand;
				}
			}
		}
}