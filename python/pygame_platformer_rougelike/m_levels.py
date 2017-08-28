import testPygame as main
levels = []
def init():
    def setup(self):
        self.platforms.append(main.Platform(400, 700, 200, 200))
        self.load("level.l")
    def loop(self):
        return 0
    main.levels.append(main.Map(100,100,5*main.blockSize,5*main.blockSize, setup, loop))
    


