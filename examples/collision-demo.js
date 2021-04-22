let canvas = helium.Canvas(400, 220, 'gameScreen');
let camera = helium.Camera(-5,-5);
let game = helium.Game(canvas, 60);

let rect1=helium.Rectangle(30,30,40,40,"red");
let circ1=helium.Circle(100,30,20,"blue");
let point=helium.Circle(0,0,4,"black");
let dist=helium.Text(5,200,"NaN","red");

point.addScript(helium.Script(function (self) {
	self.x=game.toWorldSpace(game.mousePos).x-4;
	self.y=game.toWorldSpace(game.mousePos).y-4;
}));
rect1.addScript(helium.Script(function (self) {
	if ( helium.collision.IsPointInRect(point, rect1) ) {
		self.color="#00ff00";
	} else {
		self.color="red";
	}
}));
circ1.addScript(helium.Script(function (self) {
	if ( helium.collision.IsPointInCirc(point,circ1) ) {
		self.color="#00ff00";
	} else {
		self.color="blue";
	}
}));
dist.addScript(helium.Script(function (self) {
	self.text=0
}));

game.addSprite(rect1);
game.addSprite(circ1);
game.addSprite(point);
game.addSprite(dist);
game.setCamera(camera);
game.bgColor = "#e0e0ff";

game.start();