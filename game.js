var canvas = Canvas(200,110,"gameScreen");
var guy = Rectangle(100,45,10,10,"#ff0000");
var guy2 = Circle(150,60,6,"#0000ff");
var guy3 = Image(5,-50,40,40,"https://calsch.repl.co/src/logo.png");
var camera = Camera(5,-50);
var game = Game(canvas);

guy.update = function() {
	guy.y=Math.sin(game.frame/30)*40;
}
guy2.update = function() {
	guy2.y=-Math.sin(game.frame/30)*40;
}
guy3.update = function() {
	if (game.pressedKeys.d) {
		guy3.x+=0.1*game.deltaTime;
	}
	if (game.pressedKeys.a) {
		guy3.x-=0.1*game.deltaTime;
	}
	if (game.pressedKeys.w) {
		guy3.y-=0.1*game.deltaTime;
	}
	if (game.pressedKeys.s) {
		guy3.y+=0.1*game.deltaTime;
	}
}

game.addSprite(guy);
game.addSprite(guy3);
game.addSprite(guy2);
game.addCamera(camera, true);
game.bgColor = "#e0e0ff";

game.start();