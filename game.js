let canvas = Canvas(400, 220, 'gameScreen')
let guy = Rectangle(100,45,10,10,0,"#ff0000");
let guy4 = Circle(100,-10,6,"#00e0b0");
let guy2 = Circle(150,60,6,"#0000ff");
let guy3 = Image(5,-50,100,100,0,"https://calsch.repl.co/src/logo.png");
let camera = Camera(5,-50);
let game = Game(canvas, 60);

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
game.setCamera(camera);
game.bgColor = "#e0e0ff";

game.start();