import math
import pygame, sys
from pygame.locals import *

pygame.init()
screen = pygame.display.set_mode((15*50,15*50),pygame.RESIZABLE ,32)
pygame.display.set_caption("Window") 
fontColor = (255,0,0) 
bgColor = (200,200,0)
mainLoop = True

fullscreen = False

# sounds ----------------------------------------------------------------
#pygame.mixer.music.load("sounds/booooo.wav")
#pygame.mixer.music.play()

# images ----------------------------------------------------------------
image_door = pygame.image.load("textures/door.png").convert_alpha()
image_door_closed = pygame.image.load("textures/door_closed.png").convert_alpha()
image_block = pygame.image.load("textures/stone1.png").convert_alpha()
image_wall = pygame.image.load("textures/stone_wall.png").convert_alpha()
image_spikes = pygame.image.load("textures/spikes.png").convert_alpha()
image_lever = pygame.image.load("textures/lever.png").convert_alpha()
image_lever_pushed = pygame.image.load("textures/lever_pushed.png").convert_alpha()


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
    onLeft = False
    onRight = False
    sizeX = 60
    sizeY = 60
    boxPoints = [Point(-sizeX/2,sizeY/2), Point(sizeX/2,sizeY/2), Point(-sizeX/2,-sizeY/2), Point(sizeX/2,-sizeY/2)]

    #DO NOT TOUCH moveByPlatform() and move() functions!!!!!!
    def moveByPlatform(self):
        for platform in map.platforms:
            for point in self.boxPoints:
                    if self.x+platform.fX+point.x>platform.x and self.x+platform.fX+point.x<platform.x+platform.sizeX and self.y+platform.fY+1+point.y>platform.y and self.y+platform.fY+1+point.y<platform.y+platform.sizeY or \
                    self.x+point.x>platform.x and self.x+point.x<platform.x+platform.sizeX and self.y+point.y>platform.y and self.y+point.y<platform.y+platform.sizeY:
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
    def move(self):
        self.control()
        global gravity
        self.fY += gravity
        
        self.moveByPlatform()

        for i in range(int(math.fabs(self.fY))):
            if not self.inBlock():
                if self.fY>0:
                    self.y += 1
                    self.onCeiling = False
                else:
                    self.y -= 1
                self.onGround = False
            elif self.fY>0:
                self.onGround = True
                break
            elif self.fY<0:
                self.onCeiling = True
                break
        if self.fY>0:
            self.y -= 1
        elif self.fY<0:
            self.y += 1
        if self.onGround or self.onCeiling:
            self.fY = 0
        for i in range(int(math.fabs(self.fX))):
            if not self.inBlock():
                if self.fX>0:
                    self.x += 1
                elif self.fX<0:
                    self.x -= 1
                self.onRight = False
                self.onLeft = False
            elif self.fX>0:
                self.onRight = True
                break
            elif self.fX<0:
                self.onLeft = True
                break
        if self.fX>0:
            self.x -= 1
        elif self.fX<0:
            self.x += 1

        return 0
    def control(self):
        if self.blockDanger() and self.onGround:
            self.die()

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
    def cellOffset(self, n):
        n = float(n)
        return n/blockSize-math.floor(n/blockSize)
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
    def blockDanger(self):
        return map.blocks[self.cell(self.y)*map.sizeX+self.cell(self.x)].danger
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
    def checkButtons(self):
        for button in map.buttons:
            if button.click(self):
                break
    def die(self):
        levels[level].start()
    def draw(self):
        pygame.draw.rect(screen, self.color, ((self.x-30-cam.x)*cam.scale, (self.y-30-cam.y)*cam.scale, 60*cam.scale, 60*cam.scale))
        return 0
#
class Monster(Player):
    def __init__(self, x, y, type):
        self.x = x
        self.y = y
        self.type = type
        self.direction = RIGHT
        self.speed = 50
    def control(self):
        if self.type == GUARDIAN:
            if self.direction==RIGHT:
                self.fX = self.speed
            else:
                self.fX = -self.speed
            if self.onLeft:
                self.direction=RIGHT
            elif self.onRight:
                self.direction=LEFT
    #def touch

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
    danger = 0
    color = (200,200,200)
    light = 0
    def __init__(self, type):
        self.type = type
