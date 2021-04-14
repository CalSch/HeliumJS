let game = helium.Game(helium.Canvas(200,100,"gameScreen"), 60)
game.setCamera(helium.Camera(0,0))
	.addSprite(helium.Rectangle(20,20,40,20,"#ff0000"))
	.start()