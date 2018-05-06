var canvas = null;
var gl = null;
var meshDShader = null;
var meshDNRShader = null;
var meshDNRPOMShader = null;
var deferredShader = null;
var camera = null;
var tickObjects = {
	next: null
};
var oldTime = 0;
var resources = {
	suzanne: null,
	suzanneMat: null,
	floor: null,
	floorMat: null,
	tiles: null,
	tilesMat: null,
	pebbles: null,
	pebblesMat: null,
};
var stats = {
	triangles: 0,
};
var frameBuffer;
var frameBufferTexs = [];
var quad = null;
var anisotropicFilter = null;

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

	anisotropicFilter = gl.getExtension("EXT_texture_filter_anisotropic");

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

		new StaticMesh(resources.suzanne, [ 0, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -6, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 6, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 0, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -3, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 3, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ -6, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.suzanne, [ 6, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);

		new DirectionalLight([ -8, -10, 7 ], [ 0.6, 0.6, 0.65 ]);
		new PointLight([ -10, 10, -5 ], [ 10, 10, 25 ]);
		new PointLight([ 10, 10, -5 ], [ 50, 20, 20 ]);

		for (var x = -10; x <= 10; x += 2)
		{
			for (var y = -10; y <= 10; y += 2)
			{
				new StaticMesh(resources.pebbles, [ 1 * x, -1.5, 1 * y ], [ 0, 0, 1 ], [ 0, 1, 0 ], 1);
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
		gl.texParameterf(gl.TEXTURE_2D, anisotropicFilter.TEXTURE_MAX_ANISOTROPY_EXT, 8);
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
		$.ajax("shaders/mesh_D_VertexShader.glsl"),
		$.ajax("shaders/mesh_D_FragmentShader.glsl"),
		$.ajax("shaders/mesh_DNR_VertexShader.glsl"),
		$.ajax("shaders/mesh_DNR_FragmentShader.glsl"),
		$.ajax("shaders/mesh_DNRPOM_VertexShader.glsl"),
		$.ajax("shaders/mesh_DNRPOM_FragmentShader.glsl"),
		$.ajax("shaders/deferredVertexShader.glsl"),
		$.ajax("shaders/deferredFragmentShader.glsl"),
		$.ajax("res/suzanne/suzanne.obj"),
		loadImage("res/suzanne/ao.png"),
		$.ajax("res/stonefloor/stonefloor.obj"),
		loadImage("res/stonefloor/diffuseaoblend.jpg"),
		loadImage("res/stonefloor/normals.jpg"),
		loadImage("res/stonefloor/roughness.jpg"),
		loadImage("res/stonefloor/displacement.png"),
		$.ajax("res/tiledfloor/tiledfloor.obj"),
		loadImage("res/tiledfloor/diffuseaoblend.jpg"),
		loadImage("res/tiledfloor/normals.jpg"),
		loadImage("res/tiledfloor/roughness.jpg"),
		loadImage("res/tiledfloor/displacement.png"),
		$.ajax("res/obj_floor/floor.obj"),
		loadImage("res/mat_pebbles/diffuse.jpg"),
		loadImage("res/mat_pebbles/normals.jpg"),
		loadImage("res/mat_pebbles/roughness.jpg"),
		loadImage("res/mat_pebbles/displacement.png"),
	).done(function(mdvs, mdfs, mdnrvs, mdnrfs, dnrpomvs, dnrpomfs, dvs, dfs, su, suao, floor, floortex, floornorm, floorrough, floordisplacement, tiles, tilestex, tilesnorm, tilesrough, tilesdisplacement, floorobj, pebbles, pebblesnorm, pebblesrough, pebblesdisplacement) {
		meshDShader = {
			program: makeProgram(mdvs[0], mdfs[0]),
		};

		meshDShader.pMatrix = gl.getUniformLocation(meshDShader.program, "pMatrix");
		meshDShader.vMatrix = gl.getUniformLocation(meshDShader.program, "vMatrix");
		meshDShader.mMatrix = gl.getUniformLocation(meshDShader.program, "mMatrix");
		meshDShader.diffuse = gl.getUniformLocation(meshDShader.program, "diffuseTex");
		meshDShader.roughness = gl.getUniformLocation(meshDShader.program, "roughness");
		meshDShader.position = gl.getAttribLocation(meshDShader.program, "position");
		meshDShader.normal = gl.getAttribLocation(meshDShader.program, "normal");
		meshDShader.texcoord = gl.getAttribLocation(meshDShader.program, "texCoord");

		meshDNRShader = {
			program: makeProgram(mdnrvs[0], mdnrfs[0])
		};

		meshDNRShader.pMatrix = gl.getUniformLocation(meshDNRShader.program, "pMatrix");
		meshDNRShader.vMatrix = gl.getUniformLocation(meshDNRShader.program, "vMatrix");
		meshDNRShader.mMatrix = gl.getUniformLocation(meshDNRShader.program, "mMatrix");
		meshDNRShader.diffuse = gl.getUniformLocation(meshDNRShader.program, "diffuseTex");
		meshDNRShader.normalTex = gl.getUniformLocation(meshDNRShader.program, "normalTex");
		meshDNRShader.roughnessTex = gl.getUniformLocation(meshDNRShader.program, "roughnessTex");
		meshDNRShader.position = gl.getAttribLocation(meshDNRShader.program, "position");
		meshDNRShader.normal = gl.getAttribLocation(meshDNRShader.program, "normal");
		meshDNRShader.texcoord = gl.getAttribLocation(meshDNRShader.program, "texcoord");
		meshDNRShader.tangent = gl.getAttribLocation(meshDNRShader.program, "tangent");
		meshDNRShader.biTangent = gl.getAttribLocation(meshDNRShader.program, "biTangent");

		meshDNRPOMShader = {
			program: makeProgram(dnrpomvs[0], dnrpomfs[0])
		};

		meshDNRPOMShader.pMatrix = gl.getUniformLocation(meshDNRPOMShader.program, "pMatrix");
		meshDNRPOMShader.vMatrix = gl.getUniformLocation(meshDNRPOMShader.program, "vMatrix");
		meshDNRPOMShader.mMatrix = gl.getUniformLocation(meshDNRPOMShader.program, "mMatrix");
		meshDNRPOMShader.camera = gl.getUniformLocation(meshDNRPOMShader.program, "cameraPos");
		meshDNRPOMShader.depthScale = gl.getUniformLocation(meshDNRPOMShader.program, "depthScale");
		meshDNRPOMShader.numLayers = gl.getUniformLocation(meshDNRPOMShader.program, "numLayers");
		meshDNRPOMShader.diffuse = gl.getUniformLocation(meshDNRPOMShader.program, "diffuseTex");
		meshDNRPOMShader.normalTex = gl.getUniformLocation(meshDNRPOMShader.program, "normalTex");
		meshDNRPOMShader.roughnessTex = gl.getUniformLocation(meshDNRPOMShader.program, "roughnessTex");
		meshDNRPOMShader.displacementTex = gl.getUniformLocation(meshDNRPOMShader.program, "displacementTex");
		meshDNRPOMShader.position = gl.getAttribLocation(meshDNRPOMShader.program, "position");
		meshDNRPOMShader.normal = gl.getAttribLocation(meshDNRPOMShader.program, "normal");
		meshDNRPOMShader.texcoord = gl.getAttribLocation(meshDNRPOMShader.program, "texcoord");
		meshDNRPOMShader.tangent = gl.getAttribLocation(meshDNRPOMShader.program, "tangent");
		meshDNRPOMShader.biTangent = gl.getAttribLocation(meshDNRPOMShader.program, "biTangent");

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

		resources.suzanneMat = new DiffuseMaterial(suao, 0.0);
		resources.suzanne = new Model(su[0], resources.suzanneMat);
		resources.floorMat = new DiffuseNormalRoughnessPOMMaterial(floortex, floornorm, floorrough, floordisplacement, 0.006, 4);
		resources.floor = new Model(floor[0], resources.floorMat);
		resources.tilesMat = new DiffuseNormalRoughnessPOMMaterial(tilestex, tilesnorm, tilesrough, tilesdisplacement, 0.01, 2);
		resources.tiles = new Model(tiles[0], resources.tilesMat);
		resources.pebblesMat = new DiffuseNormalRoughnessPOMMaterial(pebbles, pebblesnorm, pebblesrough, pebblesdisplacement, 0.07, 64);
		resources.pebbles = new Model(floorobj[0], resources.pebblesMat);

		callback();
	});
}

function mainLoop(time)
{
	var dt = time - oldTime;
	oldTime = time;

	var curObject = tickObjects.next;
	while (curObject != null)
	{
		curObject.val.tick(dt);
		curObject = curObject.next;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

	drawScene();

	if (!mouseLocked)
	{
		updateStats((performance.now() - time).toFixed(0), (1000/dt).toFixed(0));
	}

	window.requestAnimationFrame(mainLoop);
}

async function updateStats(time, fps)
{
	$("#time").html(time + "ms");
	$("#fps").html(fps);
	$("#tris").html(stats.triangles);
	$("#lights").html(lightNum);
}