#
class Platform:
    x = 0
    y = 0
    fX = 0
    fY = 0
    sizeX = 0
    sizeY = 0
    loop = 0
    def __init__(self, x, y, sizeX,  sizeY, setup, loop):
        self.x = x
        self.y = y
        self.sizeX = sizeX
        self.sizeY = sizeY
        self.loop = loop
        setup(self)
    def move(self):
        self.loop(self)
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
    closed = True
    def __init__(self, x, y, endX, endY, closed):
        self.x = x
        self.y = y
        self.sizeX = blockSize
        self.sizeY = blockSize*2
        self.endX = endX
        self.endY = endY
        self.closed = closed
    def enter(self, entity):
        if not self.closed and entity.x>self.x and entity.x<self.x+self.sizeX and entity.y>self.y and entity.y<self.y+self.sizeY:
            entity.x = self.endX+self.sizeX/2
            entity.y = self.endY+self.sizeY/2
            return True
        return False
    def draw(self):
        global image_door
        global image_door_closed
        global screen
        img = image_door
        if self.closed:
            img = image_door_closed
        x = myPlayer.cell(self.x+self.sizeX/2)
        y = myPlayer.cell(self.y+self.sizeY/2)
        light = map.lightMap.blocks[y*map.sizeX+x]
        #pygame.draw.rect(screen, (0,0,0), ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale, self.sizeX*cam.scale, self.sizeY*cam.scale))
        img = pygame.transform.scale(img, (int(self.sizeX*cam.scale), int(self.sizeY*cam.scale)))
        screen.blit(img, ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale))

#
class Button:
    x = 0
    y = 0
    sizeX = 0
    sizeY = 0
    pushed = False
    signal = 0


    def __init__(self, x, y, signal):
        self.sizeX = blockSize
        self.sizeY = blockSize
        self.x = x
        self.y = y
        self.signal = signal

    def click(self, entity):
        if not self.pushed and entity.x>self.x and entity.x<self.x+self.sizeX and entity.y>self.y and entity.y<self.y+self.sizeY:
            self.pushed = True
            map.signal = self.signal

    def draw(self):
        global image_lever
        global screen
        img = image_lever
        if self.pushed:
            img = image_lever_pushed
        img = pygame.transform.scale(img, (int(self.sizeX*cam.scale), int(self.sizeY*cam.scale)))
        screen.blit(img, ((self.x-cam.x)*cam.scale, (self.y-cam.y)*cam.scale))

#
class Map:
    sizeX = 200
    sizeY = 200
    blocks = []
    platforms = []
    monsters = []
    doors = []
    buttons = []
    lightMap = 0
    spawnPoint = Point(0, 0)
    loop = 0
    setup = 0
    signal = 0
    def __init__(self, sizeX1, sizeY1, spawnX, spawnY, setup, loop):
        self.platforms = []
        self.monsters = []
        self.doors = []
        self.buttons = []
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
        self.platforms = []
        self.monsters = []
        self.doors = []
        self.buttons = []
        self.lightMap = Light()
        self.setup(self)
    def setBlock(self, x, y, type):
        self.blocks[y*self.sizeX+x].type = type
    def setPlatform(self, x, y, sizeX, sizeY, setup, loop):
        self.platforms.append(Platform(x, y, sizeX, sizeY, setup, loop))
    def setButton(self, x, y, function):
        self.buttons.append(Button(x, y, function))
    def setDoor(self, x, y, endX, endY):
        self.doors.append(Door(x, y, endX, endY))
    def setPairDoors(self, x, y, x1, y1, close):
        self.doors.append(Door(x, y, x1, y1, close))
        self.doors.append(Door(x1, y1, x, y, close))
    def setMonster(self, x, y, type):
        self.monsters.append(Monster(x, y, type))
    def save(self, name):
        file = open("levels/"+name, "w")
        text = str(self.sizeX) + "#" + str(self.sizeY) + "#\n"
        counter = 0
        for block in self.blocks:
            if block.type==1:
                text += "X"
            else:
                if block.danger:
                    text += "1"
                else:
                    text += " "
            if (counter+1)%self.sizeX == 0:
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
                    elif letter == "1":
                        newBlock = Block(0)
                        newBlock.danger = 1
                        self.blocks.append(newBlock)
                    else:
                        self.blocks.append(Block(0))
                    counter += 1
        self.sizeX = int(sizeX)
        self.sizeY = int(sizeY)



