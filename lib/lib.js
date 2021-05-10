// HeliumJS v0.1.1 by CalSch

const helium = {
	PosDelta: function (pos1, pos2) {
		return {x:pos1.x-pos2.x,y:pos1.y-pos2.y};
	},
	getObjPos: function (obj) {
		return { x: obj.x, y: obj.y }
	},

	Canvas : (width, height, id) => {
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
	},

	Rectangle : (x,y,w,h,color) => {
		let self = {
			x,
			y,
			w,
			h,
			color,
			update: function() {
				self.scripts.forEach(function(script) {
					script.func(self);
				});
				return self;
			},
			draw: function(pos,ctx) {
				pos=helium.util.getRectCorner(pos.x,pos.y,self.w,self.h)
				ctx.fillStyle = self.color;
				ctx.fillRect(pos.x,pos.y,self.w,self.h);
				return self;
			},
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			},
			scripts: []
		};

		return self;
	},

	Circle : (x,y,r,color) => {
		let self;

		self = {
			x,
			y,
			r,
			color,
			update: function() {
				self.scripts.forEach(function(script) {
					script.func(self);
				});
				return self;
			},
			draw: function(pos,ctx) {
				ctx.fillStyle = self.color;
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
				ctx.fill();
				return self;
			},
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			},
			scripts: []
		};

		return self;
	},

	Image : (x,y,w,h,src) => {
		let elm = document.createElement("img");
		elm.src = src;
		let self = {
			x,
			y,
			w,
			h,
			src,
			elm,

			update: function() {
				self.scripts.forEach(function(script) {
					script.func(self);
				});
				return self;
			},
			draw: function(pos,ctx) {
				pos=helium.util.getRectCorner(pos.x,pos.y,self.w,self.h)
				ctx.drawImage(elm, pos.x,pos.y,self.w,self.h);
				return self;
			},
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			},
			scripts: []
		};

		return self;
	},

	Text: function (x,y,text,style) {
		let self = {
			x,
			y,
			text,
			style,

			update: function() {
				self.scripts.forEach(function(script) {
					script.func(self);
				});
				return self;
			},
			draw: function(pos,ctx) {
				ctx.fillStyle=self.style;
				ctx.fillText(self.text,self.x,self.y);
				return self;
			},
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			},
			scripts: []
		};

		return self;
	},

	Sprite : function (update,draw) {
		let self = {
			update,
			draw,
			scripts: [],
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			}
		};
		return self
	},

	Camera : (x,y) => { //TODO: Add more camera properties
		let self = {
			x,
			y,
			scripts: [],
			addScript: function(script,args) {
				self.scripts.push(script,helium.util.combineObj(args,script.args));
				return self;
			}
		};

		return self;
	},

	Script : (func, args) => {
		return {
			func, args
		};
	},

	Game : (canvas, frameRate = 60) => {
		let self, ctx;

		function draw() {
			ctx.fillStyle = self.bgColor;
			ctx.fillRect(0,0,self.screenWidth, self.screenHeight);
			self.sprites.forEach(function(sprite) {
				let pos = {
					x: sprite.x - self.activeCamera.x,
					y: sprite.y - self.activeCamera.y
				}
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
			self.lastFrameTime = +new Date();
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
		canvas.element.addEventListener('mousedown', function() {
			self.mouseDown = true;
		});
		canvas.element.addEventListener('mouseup', function() {
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
	},

	collision: {
		IsPointInRect: (point,rect) => {
			let newRect=helium.util.getRectCorner(rect.x,rect.y,rect.w,rect.h)
			return point.x > newRect.x && point.x < newRect.x + rect.w && point.y > newRect.y && point.y < newRect.y + rect.h;
		},
		IsPointInCirc: (point,circ) => {
			//console.log(Math.sqrt((circ.x-point.x)^2 + (circ.y-point.y)^2) < circ.r)
			return helium.util.getDistance(point,circ) < circ.r;
		},
		CheckRectSides: (rect1, rect2) => {
			let points={
				tl: { x: rect1.x, y: rect1.y },
				tr: { x: rect1.x+rect1.w/2, y: rect1.y },
				bl: { x: rect1.x, y: rect1.y+rect1.h/2 },
				br: { x: rect1.x+rect1.w/2, y: rect1.y+rect2.h/2 }
			}
			let corners={
				tl: false,
				tr: false,
				bl: false,
				br: false
			}
			let sides={
				top: false,
				bottom: false,
				left: false,
				right: false
			}

			if (helium.collision.IsPointInRect(points.tl,rect2)) {
				corners.tl=true;
			}
			if (helium.collision.IsPointInRect(points.tr,rect2)) {
				corners.tr=true;
			}
			if (helium.collision.IsPointInRect(points.bl,rect2)) {
				corners.bl=true;
			}
			if (helium.collision.IsPointInRect(points.br,rect2)) {
				corners.br=true;
			}

			if (corners.tl && corners.tr) sides.top = true;
			if (corners.bl && corners.br) sides.bottom = true;
			if (corners.tl && corners.bl) sides.left = true;
			if (corners.tr && corners.br) sides.right = true;

			return { sides, corners };
		}
	},
	util: {
		getDistance: function (p1,p2) {
			return Math.sqrt( ((p1.x-p2.x)**2) + (p1.y-p2.y)**2 );
		},
		getRectCorner(x,y,w,h) {
			return {
				x: x-(w/2),
				y: y-(h/2)
			}
		},
		combineObj(from,to) {
			for (let item of from) {
				to[item]=from[item];
			}
			return to;
		}
	}
};
