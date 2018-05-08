var canvas = null;
var gl = null;
var meshBasicShader = null;
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
	stoneslabs: null,
	stoneslabsMat: null,
	tiles: null,
	tilesMat: null,
	pebbles: null,
	pebblesMat: null,
	damagedwall: null,
	damagedwallMat: null,
	plaster: null,
	plasterMat: null,
	metalMat: null,
	striplight: null,
	striplightfitting: null,
	doorframe: null,
	door: null,
	rustedmetalMat: null,
	doorhandle: null,
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
		camera = new FPSCamera(50, canvas.width / canvas.height, 0.1, 100);

		loadLevel();

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
		$.ajax("shaders/mesh_basic_VertexShader.glsl"),
		$.ajax("shaders/mesh_basic_FragmentShader.glsl"),
		$.ajax("shaders/mesh_D_VertexShader.glsl"),
		$.ajax("shaders/mesh_D_FragmentShader.glsl"),
		$.ajax("shaders/mesh_DNR_VertexShader.glsl"),
		$.ajax("shaders/mesh_DNR_FragmentShader.glsl"),
		$.ajax("shaders/mesh_DNRPOM_VertexShader.glsl"),
		$.ajax("shaders/mesh_DNRPOM_FragmentShader.glsl"),
		$.ajax("shaders/deferredVertexShader.glsl"),
		$.ajax("shaders/deferredFragmentCookTorranceShader.glsl"),
		$.ajax("res/matobj_suzanne/suzanne.obj"),
		loadImage("res/matobj_suzanne/ao.png"),
		$.ajax("res/obj_striplight/strip.obj"),
		$.ajax("res/obj_striplight/fitting.obj"),
		$.ajax("res/obj_door/doorframe.obj"),
		$.ajax("res/obj_door/door.obj"),
		$.ajax("res/obj_door/handle.obj"),
		$.ajax("res/obj_floor/floor.obj"),
		$.ajax("res/obj_floor/floorht.obj"),
		loadImage("res/mat_stoneslabs/diffuseaoblend.jpg"),
		loadImage("res/mat_stoneslabs/normals.jpg"),
		loadImage("res/mat_stoneslabs/roughness.jpg"),
		loadImage("res/mat_stoneslabs/displacement.png"),
		loadImage("res/mat_tiledfloor/diffuseaoblend.jpg"),
		loadImage("res/mat_tiledfloor/normals.jpg"),
		loadImage("res/mat_tiledfloor/roughness.jpg"),
		loadImage("res/mat_tiledfloor/displacement.png"),
		loadImage("res/mat_pebbles/diffuseaoblend.jpg"),
		loadImage("res/mat_pebbles/normals.jpg"),
		loadImage("res/mat_pebbles/roughness.jpg"),
		loadImage("res/mat_pebbles/displacement.png"),
		loadImage("res/mat_damagedwall/diffuseaoblend.jpg"),
		loadImage("res/mat_damagedwall/normals.jpg"),
		loadImage("res/mat_damagedwall/roughness.jpg"),
		loadImage("res/mat_plaster/diffuse.jpg"),
		loadImage("res/mat_plaster/normals.jpg"),
		loadImage("res/mat_plaster/roughness.jpg"),
		loadImage("res/mat_metal/diffuse.jpg"),
		loadImage("res/mat_metal/normals.jpg"),
		loadImage("res/mat_metal/roughness.jpg"),
		loadImage("res/mat_rustedmetal/diffuse.jpg"),
		loadImage("res/mat_rustedmetal/normals.jpg"),
		loadImage("res/mat_rustedmetal/roughness.jpg"),
	).done(function(
		mbvs, mbfs,
		mdvs, mdfs,
		mdnrvs, mdnrfs,
		dnrpomvs, dnrpomfs,
		dvs, dfs,
		su, suao,
		striplight, stripfitting,
		doorframe, door, doorhandle,
		floor, floorht,
		stoneslabsdiffuse, stoneslabsnorm, stoneslabsrough, stoneslabsdisplacement,
		tilesdiffuse, tilesnorm, tilesrough, tilesdisplacement,
		pebblesdiffuse, pebblesnorm, pebblesrough, pebblesdisplacement,
		damagedwalldiffuse, damagedwallnorm, damagedwallrough,
		plasterdiffuse, plasternorm, plasterrough,
		metaldiffuse, metalnormals, metalroughness,
		rustmetaldiffuse, rustmetalnorm, rustmetalrough,
	) {
		meshBasicShader = {
			program: makeProgram(mbvs[0], mbfs[0]),
		};

		meshBasicShader.pMatrix = gl.getUniformLocation(meshBasicShader.program, "pMatrix");
		meshBasicShader.vMatrix = gl.getUniformLocation(meshBasicShader.program, "vMatrix");
		meshBasicShader.mMatrix = gl.getUniformLocation(meshBasicShader.program, "mMatrix");
		meshBasicShader.diffuse = gl.getUniformLocation(meshBasicShader.program, "diffuse");
		meshBasicShader.roughness = gl.getUniformLocation(meshBasicShader.program, "roughness");
		meshBasicShader.diffuseVal = gl.getUniformLocation(meshBasicShader.program, "diffuseVal");
		meshBasicShader.metallic = gl.getUniformLocation(meshBasicShader.program, "metallic");
		meshBasicShader.position = gl.getAttribLocation(meshBasicShader.program, "position");
		meshBasicShader.normal = gl.getAttribLocation(meshBasicShader.program, "normal");

		meshDShader = {
			program: makeProgram(mdvs[0], mdfs[0]),
		};

		meshDShader.pMatrix = gl.getUniformLocation(meshDShader.program, "pMatrix");
		meshDShader.vMatrix = gl.getUniformLocation(meshDShader.program, "vMatrix");
		meshDShader.mMatrix = gl.getUniformLocation(meshDShader.program, "mMatrix");
		meshDShader.diffuse = gl.getUniformLocation(meshDShader.program, "diffuseTex");
		meshDShader.roughness = gl.getUniformLocation(meshDShader.program, "roughness");
		meshDShader.diffuseVal = gl.getUniformLocation(meshDShader.program, "diffuseVal");
		meshDShader.metallic = gl.getUniformLocation(meshDShader.program, "metallic");
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
		meshDNRShader.diffuseVal = gl.getUniformLocation(meshDNRShader.program, "diffuseVal");
		meshDNRShader.metallic = gl.getUniformLocation(meshDNRShader.program, "metallic");
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
		meshDNRPOMShader.diffuseVal = gl.getUniformLocation(meshDNRPOMShader.program, "diffuseVal");
		meshDNRPOMShader.metallic = gl.getUniformLocation(meshDNRPOMShader.program, "metallic");
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
		deferredShader.lightDirections = gl.getUniformLocation(deferredShader.program, "lightDirections");
		deferredShader.lightRadii = gl.getUniformLocation(deferredShader.program, "lightRadii");
		deferredShader.lightTypes = gl.getUniformLocation(deferredShader.program, "lightTypes");
		deferredShader.lightNum = gl.getUniformLocation(deferredShader.program, "numLights");
		deferredShader.cameraPosition = gl.getUniformLocation(deferredShader.program, "cameraPosition");
		deferredShader.position = gl.getAttribLocation(deferredShader.program, "position");

		resources.suzanneMat = new DiffuseMaterial(suao, 0.1, 0.0, 1.0);
		resources.suzanne = new Model(su[0], resources.suzanneMat);
		resources.stoneslabsMat = new DiffuseNormalRoughnessPOMMaterial(stoneslabsdiffuse, stoneslabsnorm, stoneslabsrough, stoneslabsdisplacement, 0.9, 0.0, 0.006, 4);
		resources.stoneslabs = new Model(floor[0], resources.stoneslabsMat);
		resources.tilesMat = new DiffuseNormalRoughnessPOMMaterial(tilesdiffuse, tilesnorm, tilesrough, tilesdisplacement, 0.5, 0.0, 0.01, 2);
		resources.tiles = new Model(floor[0], resources.tilesMat);
		resources.pebblesMat = new DiffuseNormalRoughnessPOMMaterial(pebblesdiffuse, pebblesnorm, pebblesrough, pebblesdisplacement, 0.8, 0.0, 0.05, 64);
		resources.pebbles = new Model(floor[0], resources.pebblesMat);
		resources.damagedwallMat = new DiffuseNormalRoughnessMaterial(damagedwalldiffuse, damagedwallnorm, damagedwallrough, 0.8, 0.0);
		resources.damagedwall = new Model(floor[0], resources.damagedwallMat);
		resources.plasterMat = new DiffuseNormalRoughnessMaterial(plasterdiffuse, plasternorm, plasterrough, 0.9, 0.0);
		resources.plaster = new Model(floorht[0], resources.plasterMat);
		resources.metalMat = new DiffuseNormalRoughnessMaterial(metaldiffuse, metalnormals, metalroughness, 0.0, 1.0);
		resources.striplight = new Model(striplight[0], new BasicMaterial([ 1.0, 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ], 1.0, 0.0));
		resources.striplightfitting = new Model(stripfitting[0], resources.metalMat);
		resources.doorframe = new Model(doorframe[0], resources.metalMat);
		resources.rustedmetalMat = new DiffuseNormalRoughnessMaterial(rustmetaldiffuse, rustmetalnorm, rustmetalrough, 0.0, 1.0);
		resources.door = new Model(door[0], resources.rustedmetalMat);
		resources.doorhandle = new Model(doorhandle[0], resources.metalMat);

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