#
class LightBlock:
    light = 0
    neighbors = 0
#
class Light:
    blocks = []
    power = 10
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
        dcx = myPlayer.cellOffset(myPlayer.x)
        #print(dcx)
        dcy = myPlayer.cellOffset(myPlayer.y)
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
        # changing light values with offset inside cell for smooth color change
        for x in range(self.startPoint.x, self.endPoint.x):
            for y in range(self.startPoint.y, self.endPoint.y):
                #self.blocks[y*map.sizeX + x].light = 5
                if x>int(myPlayer.cell(myPlayer.x)+dcx*2-1):
                    if self.blocks[y*map.sizeX + x].light>0:
                        self.blocks[y*map.sizeX + x].light+=dcx
                else:
                    if self.blocks[y*map.sizeX + x].light>0:
                        self.blocks[y*map.sizeX + x].light+=1-dcx
                if y>int(myPlayer.cell(myPlayer.y)+dcy*2-1):
                    if self.blocks[y*map.sizeX + x].light>0:
                        self.blocks[y*map.sizeX + x].light+=dcy
                else:
                    if self.blocks[y*map.sizeX + x].light>0:
                        self.blocks[y*map.sizeX + x].light+=1-dcy

                if self.blocks[y*map.sizeX + x].light<0:
                        self.blocks[y*map.sizeX + x].light = 0
                if self.blocks[y*map.sizeX + x].light > self.power:
                        self.blocks[y*map.sizeX + x].light = self.power
                    

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
# consts ----------------------------------------------------------------
RIGHT = 1
LEFT = 0
# for blocks
AIR = 0
GROUND = 1
SPIKES = 2
# for exit
EXIT = 666
# monsters types
GUARDIAN = 0
HUNTER = 1


# varaibles ----------------------------------------------------------------
gravity = 5
level = 0
keys = Key()
myPlayer = Player()
cam = Camera(0,0,1)
mouse = Mouse()
window = Window()
blockSize = 100
# levels
levels = []
def startLevel(level):
    levels[level].start()
def makeLevels():
    def setup(self):
        self.setMonster(36*blockSize, 21*blockSize, GUARDIAN)
        self.load("level_1.l")
        self.setPairDoors(4*blockSize,4*blockSize,8*blockSize,4*blockSize,False)
        self.setPairDoors(21*blockSize,4*blockSize,22*blockSize,8*blockSize,False)
        self.setPairDoors(36*blockSize,5*blockSize,36*blockSize,13*blockSize,False)
        self.setPairDoors(47*blockSize,8*blockSize,26*blockSize,17*blockSize,True)
        self.setButton(35*blockSize, 18*blockSize,1)
    def loop(self):
        if self.signal == 1:
            self.doors[6].closed = False
            self.doors[7].closed = False
            self.signal = 0
        if self.signal == 2:
            myPlayer.die()
            self.signal = 0
        return 0
    levels.append(Map(100,100,5*blockSize,5*blockSize, setup, loop))
makeLevels()
map = levels[level]
map.start()

# functions ----------------------------------------------------------------
frames = 0
start = 0
end = 0
# main functions
def main():
    timeNow = pygame.time.get_ticks()
    window.getSize()
    global frames
    global start
    end = timeNow
    if end-start>=1000:
        #print(frames)
        frames = 0
        start = timeNow
    if timeNow%1==0:
        #print("1 " + str(timeNow))
        play()
        timeNow = pygame.time.get_ticks()
        #print("2 " + str(timeNow))
        draw()
        timeNow = pygame.time.get_ticks()
        #print("3 " + str(timeNow))
        map.lightMap.setLight()
        timeNow = pygame.time.get_ticks()
        #print("4 " + str(timeNow))
        frames+=1
    pygame.time.wait(1)
