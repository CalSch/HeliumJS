let canvas = helium.Canvas(400, 220, 'gameScreen');
let camera = helium.Camera(-5,-5);
let game = helium.Game(canvas, 60);

let rect1=helium.Rectangle(30,30,40,40,"red");
let circ1=helium.Circle(120,30,20,"blue");
let point=helium.Circle(0,0,4,"black");
let dist=helium.Text(5,200,"NaN","red");

point.addScript(helium.Script(function (self) {
	self.x=game.toWorldSpace(game.mousePos).x-4;
	self.y=game.toWorldSpace(game.mousePos).y-4;
}));
rect1.addScript(helium.Script(function (self) {
	if ( helium.collision.IsPointInRect(game.toWorldSpace(game.mousePos), {x:30,y:30,w:40,h:40}) ) {
		self.color="#00ff00";
	} else {
		self.color="red";
	}
}));
circ1.addScript(helium.Script(function (self) {
	if ( helium.collision.IsPointInCirc(game.toWorldSpace(game.mousePos), circ1) ) {
		self.color="#00ff00";
	} else {
		self.color="blue";
	}
}));
dist.addScript(helium.Script(function (self) {
	self.text=helium.util.getDistance(point,circ1)*5+"   "+circ1.r;
}));

game.addSprite(rect1);
game.addSprite(circ1);
game.addSprite(point);
game.addSprite(dist);
game.setCamera(camera);
game.bgColor = "#e0e0ff";

game.start();