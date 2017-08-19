import math
import pygame, sys
from pygame.locals import *
pygame.init()
screen = pygame.display.set_mode((15*50,15*50),pygame.RESIZABLE ,32)
pygame.display.set_caption("Window") 
mainColor = (200,200,200) 
bgColor = (0,0,0)
mainLoop = True

class Block:
    type = 0
    neighbors = 0
class Mouse:
    x = 0
    y = 0
    down = 0
    def set(self):
        (self.x, self.y) = pygame.mouse.get_pos()

blocks = []
sizeX = 100
sizeY = 100
scale = 1
blockSize = 10
play = False

mouse = Mouse()

for i in range(sizeX*sizeY):
    blocks.append(Block())
def cell(n):
    return int(math.floor(n/blockSize))
def setBlock(x,y,type):
    blocks[element(x,y)].type = type
def element(x, y):
    return y*sizeX + x
def setNeighbors():
    for x in range(1,sizeX-1):
        for y in range(1,sizeY-1):
            n = 0
            if blocks[element(x-1, y-1)].type==1:
                n+=1
            if blocks[element(x-1, y+1)].type==1:
                n+=1
            if blocks[element(x-1, y)].type==1:
                n+=1
            if blocks[element(x+1, y-1)].type==1:
                n+=1
            if blocks[element(x+1, y+1)].type==1:
                n+=1
            if blocks[element(x+1, y)].type==1:
                n+=1
            if blocks[element(x, y+1)].type==1:
                n+=1
            if blocks[element(x, y-1)].type==1:
                n+=1
            blocks[element(x,y)].neighbors = n
def step():
    for block in blocks:
        if block.neighbors>3 or block.neighbors<2:
            block.type = 0
        elif block.neighbors==3:
            block.type = 1
def draw():
    global screen
    global bgColor
    global mainColor
    #canvas = pygame.surface()
    screen.fill(bgColor)
    
    for x in range(sizeX):
        for y in range(sizeY):
            if blocks[element(x,y)].type:
                pygame.draw.rect(screen, mainColor, ((x*blockSize)*scale, (y*blockSize)*scale, blockSize*scale, blockSize*scale))
    pygame.display.update()
def checkEvents():
    global mouse
    global play

    mouse.set()
    for event in pygame.event.get():
        if event.type==MOUSEBUTTONDOWN:
            mouse.down = True
        if event.type==MOUSEBUTTONUP:
            mouse.down = False
        if event.type == QUIT: 
            mainLoop = False
            pygame.quit()
        if event.type==VIDEORESIZE:
            screen=pygame.display.set_mode(event.dict['size'],HWSURFACE|DOUBLEBUF|RESIZABLE)
            #screen.blit(pygame.transform.scale(pic,event.dict['size']),(0,0))
            pygame.display.flip()
        if event.type==KEYUP:
            if event.key==K_SPACE:
                play = not play

s = 0
while mainLoop:
    if mouse.down:
        setBlock(cell(mouse.x/scale), cell(mouse.y/scale), 1)
    checkEvents()
    if play:
        setNeighbors()
        step()
    draw()
    pygame.time.wait(20)
    s += 1

pygame.quit()