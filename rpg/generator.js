var start=10000;
var blocks=[];
var mapSize=1000;
var steps = 70;;
var lakeSize = 10;
var lakes = 1000;

//bioms const
const field = 1;
const forest = 2;
const tundra = 3;

//resorces const
const tree = 1;
const sand = 2;
const flower = 3;

for(var x=0; x<mapSize; x++)
{
	blocks.push([]);
	for(var y=0; y<mapSize; y++)
	{
		blocks[x].push({type: 0, neighbors: 0, resource: 0, sandNeighbors: 0, biom: field});
		if(randomInterval(0,start)==0 || x==0 || y==0 || x==mapSize-1 || y==mapSize-1)
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
			if(blocks[(x+1)][(y)].type==1){blocks[x][y].neighbors+=1;}
			if(blocks[(x)][(y-1)].type==1){blocks[x][y].neighbors+=1;}
			if(blocks[(x)][(y+1)].type==1){blocks[x][y].neighbors+=1;}
			if(blocks[(x-1)][(y)].type==1){blocks[x][y].neighbors+=1;}
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
			block.sandNeighbors=0;
			if(blocks[(x+1)][(y)].resource==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x)][(y-1)].resource==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x)][(y+1)].resource==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x-1)][(y)].resource==sand){blocks[x][y].sandNeighbors+=1;}
		}
	}
	
}

function biomNeighbor(biom)
{
	for(var x=1; x<mapSize-1; x++)
	{
		for(var y=1; y<mapSize-1; y++)
		{
			var block=blocks[x][y];
			block.biomNeighbors=0;
			if(blocks[(x+1)][(y)].biom==biom){blocks[x][y].biomNeighbors+=1;}
			if(blocks[(x)][(y-1)].biom==biom){blocks[x][y].biomNeighbors+=1;}
			if(blocks[(x)][(y+1)].biom==biom){blocks[x][y].biomNeighbors+=1;}
			if(blocks[(x-1)][(y)].biom==biom){blocks[x][y].biomNeighbors+=1;}
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
			if(randomInterval(0,4-blocks[x][y].neighbors)<2 && blocks[x][y].neighbors!=0)
			{
				blocks[x][y].type=1;
			}
		}
	}
	neighbor();
}

for(var i=0; i<steps-lakeSize; i++)
{
	map();
}
for(var x=0; x<mapSize; x+=1)
{
	for(var y=0; y<mapSize; y+=1)
	{
		if(randomInterval(0,lakes)==0)
		{
			blocks[x][y].type=1;
		}
	}
}
for(var i=0; i<lakeSize; i++)
{
	map();
}

//smoothing
function smooth(s)
{
	for(var i=0; i<s; i++)
	{
		neighbor();
		for(var x=1; x<mapSize-1; x+=1)
		{
			for(var y=1; y<mapSize-1; y+=1)
			{
				if(blocks[x][y].neighbors>2)
				{
					blocks[x][y].type=1;
				}
			}
		}
	}
}
smooth(3);

var forestStart = 1000;
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(randomInterval(0,forestStart)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].biom=forest;
		}
	}
}
for(var i=0; i<60; i++)
{
	biomNeighbor(forest);
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,4-blocks[x][y].biomNeighbors)==0 && blocks[x][y].type==0 && blocks[x][y].biomNeighbors>0)
			{
				blocks[x][y].biom=forest;
			}
		}
	}
}

//flowers
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if((randomInterval(0,4)==0 && blocks[x][y].biom==field || randomInterval(0,10)==0) && blocks[x][y].type==0)
		{
			blocks[x][y].resource=flower;
		}
	}
}

//trees
var trees = 2;
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if((randomInterval(0,trees)==0 && blocks[x][y].biom==forest || randomInterval(0,trees*15)==0) && blocks[x][y].type==0)
		{
			blocks[x][y].resource=tree;
		}
	}
}

//sand
neighbor();
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(blocks[x][y].neighbors>0 && blocks[x][y].type==0 && randomInterval(0,20)==0)
		{
			blocks[x][y].resource=sand;
		}
	}
}

sandNeighbor();
for(var i=0; i<10; i++)
{
	sandNeighbor();
	for(var x=0; x<mapSize; x++)
		{
			for(var y=0; y<mapSize; y++)
			{
				var block=blocks[x][y];
				if(((block.neighbors>0 && randomInterval(0,1)==0) || (randomInterval(0,4-block.sandNeighbors)<1)) && block.sandNeighbors>0 && blocks[x][y].type==0)
				{
					blocks[x][y].resource=sand;
				}
			}
		}
}
