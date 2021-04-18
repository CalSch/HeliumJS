let canvas = helium.Canvas(400, 220, 'gameScreen')
let guy = helium.Rectangle(100,45,10,10,"#ff0000");
let guy4 = helium.Circle(100,-10,6,"#00e0b0");
let guy2 = helium.Circle(150,60,6,"#0000ff");
let guy3 = helium.Image(5,-50,100,100,"https://calsch.repl.co/src/logo.png");
let thing = helium.Circle(5,-50,5,"#e10abb");
let camera = helium.Camera(5,-50);
let demo1 = helium.Game(canvas, 60);

let move = helium.Script(function(self) {
	if (demo1.pressedKeys.d) {
		self.x+=0.3*demo1.deltaTime;
	}
	if (demo1.pressedKeys.a) {
		self.x-=0.3*demo1.deltaTime;
	}
	if (demo1.pressedKeys.w) {
		self.y-=0.3*demo1.deltaTime;
	}
	if (demo1.pressedKeys.s) {
		self.y+=0.3*demo1.deltaTime;
	}
})

guy.addScript(helium.Script(function() {
	guy.y=Math.sin(demo1.frame/30)*40;
}));
guy2.addScript(helium.Script(function() {
	guy2.y = demo1.toWorldSpace(demo1.mousePos).y;
}));
guy4.addScript(helium.Script(function() {
	guy4.x = demo1.toWorldSpace(demo1.mousePos).x;
}));
guy3.addScript(move);
thing.addScript(move);

demo1.addSprite(guy);
demo1.addSprite(guy3);
demo1.addSprite(guy2);
demo1.addSprite(guy4);
demo1.addSprite(thing);
demo1.setCamera(camera);
demo1.bgColor = "#e0e0ff";

demo1.start();