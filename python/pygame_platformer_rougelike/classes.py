import pygame, sys
from pygame.locals import *

# classes ----------------------------------------------------------------
class Point:
    x = 0
    y = 0
    def __init__(self, x1, y1):
        self.x = x1
        self.y = y1
#
class Player:
    x = 30
    y = 30
    speed = 50
    color = (255,255,100)
    fX = 0
    fY = 0
    groundFX = 0
    groundFY = 0
    onCeiling = False
    onGround = False
    boxPoints = [Point(-30,30), Point(30,30), Point(-30,-30), Point(30,-30)]
    def move(self):
        self.control()
        global gravity
        self.fY += gravity
        for platform in map.platforms:
            for point in self.boxPoints:
                    if self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+platform.fY+1+point.y>platform.y and self.y+platform.fY+1+point.y<platform.y+platform.sizeY:
                        for i in range(int(math.fabs(platform.fX)+1)):
                            if not self.touch():
                                if platform.fX>0:
                                    self.x += 1
                                if platform.fX<0:
                                    self.x -= 1
                        if platform.fX>0:
                            self.x -= 1
                        elif platform.fX<0:
                            self.x += 1
                        for i in range(int(math.fabs(platform.fY)+1)):
                            if not self.touch():
                                if platform.fY>0:
                                    self.y += 1
                                if platform.fY<0:
                                    self.y -= 1
                        if platform.fY>0:
                            self.y -= 1
                        elif platform.fY<0:
                            self.y += 1
                        break
                    if self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+point.y>platform.y and self.y+point.y<platform.y+platform.sizeY:
                        for i in range(int(math.fabs(platform.fX+1))):
                            if not self.touch():
                                if platform.fX>0:
                                    self.x += 1
                                if platform.fX<0:
                                    self.x -= 1
                        if platform.fX>0:
                            self.x -= 1
                        elif platform.fX<0:
                            self.x += 1
                        for i in range(int(math.fabs(platform.fY+1))):
                            if not self.touch():
                                if platform.fY>0:
                                    self.y += 1
                                if platform.fY<0:
                                    self.y -= 1
                        if platform.fY>0:
                            self.y -= 1
                        elif platform.fY<0:
                            self.y += 1
                        break


        for i in range(int(math.fabs(self.fY+self.groundFY))):
            if not self.inBlock():
                if self.fY>0:
                    self.y += 1
                    self.onSeiling = False
                else:
                    self.y -= 1
                self.onGround = False
            elif self.fY>0:
                self.onGround = True
                break
            elif self.fY<0:
                self.onSeiling = True
                break
        if self.fY>0:
            self.y -= 1
        elif self.fY<0:
            self.y += 1
        if self.onGround or self.onSeiling:
            self.fY = 0
        for i in range(int(math.fabs(self.fX+self.groundFX))):
            if not self.inBlock():
                if self.fX+self.groundFX>0:
                    self.x += 1
                else:
                    self.x -= 1
        if self.fX+self.groundFX>0:
            self.x -= 1
        elif self.fX+self.groundFX<0:
            self.x += 1
        return 0
    def control(self):
        if keys.right:
            self.fX += 5
        if keys.left:
            self.fX -= 5
        if self.fX > self.speed:
            self.fX = self.speed
        if self.fX < -self.speed:
            self.fX = -self.speed
        if not keys.right and not keys.left:
            self.fX = 0
        if keys.up and self.onGround:
            self.fY = -100
    def cell(self, n):
        return int(math.floor(n/blockSize))
    def inBlock(self):
        self.groundFX = 0
        for point in self.boxPoints:
            x = self.cell(self.x + point.x)
            y = self.cell(self.y + point.y)
            if map.blocks[y*map.sizeX+x].type==1:
                return True
            for platform in map.platforms:
                if self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+point.y>platform.y and self.y+point.y<platform.y+platform.sizeY:
                    return True
        return False
    def touch(self):
        self.groundFX = 0
        for point in self.boxPoints:
            x = self.cell(self.x + point.x)
            y = self.cell(self.y + point.y)
            if map.blocks[y*map.sizeX+x].type==1:
                return True
    def checkDoors(self):
        for door in map.doors:
            if door.enter(self):
                break
    def draw(self):
        pygame.draw.rect(screen, self.color, ((self.x-30-cam.x)*cam.scale, (self.y-30-cam.y)*cam.scale, 60*cam.scale, 60*cam.scale))
        return 0
#
class Camera:
    x = 0
    y = 0
    scale = 0.5
    centerX = 375
    centerY = 375
    def __init__(self, x1, y1, scale1):
        self.x = x1
        self.y = y1
        self.scasle = scale1
    def move(self):
        self.centerX = (window.width/2)/self.scale
        self.centerY = (window.height/2)/self.scale
        self.x += (myPlayer.x-self.centerX-self.x)/10
        self.y += (myPlayer.y-self.centerY-self.y)/10
#
class Block:
    type = 0
    color = (200,200,200)
    light = 0
    def __init__(self, type):
        self.type = type
