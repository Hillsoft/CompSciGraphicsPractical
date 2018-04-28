var canvas = null;
var gl = null;
var basicShader = null;
var textureShader = null;
var camera = null;
var tickObjects = {
	next: null
};
var oldTime = 0;
var resources = {
	suzanne: null,
	billboard: null,
	cube: null,
	floor: null,
};
var stats = {
	triangles: 0,
	lights: 1
};

var registerTickObject = llAdd(tickObjects);
var unregisterTickObject = llRemove(tickObjects);

function graphicsInit(canvasId)
{
	canvas = document.getElementById(canvasId);

	document.addEventListener("pointerlockchange", pointerLockChange, false);
	document.addEventListener("mozpointerlockchange", pointerLockChange, false);
	document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

	$("#" + canvasId).click(function() {
		var clickedEl = $("#" + canvasId).get()[0];
		clickedEl.requestPointerLock = clickedEl.requestPointerLock ||
							clickedEl.mozRequestPointerLock ||
							clickedEl.webkitRequestPointerLock;

		clickedEl.requestPointerLock();

		canvas.requestFullScreen = canvas.requestFullScreen ||
			canvas.mozRequestFullScreen ||
			canvas.webkitRequestFullScreen;
		canvas.requestFullScreen();
	});

	gl = canvas.getContext("experimental-webgl");

	loadResources(function() {
		camera = new FPSCamera(50, canvas.width / canvas.height, 1, 100);

		new StaticMesh(resources.suzanne, [ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);

		for (var x = -10; x <= 10; x += 2)
		{
			for (var y = -10; y <= 10; y += 2)
			{
				new StaticMesh(resources.floor, [ x, -1.5, y ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
			}
		}

		mainLoop(0);
	});
}

function loadImage(src)
{
	var image = new Image();
	var dfd = new $.Deferred();

	image.src = src;
	image.onload = function() {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		dfd.resolve(texture);
	}

	return dfd;
}

function makeProgram(vertexCode, fragmentCode)
{
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexCode);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentCode);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	return program;
}

function loadResources(callback)
{
	$.when(
		$.ajax("shaders/basicVertexShader.glsl"),
		$.ajax("shaders/basicFragmentShader.glsl"),
		$.ajax("shaders/textureVertexShader.glsl"),
		$.ajax("shaders/textureFragmentShader.glsl"),
		$.ajax("res/suzanne/suzanne.obj"),
		loadImage("res/suzanne/ao.png"),
		$.ajax("res/billboard/billboard.obj"),
		loadImage("res/billboard/billboard.png"),
		$.ajax("res/cube/cube.obj"),
		loadImage("res/cube/cube.png"),
		$.ajax("res/stonefloor/stonefloor.obj"),
		loadImage("res/stonefloor/diffuseaoblend.jpg"),
	).done(function(bvs, bfs, tvs, tfs, su, suao, bill, billtex, cube, cubetex, floor, floortex) {
		basicShader = {
			program: makeProgram(bvs[0], bfs[0])
		};

		basicShader.pMatrix = gl.getUniformLocation(basicShader.program, "pMatrix");
		basicShader.vMatrix = gl.getUniformLocation(basicShader.program, "vMatrix");
		basicShader.mMatrix = gl.getUniformLocation(basicShader.program, "mMatrix");
		basicShader.position = gl.getAttribLocation(basicShader.program, "position");
		basicShader.color = gl.getAttribLocation(basicShader.program, "color");

		textureShader = {
			program: makeProgram(tvs[0], tfs[0])
		};

		textureShader.pMatrix = gl.getUniformLocation(textureShader.program, "pMatrix");
		textureShader.vMatrix = gl.getUniformLocation(textureShader.program, "vMatrix");
		textureShader.mMatrix = gl.getUniformLocation(textureShader.program, "mMatrix");
		textureShader.diffuse = gl.getUniformLocation(textureShader.program, "diffuseTex");
		textureShader.position = gl.getAttribLocation(textureShader.program, "position");
		textureShader.normal = gl.getAttribLocation(textureShader.program, "normal");
		textureShader.texcoord = gl.getAttribLocation(textureShader.program, "texcoord");

		resources.suzanne = new Model(su[0], suao);
		resources.billboard = new Model(bill[0], billtex);
		resources.cube = new Model(cube[0], cubetex);
		resources.floor = new Model(floor[0], floortex);

		callback();
	});
}

function mainLoop(time)
{
	var dt = time - oldTime;
	oldTime = time;
	if (!mouseLocked)
	{
		$("#time").html(dt + "ms");
		$("#fps").html(1000/dt);
		$("#tris").html(stats.triangles);
		$("#lights").html(stats.lights);
	}

	var curObject = tickObjects.next;
	while (curObject != null)
	{
		curObject.val.tick(dt);
		curObject = curObject.next;
	}

	drawScene();

	window.requestAnimationFrame(mainLoop);
}