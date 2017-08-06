import math
import pygame, sys
from pygame.locals import *
pygame.init()
screen = pygame.display.set_mode((15*50,15*50),pygame.RESIZABLE ,32)
pygame.display.set_caption("Window") 
fontColor = (255,0,0) 
bgColor = (0,0,0)
mainLoop = True

fullscreen = False

# classes ----------------------------------------------------------------
class Point:
    x = 0
    y = 0
    def __init__(self, x1, y1):
        self.x = x1
        self.y = y1


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
        for platform in platforms:
            for point in self.boxPoints:
                    if self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+platform.fY+1+point.y>platform.y and self.y+platform.fY+1+point.y<platform.y+platform.sizeY:
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
            if map.blocks[x*map.sizeX+y].type==1:
                return True
            for platform in platforms:
                if self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+point.y>platform.y and self.y+point.y<platform.y+platform.sizeY:
                    return True
        return False
    def touch(self):
        self.groundFX = 0
        for point in self.boxPoints:
            x = self.cell(self.x + point.x)
            y = self.cell(self.y + point.y)
            if map.blocks[x*map.sizeX+y].type==1:
                return True
    def draw(self):
        pygame.draw.rect(screen, self.color, ((self.x-30-cam.x)*cam.scale, (self.y-30-cam.y)*cam.scale, 60*cam.scale, 60*cam.scale))
        return 0

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
class Block:
    type = 0
    color = (200,200,200)
    light = 0
    def __init__(self, type):
        self.type = type
class Platform:
    x = 0
    y = 0
    fX = 5
    fY = 0
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

class Map:
    sizeX = 200
    sizeY = 200
    blocks = []
    spawnPoint = Point(0, 0)
    def __init__(self, sizeX1, sizeY1, spawnX, spawnY):
        self.sizeX = sizeX1
        self.sizeY = sizeY1
        self.spawnPoint.x = spawnX
        self.spawnPoint.y = spawnY
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
    def setBlock(self, x, y, type):
        self.blocks[x*self.sizeX+y].type = type
    def save(self, name):
        file = open("levels/"+name, "w")
        text = str(self.sizeX) + "#" + str(self.sizeY) + "#"
        for block in self.blocks:
            text += str(block.type)
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
            if letter=="#":
                phase += 1
            elif phase==0:
                sizeX += letter
            elif phase==1:
                sizeY += letter
            else:   
                self.blocks.append(Block(int(letter)))
                counter += 1
        self.sizeX = int(sizeX)
        self.sizeY = int(sizeY)
class LightBlock:
    light = 0
    neighbors = 0
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
                if self.blocks[ (x-1) *map.sizeX + (y) ].light>0 or \
                   self.blocks[ (x+1) *map.sizeX + (y) ].light>0 or \
                   self.blocks[ (x) *map.sizeX + (y-1) ].light>0 or \
                   self.blocks[ (x) *map.sizeX + (y+1) ].light>0:
                    self.blocks[(x) *map.sizeX + (y)].neighbors = True
                else:
                    self.blocks[(x)*map.sizeX + (y)].neighbors = False
    def lightStep(self):
        for x in range(self.startPoint.x, self.endPoint.x):
            for y in range(self.startPoint.y, self.endPoint.y):
                if self.blocks[x*map.sizeX + y].neighbors and map.blocks[ (x) *map.sizeX + (y) ].type==0:
                    light = self.blocks[x*map.sizeX + y].light
                    if self.blocks[ (x-1) *map.sizeX + (y) ].light > light: # and map.blocks[ (x-1) *map.sizeX + (y-1) ].type==0:
                        self.blocks[x*map.sizeX + y].light = self.blocks[ (x-1) *map.sizeX + (y) ].light - 1
                    if self.blocks[ (x+1) *map.sizeX + (y) ].light > light: # and map.blocks[ (x-1) *map.sizeX + (y+1) ].type==0:
                        self.blocks[x*map.sizeX + y].light = self.blocks[ (x+1) *map.sizeX + (y) ].light - 1
                    if self.blocks[ (x) *map.sizeX + (y-1) ].light > light: # and map.blocks[ (x+1) *map.sizeX + (y-1) ].type==0:
                        self.blocks[x*map.sizeX + y].light = self.blocks[ (x) *map.sizeX + (y-1) ].light - 1
                    if self.blocks[ (x) *map.sizeX + (y+1) ].light > light: # and map.blocks[ (x+1) *map.sizeX + (y+1) ].type==0:
                        self.blocks[x*map.sizeX + y].light = self.blocks[ (x) *map.sizeX + (y+1) ].light - 1
    def setLight(self):
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
        
        for block in self.blocks:
            block.light = 0
        self.blocks[myPlayer.cell(myPlayer.x)*map.sizeX + myPlayer.cell(myPlayer.y)].light = self.power
        #print("start")
        for i in range(self.power):
            timeNow = pygame.time.get_ticks()
            #print("1 " + str(timeNow))
            self.setNeighbors()
            timeNow = pygame.time.get_ticks()
            #print("2 " + str(timeNow))
            self.lightStep()
        #print("end")

