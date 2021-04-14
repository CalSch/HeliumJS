function Canvas(width, height, id) {
	console.log(id)
	let self = {
		width,
		height,
		id,
		element: document.getElementById(id),
		ctx: document.getElementById(id).getContext("2d")
	};

	self.element.width = width;
	self.element.height = height;

	return self;
}

function Rectangle(x,y,w,h,rot=0,color) {
	let self = {
		x,
		y,
		color,
		update: function() {
			self.scripts.forEach(function(script) {
				script.func();
			});
			return self;
		},
		draw: function(pos,ctx) {
			//ctx.rotate(rot*Math.PI/180);
			ctx.fillStyle = color;
			ctx.fillRect(pos.x,pos.y,w,h);
			//ctx.rotate(-rot*Math.PI/180);
			return self;
		},
		addScript: function(script) {
			self.scripts.push(script);
			return self;
		},
		scripts: []
	};

	return self;
}
function Circle(x,y,r,color) {
	let self;

	self = {
		x,
		y,
		r,
		color,
		update: function() {
			self.scripts.forEach(function(script) {
				script.func();
			});
			return self;
		},
		draw: function(pos,ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
			ctx.fill();
			return self;
		},
		addScript: function(script) {
			self.scripts.push(script);
			return self;
		},
		scripts: []
	};

	return self;
}

function Image(x,y,w,h,rot=0,src) {
	let elm = document.createElement("img");
	elm.src = src;
	let self = {
		x,
		y,
		src,
		elm,

		update: function() {
			self.scripts.forEach(function(script) {
				script.func();
			});
			return self;
		},
		draw: function(pos,ctx) {
			//ctx.rotate(rot*Math.PI/180);
			ctx.drawImage(elm, pos.x,pos.y,w,h);
			//ctx.rotate(-rot*Math.PI/180);
			return self;
		},
		addScript: function(script) {
			self.scripts.push(script);
			return self;
		},
		scripts: []
	};

	return self;
}

function Camera(x,y) {
	let self = {
		x,
		y
	};

	return self;
}

function Script(func) {
	self = {
		func
	};

	return self;
}

function Game(canvas, frameRate = 60) {
	let self, ctx;

	function draw() {
		ctx.fillStyle = self.bgColor;
		ctx.fillRect(0,0,self.screenWidth, self.screenHeight);
		self.sprites.forEach(function(sprite) {
			pos = {
				x: sprite.x - self.activeCamera.x,
				y: sprite.y - self.activeCamera.y
			};
			sprite.draw(pos,ctx);
		});
		return self;
	}
	function update() {
		self.sprites.forEach(function(spr) {
			spr.update();
		});
		return self;
	}
	function loop() {
		if (!self.running) return;
		self.deltaTime=new Date()-self.lastFrameTime;
		self.frame++;
		self.lastFrameTime=+new Date();
		self.update();
		self.draw();
		return self;
	}
	function start() {
		self.running = true;
		self.gameInterval = setInterval(self.loop, 1000/self.frameRate);
		ctx=self.canvas.ctx;
		return self;
	}
	function stop() {
		self.running = false;
		clearInterval(self.gameInterval);
		return self;
	}
	function getMousePosition(event) { 
		let rect = canvas.element.getBoundingClientRect(); 
		let x = event.clientX - rect.left; 
		let y = event.clientY - rect.top; 
		
		return {x, y};
	}

	//window.onkeyup = function(e) { self.pressedKeys[e.key] = false; }
	//window.onkeydown = function(e) { self.pressedKeys[e.key] = true; }
	window.addEventListener('keyup', function(e) {
		self.pressedKeys[e.key] = false;
	}, true);
	window.addEventListener('keydown', function(e) {
		self.pressedKeys[e.key] = true;
	}, true);
	canvas.element.addEventListener('mousemove', function(e) {
		self.mousePos = getMousePosition(e);
	});
	canvas.element.addEventListener('mousedown', function(e) {
		self.mouseDown = true;
	});
	canvas.element.addEventListener('mouseup', function(e) {
		self.mouseDown = false;
	});

	self = {
		canvas,
		screenWidth: canvas.width,
		screenHeight: canvas.height,
		frameRate,
		frame: 0,
		bgColor: "#ffffff",
		running: false,
		deltaTime: 0,
		sprites: [],
		pressedKeys: {},
		activeCamera: null,
		mousePos: {x: 0, y: 0},
		mouseDown: false,

		addSprite: function(spr) {
			self.sprites.push(spr);
			return self;
		},
		setCamera: function(cam) {
			self.activeCamera = cam;
			return self;
		},
		toWorldSpace: function(pos) {
			return {x: pos.x + camera.x, y: pos.y + camera.y};
		},
		start,
		draw,
		update,
		loop
	};

	return self;
}


/*
const screenWidth=125;
const screenHeight=125;
const frameRate=60;
var running=true;
var frame=0;
var keys = {}; // a dict that show is keys are pressed (keyname: true/false)
window.onkeyup = function(e) { keys[e.key] = false; }
window.onkeydown = function(e) { keys[e.key] = true; }
var deltaTime=0; // The number of milliseconds since the last frame
var lastFrameTime=+new Date(); // Millisecond value of the last frame (used for getting delta time)

var c = document.getElementById("gameScreen");
c.height=screenHeight;
c.width=screenWidth;
var ctx = c.getContext("2d");

function draw() { // Function to draw the player
	//Clear screen
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,screenWidth,screenHeight);
	//Draw character
	ctx.fillStyle = player.c; //Set the fill color
	ctx.fillRect(player.x,player.y,player.w,player.h); // Draw the player rect
}
function update() {
	if (keys["d"]) {player.x+=player.s*deltaTime;}; // if d is pressed: increse x by speed
	if (keys["a"]) {player.x-=player.s*deltaTime;}; // if a is pressed: decrease x by speed
	if (keys["w"]) {player.y-=player.s*deltaTime;}; // if w is pressed: decrease y by speed
	if (keys["s"]) {player.y+=player.s*deltaTime;}; // if s is pressed: increse y by speed
}

var interval = setInterval(function() {
	if (!running) return;
	deltaTime=new Date()-lastFrameTime;
	frame++;
	lastFrameTime=+new Date();
	update();
	draw();
}, 1000/frameRate);

function rgbToHex(r,g,b){ // RGB value to Hex value
	if (r>255||g>255||g>255||r<0||g<0||b<0){
		console.log("rgb values must be from 0 to 255");
		return;
	}
	let rHex=r.toString(16);
	if (rHex.length===1) { rHex+="0" };
	let gHex=g.toString(16);
	if (gHex.length===1) { gHex+="0" };
	let bHex=b.toString(16);
	if (bHex.lengthf===1) { bHex+="0" };
	return "#"+rHex+gHex+bHex;
}
*/