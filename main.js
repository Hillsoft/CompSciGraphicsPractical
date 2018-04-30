var canvas = null;
var gl = null;
var basicShader = null;
var textureShader = null;
var deferredShader = null;
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
};
var frameBuffer;
var frameBufferTexs = [];
var quad = null;

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

	gl = canvas.getContext("webgl2");

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	gl.getExtension("EXT_color_buffer_float");

	frameBufferTexs[0] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[0]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[1] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[1]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[2] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[2]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[3] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[3]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[4] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[4]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, canvas.width, canvas.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

	frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexs[0], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, frameBufferTexs[1], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, frameBufferTexs[2], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT3, gl.TEXTURE_2D, frameBufferTexs[3], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, frameBufferTexs[4], 0);

	gl.drawBuffers([
		gl.COLOR_ATTACHMENT0,
		gl.COLOR_ATTACHMENT1,
		gl.COLOR_ATTACHMENT2,
		gl.COLOR_ATTACHMENT3,
	]);

	var quadVerts = [ 1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1 ];
	quad = {};
	quad.vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quad.vertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

	loadResources(function() {
		camera = new FPSCamera(50, canvas.width / canvas.height, 1, 100);

		new StaticMesh(resources.suzanne, [ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);

		new DirectionalLight([ -8, -10, 7 ], [ 0.6, 0.6, 0.65 ]);
		new PointLight([ -10, -10, 5 ], [ 10, 10, 15 ]);
		new PointLight([ 10, 10, -5 ], [ 50, 20, 20 ]);

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
		$.ajax("shaders/deferredVertexShader.glsl"),
		$.ajax("shaders/deferredFragmentShader.glsl"),
		$.ajax("res/suzanne/suzanne.obj"),
		loadImage("res/suzanne/ao.png"),
		loadImage("res/suzanne/normals.png"),
		loadImage("res/suzanne/roughness.png"),
		$.ajax("res/billboard/billboard.obj"),
		loadImage("res/billboard/billboard.png"),
		$.ajax("res/cube/cube.obj"),
		loadImage("res/cube/cube.png"),
		$.ajax("res/stonefloor/stonefloor.obj"),
		loadImage("res/stonefloor/diffuseaoblend.jpg"),
		loadImage("res/stonefloor/normals.jpg"),
		loadImage("res/stonefloor/roughness.jpg"),
	).done(function(bvs, bfs, tvs, tfs, dvs, dfs, su, suao, suno, surough, bill, billtex, cube, cubetex, floor, floortex, floornorm, floorrough) {
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
		textureShader.normalTex = gl.getUniformLocation(textureShader.program, "normalTex");
		textureShader.roughnessTex = gl.getUniformLocation(textureShader.program, "roughnessTex");
		textureShader.position = gl.getAttribLocation(textureShader.program, "position");
		textureShader.normal = gl.getAttribLocation(textureShader.program, "normal");
		textureShader.texcoord = gl.getAttribLocation(textureShader.program, "texcoord");
		textureShader.tangent = gl.getAttribLocation(textureShader.program, "tangent");
		textureShader.biTangent = gl.getAttribLocation(textureShader.program, "biTangent");

		deferredShader = {
			program: makeProgram(dvs[0], dfs[0])
		};

		deferredShader.diffuseTex = gl.getUniformLocation(deferredShader.program, "diffuseTex");
		deferredShader.normalTex = gl.getUniformLocation(deferredShader.program, "normalTex");
		deferredShader.positionTex = gl.getUniformLocation(deferredShader.program, "positionTex");
		deferredShader.roughnessTex = gl.getUniformLocation(deferredShader.program, "roughnessTex");
		deferredShader.lights = gl.getUniformLocation(deferredShader.program, "lights");
		deferredShader.lightColors = gl.getUniformLocation(deferredShader.program, "lightColors");
		deferredShader.lightTypes = gl.getUniformLocation(deferredShader.program, "lightTypes");
		deferredShader.lightNum = gl.getUniformLocation(deferredShader.program, "numLights");
		deferredShader.cameraPosition = gl.getUniformLocation(deferredShader.program, "cameraPosition");
		deferredShader.position = gl.getAttribLocation(deferredShader.program, "position");

		resources.suzanne = new Model(su[0], suao, suno, surough);
		// resources.billboard = new Model(bill[0], billtex);
		// resources.cube = new Model(cube[0], cubetex);
		resources.floor = new Model(floor[0], floortex, floornorm, floorrough);

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
		$("#lights").html(lightNum);
	}

	var curObject = tickObjects.next;
	while (curObject != null)
	{
		curObject.val.tick(dt);
		curObject = curObject.next;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

	drawScene();

	window.requestAnimationFrame(mainLoop);
}