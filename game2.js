var game = Game(Canvas(200,100,"gameScreen"), 60)
game.setCamera(Camera(0,0))
	.addSprite(Rectangle(20,20,40,20,"#ff0000"))
	.start()