# play 
def play():
    for platform in map.platforms:
        platform.move()
    for monster in map.monsters:
        monster.control()
        monster.move()
    if mouse.down:
        map.setBlock(myPlayer.cell(cam.x+mouse.x/cam.scale), myPlayer.cell(cam.y+mouse.y/cam.scale), 1)
    myPlayer.move()
    map.loop(map)
    cam.move()
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
            if event.key==K_SPACE:
                myPlayer.checkDoors()
                myPlayer.checkButtons()
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
    global screen
    map.lightMap.border()
    screen.fill((0,0,0))
    
    global image_wall
    image_wall  = pygame.transform.scale(image_wall, (int(blockSize*cam.scale), int(blockSize*cam.scale)))
    global image_block 
    image_block  = pygame.transform.scale(image_block, (int(blockSize*cam.scale), int(blockSize*cam.scale)))
    global image_spikes
    image_spikes  = pygame.transform.scale(image_spikes, (int(blockSize*cam.scale), int(blockSize*cam.scale)))

    # draw blocks
    for x in range(map.lightMap.startPoint.x-1, map.lightMap.endPoint.x+1):
            for y in range(map.lightMap.startPoint.y-1, map.lightMap.endPoint.y+1):
                if map.blocks[y*map.sizeX+x].type == 1:
                    screen.blit(image_block, ((x*blockSize-cam.x)*cam.scale, (y*blockSize-cam.y)*cam.scale))
                else:
                    screen.blit(image_wall, ((x*blockSize-cam.x)*cam.scale, (y*blockSize-cam.y)*cam.scale))
                    if map.blocks[y*map.sizeX+x].danger == 1:
                        screen.blit(image_spikes, ((x*blockSize-cam.x)*cam.scale, (y*blockSize-cam.y)*cam.scale))
    
    # draw objects
    for door in map.doors:
        door.draw()

    for platform in map.platforms:
        platform.draw()

    for monster in map.monsters:
        monster.draw()

    myPlayer.draw()

    for button in map.buttons:
        button.draw()
    
    # draw light
    block = pygame.Surface((int(blockSize*cam.scale), int(blockSize*cam.scale)), pygame.SRCALPHA) # block of darkness
    for x in range(map.lightMap.startPoint.x-1, map.lightMap.endPoint.x+1):
        for y in range(map.lightMap.startPoint.y-1, map.lightMap.endPoint.y+1):
            #if map.blocks[x*map.sizeX+y].type == 0:
                alphaValue = int(255-(map.lightMap.blocks[y*map.sizeX+x].light)*255/(map.lightMap.power))
                #print((map.lightMap.blocks[y*map.sizeX+x].light)/(map.lightMap.power+1))
                block.fill((0,0,0,alphaValue))
                #block.set_alpha(int(map.lightMap.blocks[x*map.sizeX+y].light*255/map.lightMap.power))
                screen.blit(block, ((x*blockSize-cam.x)*cam.scale, (y*blockSize-cam.y)*cam.scale))
    
    # draw margin
    margin = pygame.Surface((int(window.width), int(window.height)), pygame.SRCALPHA)
    pygame.draw.rect(margin, (0,0,0), (0, 0, (myPlayer.x-map.lightMap.power*blockSize-cam.x)*cam.scale, window.height))
    pygame.draw.rect(margin, (0,0,0), (0, 0, window.width, (myPlayer.y-map.lightMap.power*blockSize-cam.y)*cam.scale))
    pygame.draw.rect(margin, (0,0,0), ((myPlayer.x+map.lightMap.power*blockSize-cam.x)*cam.scale, 0, window.width, window.height))
    pygame.draw.rect(margin, (0,0,0), (0, (myPlayer.y+map.lightMap.power*blockSize-cam.y)*cam.scale, window.width, window.height))

    screen.blit(margin, (0,0))
    
    pygame.display.update()
# set alpha channel to image
def setAlpha(image, value, transparentColor):
    image.set_alpha(value)
    image = image.convert()
    if transparentColor != None:
        image.set_colorkey(transparentColor)
    return image
# main loop 
while mainLoop: 
    checkEvents()
    main()
   
pygame.quit()