#
class Platform:
    x = 0
    y = 0
    fX = 5
    fY = -1
    sizeX = 0
    sizeY = 0
    def __init__(self, x, y, sizeX,  sizeY):
        self.x = x
        self.y = y
        self.sizeX = sizeX
        self.sizeY = sizeY
    def move(self):
        self.x += self.fX
        self.y += self.fY
                    
    def draw(self):
        pygame.draw.rect(screen, (0,0,0), ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale, self.sizeX*cam.scale, self.sizeY*cam.scale))
#
class Door:
    x = 0
    y = 0
    endX = 0
    endY = 0
    sizeX = 0
    sizeY = 0
    def __init__(self, x, y, endX, endY):
        self.x = x
        self.y = y
        self.sizeX = blockSize
        self.sizeY = blockSize*2
        self.endX = endX
        self.endY = endY
    def enter(self, entity):
        if entity.x>self.x and entity.x<self.x+self.sizeX and entity.y>self.y and entity.y<self.y+self.sizeY:
            entity.x = self.endX+self.sizeX/2
            entity.y = self.endY+self.sizeY/2
            return True
        return False
    def draw(self):
        global image_door
        global screen
        x = myPlayer.cell(self.x+self.sizeX/2)
        y = myPlayer.cell(self.y+self.sizeY/2)
        light = map.lightMap.blocks[y*map.sizeX+x]
        #pygame.draw.rect(screen, (0,0,0), ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale, self.sizeX*cam.scale, self.sizeY*cam.scale))
        image_door = pygame.transform.scale(image_door, (int(self.sizeX*cam.scale), int(self.sizeY*cam.scale)))
        image_door = setAlpha(image_door, 255, (0,255,0))
        screen.blit(image_door, ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale))
#
class Map:
    sizeX = 200
    sizeY = 200
    blocks = []
    platforms = []
    doors = []
    lightMap = 0
    spawnPoint = Point(0, 0)
    loop = 0
    setup = 0
    def __init__(self, sizeX1, sizeY1, spawnX, spawnY, setup, loop):
        self.sizeX = sizeX1
        self.sizeY = sizeY1
        self.spawnPoint.x = spawnX
        self.spawnPoint.y = spawnY
        #self.lightMap = Light()
        self.setup = setup
        self.loop = loop
        self.create()
    def create(self):
        for x in range(self.sizeX):
            for y in range(self.sizeY):
                newBlock = Block(0)
                if x==0 or y==0 or x==self.sizeX-1 or y==self.sizeY-1:
                    newBlock.type = 1
                else:
                    newBlock.type = 0
                self.blocks.append(newBlock)
    def start(self):
        myPlayer.x = self.spawnPoint.x
        myPlayer.y = self.spawnPoint.y
        self.setup(self)
    def setBlock(self, x, y, type):
        self.blocks[y*self.sizeX+x].type = type
    def setDoor(self, x, y, endX, endY):
        self.doors.append(Door(x, y, endX, endY))
    def setPairDoors(self, x, y, x1, y1):
        self.doors.append(Door(x, y, x1, y1))
        self.doors.append(Door(x1, y1, x, y))
    def save(self, name):
        file = open("levels/"+name, "w")
        text = str(self.sizeX) + "#" + str(self.sizeY) + "#\n"
        counter = 0
        for block in self.blocks:
            if block.type==1:
                text += "X"
            else:
                text += " "
            if counter%self.sizeX == 0:
                text += "\n"
            counter+=1
        file.write(text)
        file.close()
    def load(self, name):
        file = open("levels/"+name, "r")
        text = file.read()
        file.close()
        self.blocks = []
        text = list(text)
        sizeX = ""
        sizeY = ""
        counter = 0
        phase = 0
        for letter in text:
            if letter!="\n":
                if letter=="#":
                    phase += 1
                elif phase==0:
                    sizeX += letter
                elif phase==1:
                    sizeY += letter
                else:   
                    if letter == "X":
                        self.blocks.append(Block(1))
                    else:
                        self.blocks.append(Block(0))
                    counter += 1
        self.sizeX = int(sizeX)
        self.sizeY = int(sizeY)


#
class Level:
    levelMap = []

    def setup(self):
        return 0
#
class LightBlock:
    light = 0
    neighbors = 0