class Key:
    left = 0
    right = 0
    up = 0
    down = 0

class Mouse:
    x = 0
    y = 0
    down = 0
    def set(self):
        (self.x, self.y) = pygame.mouse.get_pos()
class Window:
    height = 0
    width = 0
    def __init__(self):
        self.getSize()
    def getSize(self):
        (self.width, self.height) = pygame.display.get_surface().get_size()
# consts ----------------------------------------------------------------
# for blocks
AIR = 0
GROUND = 1

# varaibles ----------------------------------------------------------------
gravity = 5
keys = Key()
myPlayer = Player()
cam = Camera(0,0,1)
mouse = Mouse()
window = Window()
blockSize = 100
map = Map(100,100,5*blockSize,5*blockSize)
map.start()
map.load("level.l")
lightMap = Light()
platforms = []
platforms.append(Platform(150, 700, 200, 200))


# functions ----------------------------------------------------------------
frames = 0
start = 0
end = 0
# main function 
def main():
    timeNow = pygame.time.get_ticks()
    window.getSize()
    global frames
    global start
    end = timeNow
    if end-start>=1000:
        print(frames)
        frames = 0
        start = timeNow
    if timeNow%20==0:
        #print("1 " + str(timeNow))
        play()
        timeNow = pygame.time.get_ticks()
        #print("2 " + str(timeNow))
        draw()
        timeNow = pygame.time.get_ticks()
        #print("3 " + str(timeNow))
        lightMap.setLight()
        frames+=1
    pygame.time.wait(1)
# play 
def play():
    for i in range(map.sizeX*map.sizeY):
        l = lightMap.blocks[i].light
        map.blocks[i].color = (l*15, l*13, 0)
    for platform in platforms:
        platform.move()
    if mouse.down:
        map.setBlock(myPlayer.cell(cam.x+mouse.x/cam.scale), myPlayer.cell(cam.y+mouse.y/cam.scale), 1)
    
    cam.move()
    myPlayer.move()
    return 0
# events 
def checkEvents():
    global mouse
    global keys
    global fullscreen

    mouse.set()
    for event in pygame.event.get():
        if event.type==MOUSEBUTTONDOWN:
            mouse.down = True
        if event.type==MOUSEBUTTONUP:
            mouse.down = False
        if event.type==KEYDOWN:
            if event.key==K_RIGHT:
                keys.right = True
            if event.key==K_LEFT:
                keys.left = True
            if event.key==K_UP:
                keys.up = True
            if event.key==K_TAB:
                map.save("level.l")
            if event.key==K_F11:
                if fullscreen:
                    screen = pygame.display.set_mode((15*50,15*50),pygame.RESIZABLE ,32)
                else:
                    screen = pygame.display.set_mode((1600,900),pygame.FULLSCREEN,32)
                fullscreen = not fullscreen
        if event.type==KEYUP:
            if event.key==K_RIGHT:
                keys.right = False
            if event.key==K_LEFT:
                keys.left = False
            if event.key==K_UP:
                keys.up = False
            if event.key == K_ESCAPE: 
                mainLoop = False
        if event.type == QUIT: 
            mainLoop = False
            pygame.quit()
        if event.type==VIDEORESIZE:
            screen=pygame.display.set_mode(event.dict['size'],HWSURFACE|DOUBLEBUF|RESIZABLE)
            #screen.blit(pygame.transform.scale(pic,event.dict['size']),(0,0))
            pygame.display.flip()
# draw 
def draw():
    screen.fill(bgColor)
    for x in range(lightMap.startPoint.x, lightMap.endPoint.x):
            for y in range(lightMap.startPoint.y, lightMap.endPoint.y):
                #if map.blocks[x*map.sizeX+y].type == 1:
                    pygame.draw.rect(screen, map.blocks[x*map.sizeX+y].color, ((x*blockSize-cam.x)*cam.scale, (y*blockSize-cam.y)*cam.scale, blockSize*cam.scale, blockSize*cam.scale))
    for platform in platforms:
        platform.draw()
    myPlayer.draw()
    pygame.display.update()
# main loop 
while mainLoop: 
    checkEvents()
    main()
   
pygame.quit()