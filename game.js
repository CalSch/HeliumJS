var canvas = Canvas(400,220,"gameScreen");
var guy = Rectangle(100,45,10,10,0,"#ff0000");
var guy4 = Circle(100,-10,6,"#00e0b0");
var guy2 = Circle(150,60,6,"#0000ff");
var guy3 = Image(5,-50,100,100,0,"https://calsch.repl.co/src/logo.png");
var camera = Camera(5,-50);
var game = Game(canvas, 60);

guy.addScript(Script(function() {
	guy.y=Math.sin(game.frame/30)*40;
}));
guy2.addScript(Script(function() {
	guy2.y = game.toWorldSpace(game.mousePos).y;
}));
guy4.addScript(Script(function() {
	guy4.x = game.toWorldSpace(game.mousePos).x;
}));
guy3.addScript(Script(function() {
	if (game.pressedKeys.d) {
		guy3.x+=0.3*game.deltaTime;
	}
	if (game.pressedKeys.a) {
		guy3.x-=0.3*game.deltaTime;
	}
	if (game.pressedKeys.w) {
		guy3.y-=0.3*game.deltaTime;
	}
	if (game.pressedKeys.s) {
		guy3.y+=0.3*game.deltaTime;
	}
}));

game.addSprite(guy);
game.addSprite(guy3);
game.addSprite(guy2);
game.addSprite(guy4);
game.activateCamera(camera);
game.bgColor = "#e0e0ff";

game.start();