#
class Light:
    blocks = []
    power = 12
    startPoint = Point(0,0)
    endPoint = Point(0,0)
    def __init__(self):
        for x in range(map.sizeX):
            for y in range(map.sizeY):
                self.blocks.append(LightBlock())
    def setNeighbors(self):
        for x in range(self.startPoint.x, self.endPoint.x):
            for y in range(self.startPoint.y, self.endPoint.y):
                #print((x+1) *map.sizeX + y)
                if self.blocks[ (y-1) *map.sizeX + (x) ].light>0 or \
                   self.blocks[ (y+1) *map.sizeX + (x) ].light>0 or \
                   self.blocks[ (y) *map.sizeX + (x-1) ].light>0 or \
                   self.blocks[ (y) *map.sizeX + (x+1) ].light>0:
                    self.blocks[(y) *map.sizeX + (x)].neighbors = True
                else:
                    self.blocks[(y)*map.sizeX + (x)].neighbors = False
    def lightStep(self):
        for x in range(self.startPoint.x, self.endPoint.x):
            for y in range(self.startPoint.y, self.endPoint.y):
                if self.blocks[y*map.sizeX + x].neighbors and map.blocks[ (y) *map.sizeX + (x) ].type==0:
                    light = self.blocks[y*map.sizeX + x].light
                    if self.blocks[ (y-1) *map.sizeX + (x) ].light > light: # and map.blocks[ (y-1) *map.sizeX + (x-1) ].type==0:
                        self.blocks[y*map.sizeX + x].light = self.blocks[ (y-1) *map.sizeX + (x) ].light - 1
                    if self.blocks[ (y+1) *map.sizeX + (x) ].light > light: # and map.blocks[ (y-1) *map.sizeX + (x+1) ].type==0:
                        self.blocks[y*map.sizeX + x].light = self.blocks[ (y+1) *map.sizeX + (x) ].light - 1
                    if self.blocks[ (y) *map.sizeX + (x-1) ].light > light: # and map.blocks[ (y+1) *map.sizeX + (x-1) ].type==0:
                        self.blocks[y*map.sizeX + x].light = self.blocks[ (y) *map.sizeX + (x-1) ].light - 1
                    if self.blocks[ (y) *map.sizeX + (x+1) ].light > light: # and map.blocks[ (y+1) *map.sizeX + (x+1) ].type==0:
                        self.blocks[y*map.sizeX + x].light = self.blocks[ (y) *map.sizeX + (x+1) ].light - 1
    def border(self):
        self.startPoint = Point(myPlayer.cell(myPlayer.x)-self.power, myPlayer.cell(myPlayer.y)-self.power)
        self.endPoint = Point(myPlayer.cell(myPlayer.x)+self.power, myPlayer.cell(myPlayer.y)+self.power)
        if self.startPoint.x<1:
            self.startPoint.x = 1
        if self.endPoint.x>map.sizeX-1:
            self.endPoint.x = map.sizeX-1
        if self.startPoint.y<1:
            self.startPoint.y = 1
        if self.endPoint.y>map.sizeY-1:
            self.endPoint.y = map.sizeY-1
    def setLight(self):
        self.border()
        
        for block in self.blocks:
            block.light = 0
        self.blocks[myPlayer.cell(myPlayer.y)*map.sizeX + myPlayer.cell(myPlayer.x)].light = self.power
        #print("start")
        for i in range(self.power):
            timeNow = pygame.time.get_ticks()
            #print("1 " + str(timeNow))
            self.setNeighbors()
            timeNow = pygame.time.get_ticks()
            #print("2 " + str(timeNow))
            self.lightStep()
        #print("end")
        for x in range(self.startPoint.x, self.endPoint.x):
            for y in range(self.startPoint.y, self.endPoint.y):
                if self.blocks[y*map.sizeX + x].neighbors and map.blocks[ (y) *map.sizeX + (x) ].type==0:
                    light = self.blocks[y*map.sizeX + x].light
                    if self.blocks[ (y-1) *map.sizeX + (x) ].light < light and map.blocks[ (y-1) *map.sizeX + (x) ].type==1: 
                        self.blocks[ (y-1) *map.sizeX + (x) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y+1) *map.sizeX + (x) ].light < light and map.blocks[ (y+1) *map.sizeX + (x) ].type==1: 
                        self.blocks[ (y+1) *map.sizeX + (x) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y) *map.sizeX + (x-1) ].light < light and map.blocks[ (y) *map.sizeX + (x-1) ].type==1: 
                        self.blocks[ (y) *map.sizeX + (x-1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y) *map.sizeX + (x+1) ].light < light and map.blocks[ (y) *map.sizeX + (x+1) ].type==1: 
                        self.blocks[ (y) *map.sizeX + (x+1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y-1) *map.sizeX + (x-1) ].light < light and map.blocks[ (y-1) *map.sizeX + (x-1) ].type==1: 
                        self.blocks[ (y-1) *map.sizeX + (x-1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y+1) *map.sizeX + (x+1) ].light < light and map.blocks[ (y+1) *map.sizeX + (x+1) ].type==1: 
                        self.blocks[ (y+1) *map.sizeX + (x+1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y+1) *map.sizeX + (x-1) ].light < light and map.blocks[ (y+1) *map.sizeX + (x-1) ].type==1: 
                        self.blocks[ (y+1) *map.sizeX + (x-1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    if self.blocks[ (y-1) *map.sizeX + (x+1) ].light < light and map.blocks[ (y-1) *map.sizeX + (x+1) ].type==1: 
                        self.blocks[ (y-1) *map.sizeX + (x+1) ].light  = self.blocks[y*map.sizeX + x].light - 1
                    
                    
#
class Key:
    left = 0
    right = 0
    up = 0
    down = 0
#
class Mouse:
    x = 0
    y = 0
    down = 0
    def set(self):
        (self.x, self.y) = pygame.mouse.get_pos()
#
class Window:
    height = 0
    width = 0
    def __init__(self):
        self.getSize()
    def getSize(self):
        (self.width, self.height) = pygame.display.get_surface().get_size()
