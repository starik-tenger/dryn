//model--------------------------------------------------------------------------------------------------------------------------------
var blockSize = 1000;
var sizeX = 61;
var sizeY = 61;

function setCube(x,y,z)
{

	
	setPolygon(0+x*blockSize,0+y*blockSize,0+z*blockSize,blockSize+x*blockSize,0+y*blockSize,0+z*blockSize,0+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"yellow");
	setPolygon(blockSize+x*blockSize,blockSize+y*blockSize,0+z*blockSize,blockSize+x*blockSize,0+y*blockSize,0+z*blockSize,0+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"yellow");
	setPolygon(0+x*blockSize,0+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,0+y*blockSize,blockSize+z*blockSize,0+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,"green");
	setPolygon(blockSize+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,0+y*blockSize,blockSize+z*blockSize,0+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,"green");
	
	setPolygon(0+x*blockSize,0+y*blockSize,0+z*blockSize,0+x*blockSize,0+y*blockSize,blockSize+z*blockSize,0+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"blue");
	setPolygon(x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,0+x*blockSize,0+y*blockSize,blockSize+z*blockSize,0+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"blue");
	setPolygon(blockSize+x*blockSize,0+y*blockSize,0+z*blockSize,blockSize+x*blockSize,0+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"red");
	setPolygon(blockSize+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,0+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,blockSize+y*blockSize,0+z*blockSize,"red");
	
	setPolygon(0+x*blockSize,0+y*blockSize,0+z*blockSize,0+x*blockSize,0+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,0+y*blockSize,z,"black");
	setPolygon(blockSize+x*blockSize,0+y*blockSize,blockSize+z*blockSize,0+x*blockSize,0+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,0+y*blockSize,z,"black");
	setPolygon(0+x*blockSize,blockSize+y*blockSize,0+z*blockSize,0+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,blockSize+y*blockSize,z,"white");
	setPolygon(blockSize+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,0+x*blockSize,blockSize+y*blockSize,blockSize+z*blockSize,blockSize+x*blockSize,blockSize+y*blockSize,z,"white");
}



function setConus(x,y,z)
{
	var size = -blockSize;
	var d = z;
	setPolygon(0+x,y,0+d,blockSize+x,y,0+d,500+x,size+y,500+d,"red");
	setPolygon(blockSize+x,y,blockSize+d,blockSize+x,y,0+d,500+x,size+y,500+d,"yellow");
	setPolygon(0+x,y,0+d,0+x,y,blockSize+d,500+x,size+y,500+d,"blue");
	setPolygon(0+x,y,blockSize+d,blockSize+x,y,blockSize+d,500+x,size+y,500+d,"green");
}

function setTetragon(
	x1, y1, z1,
	x2, y2, z2, 
	x3, y3, z3, 
	x4, y4, z4,
	color)
{
	setPolygon(x1, y1, z1, x2, y2, z2, x3, y3, z3, color);
	setPolygon(x1, y1, z1, x4, y4, z4, x3, y3, z3, color);
	
	//etPolygon(x1, y1, z1, x2, y2, z2, x4, y4, z4, color);
	//setPolygon(x2, y2, z2, x4, y4, z4, x3, y3, z3, color);
}

var mapSize=100;
var modelDistance = 10;

function cell()
{
	var x = Math.round(cam.x/blockSize);
	var y = Math.round(cam.y/blockSize);
	var z = Math.round(cam.z/blockSize);
	return {x, y, z};
}

function model()
{
	polygons=[];
	var p = cell();
	for (var x = p.x - modelDistance; x < p.x + modelDistance; x++)
	{
		//for (var y = p.y - modelDistance; y < p.y + modelDistance; y++)
		for(var y=0; y<100; y++)
		{
			for (var z = p.z - modelDistance; z < p.z + modelDistance; z++)
			{
				
				if(x>0 && y>0 && z>0 && x<mapSize && y<mapSize && z<mapSize &&  blocks[x][y][z]==1)
				{
					if((x+1 < mapSize && x+1 > 0 && blocks[x+1][y][z]==0 || x==mapSize-1) && x < p.x)
					{
						setTetragon(
						(x+1)*blockSize, (y)*blockSize, (z)*blockSize, 
						(x+1)*blockSize, (y)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z)*blockSize,
						"yellow");
					}
					if((y+1 < mapSize && y+1 > 0 && blocks[x][y+1][z]==0 || y==mapSize-1) && y < p.y)
					{
						setTetragon(
						(x)*blockSize,   (y+1)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z)*blockSize, 
						(x)*blockSize,   (y+1)*blockSize, (z)*blockSize,
						"brown");
					}
					if((z+1 < mapSize && z+1 > 0 &&  blocks[x][y][z+1]==0 || z==mapSize-1) && z < p.z)
					{
						setTetragon(
						(x)*blockSize,   (y)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y)*blockSize, (z+1)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z+1)*blockSize, 
						(x)*blockSize,   (y+1)*blockSize, (z+1)*blockSize,
						"black");
					}
					if((x-1 < mapSize && x-1 > 0 && blocks[x-1][y][z]==0 || x==1) && x > p.x)
					{
						setTetragon(
						(x)*blockSize, (y)*blockSize, (z)*blockSize, 
						(x)*blockSize, (y)*blockSize, (z+1)*blockSize, 
						(x)*blockSize, (y+1)*blockSize, (z+1)*blockSize, 
						(x)*blockSize, (y+1)*blockSize, (z)*blockSize,
						"yellow");
					}
					if((y-1 < mapSize && y-1 > 0 && blocks[x][y-1][z]==0 || y==1) && y > p.y)
					{
						setTetragon(
						(x)*blockSize,   (y)*blockSize, (z)*blockSize, 
						(x+1)*blockSize, (y)*blockSize, (z)*blockSize, 
						(x+1)*blockSize, (y)*blockSize, (z+1)*blockSize, 
						(x)*blockSize,   (y)*blockSize, (z+1)*blockSize,
						"brown");
					}
					if((z-1 < mapSize && z-1 > 0 && blocks[x][y][z-1]==0 || z==1) && z > p.z)
					{
						setTetragon(
						(x)*blockSize, (y)*blockSize, (z)*blockSize, 
						(x+1)*blockSize, (y)*blockSize, (z)*blockSize, 
						(x+1)*blockSize, (y+1)*blockSize, (z)*blockSize, 
						(x)*blockSize, (y+1)*blockSize, (z)*blockSize,
						"black");
					}
					//setConus(x,y,z);
					
				}
			}
		}
	}
}