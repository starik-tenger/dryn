var start=10000;
var blocks=[];
var mapSize=1000;
var steps = 70;;
var lakeSize = 5;
var lakes = 300;

//bioms const
const field = 1;
const forest = 2;
const desert = 3;
const bog = 4;

//surface const
const water=1;
const grass=2;
const sand=3;
const bogSurface = 4;
const puddle = 5;

//resorces const
const tree = 1;
const cactus = 2;
const flower = 3;
const stone = 4;

for(var x=0; x<mapSize; x++)
{
	blocks.push([]);
	for(var y=0; y<mapSize; y++)
	{
		blocks[x].push({type: 0, neighbors: 0, resource: 0, sandNeighbors: 0, surface: grass, biom: field});
		if(randomInterval(0,start)==0 || x==0 || y==0 || x==mapSize-1 || y==mapSize-1)
		{
			blocks[x][y].surface=water;
			blocks[x][y].type=1;
			blocks[x][y].biom=0;
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
			if(blocks[(x+1)][(y)].surface==water){blocks[x][y].neighbors+=1;}
			if(blocks[(x)][(y-1)].surface==water){blocks[x][y].neighbors+=1;}
			if(blocks[(x)][(y+1)].surface==water){blocks[x][y].neighbors+=1;}
			if(blocks[(x-1)][(y)].surface==water){blocks[x][y].neighbors+=1;}
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
			if(blocks[(x+1)][(y)].surface==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x)][(y-1)].surface==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x)][(y+1)].surface==sand){blocks[x][y].sandNeighbors+=1;}
			if(blocks[(x-1)][(y)].surface==sand){blocks[x][y].sandNeighbors+=1;}
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
				blocks[x][y].surface=water;
				blocks[x][y].biom=0;
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
			blocks[x][y].surface=water;
			blocks[x][y].biom=0;
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
					blocks[x][y].surface=water;
					blocks[x][y].biom=0;
				}
			}
		}
	}
}
smooth(3);

//sand
neighbor();
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(blocks[x][y].neighbors>0 && blocks[x][y].type==0 && randomInterval(0,17)==0)
		{
			blocks[x][y].surface=sand;
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
					blocks[x][y].surface=sand;
				}
			}
		}
}

var forestStart = 10000;
var desertStart = 15000;
var bogStart = 20000;
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(randomInterval(0,forestStart)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].biom=forest;
		}
		if(randomInterval(0,desertStart)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].biom=desert;
		}
		if(randomInterval(0,bogStart)==0 && blocks[x][y].type==0)
		{
			blocks[x][y].biom=bog;
		}
	}
}
for(var i=0; i<110; i++)
{
	biomNeighbor(desert);
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,4-blocks[x][y].biomNeighbors)==0 && blocks[x][y].type==0 && blocks[x][y].biomNeighbors>0)
			{
				blocks[x][y].biom=desert;
			}
		}
	}
	biomNeighbor(forest);
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,4-blocks[x][y].biomNeighbors)==0 && blocks[x][y].type==0 && blocks[x][y].biomNeighbors>0)
			{
				blocks[x][y].biom=forest;
				blocks[x][y].surface=grass;
			}
		}
	}
	biomNeighbor(bog);
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,4-blocks[x][y].biomNeighbors)==0 && blocks[x][y].type==0 && blocks[x][y].biomNeighbors>0)
			{
				blocks[x][y].biom=bog;
			}
		}
	}
}



//field biom
for(var i=0; i<15; i++)
{
	biomNeighbor(field);
	for(var x=0; x<mapSize; x++)
	{
		for(var y=0; y<mapSize; y++)
		{
			if(randomInterval(0,4-blocks[x][y].biomNeighbors)==0 && blocks[x][y].type==0 && blocks[x][y].biomNeighbors>0)
			{
				blocks[x][y].biom=field;
			}
		}
	}
}

//sand in desert, bog
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(blocks[x][y].biom==desert)
		{
			blocks[x][y].surface=sand;
		}
		if(blocks[x][y].biom==bog)
		{
			blocks[x][y].surface=bogSurface;
			if(randomInterval(0,5)==0)
			{
				blocks[x][y].type=1;
				blocks[x][y].surface=water;
			}
			if(randomInterval(0,5)==0)
			{
				blocks[x][y].type=0;
				blocks[x][y].surface=puddle;
			}
		}
	}
}


//resources
var trees = 3;
var cactuses = 8;
var stones = 10;
for(var x=0; x<mapSize; x++)
{
	for(var y=0; y<mapSize; y++)
	{
		if(((randomInterval(0,trees)==0 && blocks[x][y].biom==forest || randomInterval(0,trees*15)==0) && blocks[x][y].surface==grass) || randomInterval(0,trees*5)==0 && blocks[x][y].surface==bogSurface)
		{
			blocks[x][y].resource=tree;
		}
		if((randomInterval(0,4)==0 && blocks[x][y].biom==field || randomInterval(0,10)==0) && blocks[x][y].surface==grass)
		{
			blocks[x][y].resource=flower;
		}
		if(randomInterval(0,cactuses)==0 && blocks[x][y].biom==desert && blocks[x][y].surface==sand)
		{
			blocks[x][y].resource=cactus;
		}
		if(randomInterval(0,stones)==0 && blocks[x][y].biom==bog && blocks[x][y].surface==bogSurface)
		{
			blocks[x][y].resource=stone;
			blocks[x][y].type=1;
		}
	}
}

