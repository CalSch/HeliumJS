const helium = {
	Pos2d: function (x,y) {
		return {x,y};
	},
	PosDelta: function (pos1, pos2) {
		return helium.Pos2d(pos1.x-pos2.x,pos1.y-pos2.y);
	},
	GetRectCorner(x,y,w,h) {
		return {
			x: x-(w/2),
			y: y-(h/2)
		}
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
			color,
			update: function() {
				self.scripts.forEach(function(script) {
					script.func();
				});
				return self;
			},
			draw: function(pos,ctx) {
				pos=helium.GetRectCorner(pos.x,pos.y)
				ctx.fillStyle = color;
				ctx.fillRect(pos.x,pos.y,w,h);
				return self;
			},
			addScript: function(script) {
				self.scripts.push(script);
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
	},

	Image : (x,y,w,h,src) => {
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
				pos=helium.GetRectCorner(pos.x,pos.y)
				ctx.drawImage(elm, pos.x,pos.y,w,h);
				return self;
			},
			addScript: function(script) {
				self.scripts.push(script);
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
			addScript: function (script) {
				self.scripts.push(script)
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
			addScript: function (script) {
				self.scripts.push(script)
				return self;
			}
		};

		return self;
	},

	Script : func => ({
		func
	}),

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

	collision: () => {
		// TODO: complete collision module
		let self = {
			SideData: () => {
				let self = {
					collided: false
				};

				return self;
			},
			CornerData: () => {
				let self = {
					collided: false
				};

				return self;
			},
			CheckRectangleSides: (rect1, rect2) => {
				let points={
					tl: helium.Pos2d(rect1.x,rect1.y),
					tr: helium.Pos2d(rect1.x+rect1.w,rect1.y),
					bl: helium.Pos2d(rect1.x,rect1.y+rect1.h),
					br: helium.Pos2d(rect1.x+rect1.w,rect1.y+rect2.h)
				}
				let corners={
					tl: self.CornerData(),
					tr: self.CornerData(),
					bl: self.CornerData(),
					br: self.CornerData()
				}
				let sides={
					top: self.SideData(),
					bottom: self.SideData(),
					left: self.SideData(),
					right: self.SideData()
				}

				if (points.tl.x > rect2.x && points.tl.x < rect2.x+rect2.w && points.tl.x > rect2.x && points.tl.x < rect2.x+rect2.w) {
					corners.tl.collided=true;
				}
				if (points.tr.x > rect2.x && points.tr.x < rect2.x+rect2.w && points.tr.x > rect2.x && points.tr.x < rect2.x+rect2.w) {
					corners.tr.collided=true;
				}
				if (points.bl.x > rect2.x && points.bl.x < rect2.x+rect2.w && points.bl.x > rect2.x && points.bl.x < rect2.x+rect2.w) {
					corners.bl.collided=true;
				}
				if (points.br.x > rect2.x && points.br.x < rect2.x+rect2.w && points.br.x > rect2.x && points.br.x < rect2.x+rect2.w) {
					corners.br.collided=true;
				}

				return {sides,corners}
			}
		}
		return self
	}
};