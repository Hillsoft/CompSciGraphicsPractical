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
var oldTime = -1;
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
	metalHexMat: null,
	metalHex: null,
	metalHex500: null,
	ship: null,
	spiraltower: null,
	ovalfloor: null,
};
var stats = {
	triangles: 0,
};
var interfaceElements = {};
var frameBuffer;
var frameBufferTexs = [];
var quad = null;
var anisotropicFilter = null;

var registerTickObject = llAdd(tickObjects);
var unregisterTickObject = llRemove(tickObjects);

function graphicsInit(containerId, canvasId)
{
	canvas = document.getElementById(canvasId);

	document.addEventListener("pointerlockchange", pointerLockChange, false);
	document.addEventListener("mozpointerlockchange", pointerLockChange, false);
	document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

	$("#" + containerId).click(function() {
		var clickedEl = $("#" + containerId).get()[0];
		clickedEl.requestPointerLock = clickedEl.requestPointerLock ||
							clickedEl.mozRequestPointerLock ||
							clickedEl.webkitRequestPointerLock;

		clickedEl.requestPointerLock();

		clickedEl.requestFullScreen = clickedEl.requestFullScreen ||
			clickedEl.mozRequestFullScreen ||
			clickedEl.webkitRequestFullScreen;
		clickedEl.requestFullScreen();
	});

	interfaceElements.frameTime = document.createTextNode("");
	document.getElementById("frameTime").appendChild(interfaceElements.frameTime);

	interfaceElements.fps = document.createTextNode("");
	document.getElementById("fps").appendChild(interfaceElements.fps);

	interfaceElements.triangles = document.createTextNode("");
	document.getElementById("tris").appendChild(interfaceElements.triangles);

	interfaceElements.lights = document.createTextNode("");
	document.getElementById("lights").appendChild(interfaceElements.lights);

	initHUD();

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
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[3] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[3]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[4] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[4]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);

	frameBufferTexs[5] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[5]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, canvas.width, canvas.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

	frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexs[0], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, frameBufferTexs[1], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, frameBufferTexs[2], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT3, gl.TEXTURE_2D, frameBufferTexs[3], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT4, gl.TEXTURE_2D, frameBufferTexs[4], 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, frameBufferTexs[5], 0);

	gl.drawBuffers([
		gl.COLOR_ATTACHMENT0,
		gl.COLOR_ATTACHMENT1,
		gl.COLOR_ATTACHMENT2,
		gl.COLOR_ATTACHMENT3,
		gl.COLOR_ATTACHMENT4,
	]);

	var quadVerts = [ 1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1 ];
	quad = {};
	quad.vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quad.vertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

	loadResources(function() {
		new GamepadOnPressMonitor();
		// camera = new FPSCamera(50, canvas.width / canvas.height, 0.1, 500);

		// demoLevel();
		ovalCircuit();

		mainLoop(-1);
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
		$.ajax("shaders/mesh_DNRMSPOM_VertexShader.glsl"),
		$.ajax("shaders/mesh_DNRMSPOM_FragmentShader.glsl"),
		$.ajax("shaders/mesh_ED_VertexShader.glsl"),
		$.ajax("shaders/mesh_ED_FragmentShader.glsl"),
		$.ajax("shaders/mesh_EDNRMS_VertexShader.glsl"),
		$.ajax("shaders/mesh_EDNRMS_FragmentShader.glsl"),
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
		$.ajax("res/obj_floor500x500/floor.obj"),
		$.ajax("res/obj_ship/ship.obj"),
		loadImage("res/obj_ship/ao.png"),
		$.ajax("res/obj_spiraltower/spiraltower.obj"),
		$.ajax("res/obj_ovaltrack/floor.obj"),
		$.ajax("res/obj_ovaltrack/walls.obj"),
		$.ajax("res/obj_checkpoint/checkpoint.obj"),
		loadImage("res/obj_checkpoint/diffuseaoblend.jpg"),
		loadImage("res/obj_checkpoint/normals.jpg"),
		loadImage("res/obj_checkpoint/roughness.jpg"),
		$.ajax("res/obj_checkpoint/sign.obj"),
		loadImage("res/obj_checkpoint/signemission0.png"),
		loadImage("res/obj_checkpoint/signemission1.png"),
		loadImage("res/obj_checkpoint/signemission2.png"),
		loadImage("res/obj_checkpoint/signemission3.png"),
		$.ajax("res/obj_light/light.obj"),
		loadImage("res/obj_light/diffuse.png"),
		loadImage("res/obj_light/emission.png"),
		$.ajax("res/obj_crystal/crystal.obj"),
		loadImage("res/obj_crystal/aoblue.png"),
		loadImage("res/obj_crystal/aored.png"),
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
		loadImage("res/mat_metalhex/diffuseaoblend.jpg"),
		loadImage("res/mat_metalhex/normals.png"),
		loadImage("res/mat_metalhex/roughness.jpg"),
		loadImage("res/mat_metalhex/displacement.png"),
		loadImage("res/mat_rockore/diffuseaoblend.jpg"),
		loadImage("res/mat_rockore/normals.jpg"),
		loadImage("res/mat_rockore/rsm.jpg"),
		loadImage("res/mat_rockore/displacement.png"),
		loadImage("res/mat_gunmetal/diffuse.jpg"),
		loadImage("res/mat_gunmetal/normals.jpg"),
		loadImage("res/mat_gunmetal/rsm.jpg"),
	).done(function(
		mbvs, mbfs,
		mdvs, mdfs,
		mdnrvs, mdnrfs,
		dnrpomvs, dnrpomfs,
		dnrmspomvs, dnrmspomfs,
		edvs, edfs,
		ednrmsvs, ednrmsfs,
		dvs, dfs,
		su, suao,
		striplight, stripfitting,
		doorframe, door, doorhandle,
		floor, floorht, floor500,
		ship, shipao,
		spiraltower,
		ovalfloor, ovalwalls,
		checkpoint, checkpointdiffuse, checkpointnorm, checkpointrough,
		checkpointsign, checkpointsign0, checkpointsign1, checkpointsign2, checkpointsign3,
		light, lightdiffuse, lightemission,
		crystal, crystalaoblue, crystalaored,
		stoneslabsdiffuse, stoneslabsnorm, stoneslabsrough, stoneslabsdisplacement,
		tilesdiffuse, tilesnorm, tilesrough, tilesdisplacement,
		pebblesdiffuse, pebblesnorm, pebblesrough, pebblesdisplacement,
		damagedwalldiffuse, damagedwallnorm, damagedwallrough,
		plasterdiffuse, plasternorm, plasterrough,
		metaldiffuse, metalnormals, metalroughness,
		rustmetaldiffuse, rustmetalnorm, rustmetalrough,
		metalhexdiffuse, metalhexnorm, metalhexrough, metalhexdisplacement,
		orediffuse, orenorm, orersm, oredisplacement,
		gunmetaldiffuse, gunmetalnorm, gunmetalrsm,
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

		meshDNRMSPOMShader = {
			program: makeProgram(dnrmspomvs[0], dnrmspomfs[0])
		};

		meshDNRMSPOMShader.pMatrix = gl.getUniformLocation(meshDNRMSPOMShader.program, "pMatrix");
		meshDNRMSPOMShader.vMatrix = gl.getUniformLocation(meshDNRMSPOMShader.program, "vMatrix");
		meshDNRMSPOMShader.mMatrix = gl.getUniformLocation(meshDNRMSPOMShader.program, "mMatrix");
		meshDNRMSPOMShader.camera = gl.getUniformLocation(meshDNRMSPOMShader.program, "cameraPos");
		meshDNRMSPOMShader.depthScale = gl.getUniformLocation(meshDNRMSPOMShader.program, "depthScale");
		meshDNRMSPOMShader.numLayers = gl.getUniformLocation(meshDNRMSPOMShader.program, "numLayers");
		meshDNRMSPOMShader.diffuse = gl.getUniformLocation(meshDNRMSPOMShader.program, "diffuseTex");
		meshDNRMSPOMShader.normalTex = gl.getUniformLocation(meshDNRMSPOMShader.program, "normalTex");
		meshDNRMSPOMShader.roughnessTex = gl.getUniformLocation(meshDNRMSPOMShader.program, "roughnessTex");
		meshDNRMSPOMShader.displacementTex = gl.getUniformLocation(meshDNRMSPOMShader.program, "displacementTex");;
		meshDNRMSPOMShader.position = gl.getAttribLocation(meshDNRMSPOMShader.program, "position");
		meshDNRMSPOMShader.normal = gl.getAttribLocation(meshDNRMSPOMShader.program, "normal");
		meshDNRMSPOMShader.texcoord = gl.getAttribLocation(meshDNRMSPOMShader.program, "texcoord");
		meshDNRMSPOMShader.tangent = gl.getAttribLocation(meshDNRMSPOMShader.program, "tangent");
		meshDNRMSPOMShader.biTangent = gl.getAttribLocation(meshDNRMSPOMShader.program, "biTangent");

		meshEDShader = {
			program: makeProgram(edvs[0], edfs[0])
		};

		meshEDShader.pMatrix = gl.getUniformLocation(meshEDShader.program, "pMatrix");
		meshEDShader.vMatrix = gl.getUniformLocation(meshEDShader.program, "vMatrix");
		meshEDShader.mMatrix = gl.getUniformLocation(meshEDShader.program, "mMatrix");
		meshEDShader.diffuse = gl.getUniformLocation(meshEDShader.program, "diffuseTex");
		meshEDShader.emission = gl.getUniformLocation(meshEDShader.program, "emissionTex");
		meshEDShader.roughness = gl.getUniformLocation(meshEDShader.program, "roughness");
		meshEDShader.diffuseVal = gl.getUniformLocation(meshEDShader.program, "diffuseVal");
		meshEDShader.metallic = gl.getUniformLocation(meshEDShader.program, "metallic");
		meshEDShader.position = gl.getAttribLocation(meshEDShader.program, "position");
		meshEDShader.normal = gl.getAttribLocation(meshEDShader.program, "normal");
		meshEDShader.texcoord = gl.getAttribLocation(meshEDShader.program, "texCoord");

		meshEDNRMSShader = {
			program: makeProgram(ednrmsvs[0], ednrmsfs[0])
		};

		meshEDNRMSShader.pMatrix = gl.getUniformLocation(meshEDNRMSShader.program, "pMatrix");
		meshEDNRMSShader.vMatrix = gl.getUniformLocation(meshEDNRMSShader.program, "vMatrix");
		meshEDNRMSShader.mMatrix = gl.getUniformLocation(meshEDNRMSShader.program, "mMatrix");
		meshEDNRMSShader.diffuse = gl.getUniformLocation(meshEDNRMSShader.program, "diffuseTex");
		meshEDNRMSShader.normalTex = gl.getUniformLocation(meshEDNRMSShader.program, "normalTex");
		meshEDNRMSShader.roughnessTex = gl.getUniformLocation(meshEDNRMSShader.program, "roughnessTex");
		meshEDNRMSShader.emissionTex = gl.getUniformLocation(meshEDNRMSShader.program, "emissionTex");;
		meshEDNRMSShader.position = gl.getAttribLocation(meshEDNRMSShader.program, "position");
		meshEDNRMSShader.normal = gl.getAttribLocation(meshEDNRMSShader.program, "normal");
		meshEDNRMSShader.texcoord = gl.getAttribLocation(meshEDNRMSShader.program, "texcoord");
		meshEDNRMSShader.tangent = gl.getAttribLocation(meshEDNRMSShader.program, "tangent");
		meshEDNRMSShader.biTangent = gl.getAttribLocation(meshEDNRMSShader.program, "biTangent");

		deferredShader = {
			program: makeProgram(dvs[0], dfs[0])
		};

		deferredShader.diffuseTex = gl.getUniformLocation(deferredShader.program, "diffuseTex");
		deferredShader.normalTex = gl.getUniformLocation(deferredShader.program, "normalTex");
		deferredShader.positionTex = gl.getUniformLocation(deferredShader.program, "positionTex");
		deferredShader.roughnessTex = gl.getUniformLocation(deferredShader.program, "roughnessTex");
		deferredShader.emissionTex = gl.getUniformLocation(deferredShader.program, "emissionTex");
		deferredShader.lights = gl.getUniformLocation(deferredShader.program, "lights");
		deferredShader.lightColors = gl.getUniformLocation(deferredShader.program, "lightColors");
		deferredShader.lightDirections = gl.getUniformLocation(deferredShader.program, "lightDirections");
		deferredShader.lightRadii = gl.getUniformLocation(deferredShader.program, "lightRadii");
		deferredShader.lightTypes = gl.getUniformLocation(deferredShader.program, "lightTypes");
		deferredShader.lightNum = gl.getUniformLocation(deferredShader.program, "numLights");
		deferredShader.cameraPosition = gl.getUniformLocation(deferredShader.program, "cameraPosition");
		deferredShader.position = gl.getAttribLocation(deferredShader.program, "position");

		// resources.suzanneMat = new DiffuseMaterial(suao, 0.1, 0.0, 1.0);
		// resources.suzanne = new Model(su[0], resources.suzanneMat);
		// resources.stoneslabsMat = new DiffuseNormalRoughnessPOMMaterial(stoneslabsdiffuse, stoneslabsnorm, stoneslabsrough, stoneslabsdisplacement, 0.9, 0.0, 0.004, 16);
		// resources.stoneslabs = new Model(floor[0], resources.stoneslabsMat);
		// resources.tilesMat = new DiffuseNormalRoughnessPOMMaterial(tilesdiffuse, tilesnorm, tilesrough, tilesdisplacement, 0.5, 0.0, 0.01, 16);
		// resources.tiles = new Model(floor[0], resources.tilesMat);
		// resources.pebblesMat = new DiffuseNormalRoughnessPOMMaterial(pebblesdiffuse, pebblesnorm, pebblesrough, pebblesdisplacement, 0.8, 0.0, 0.05, 128);
		// resources.pebbles = new Model(floor[0], resources.pebblesMat);
		// resources.damagedwallMat = new DiffuseNormalRoughnessMaterial(damagedwalldiffuse, damagedwallnorm, damagedwallrough, 0.8, 0.0);
		// resources.damagedwall = new Model(floor[0], resources.damagedwallMat);
		// resources.plasterMat = new DiffuseNormalRoughnessMaterial(plasterdiffuse, plasternorm, plasterrough, 0.9, 0.0);
		// resources.plaster = new Model(floorht[0], resources.plasterMat);
		// resources.metalMat = new DiffuseNormalRoughnessMaterial(metaldiffuse, metalnormals, metalroughness, 0.0, 1.0);
		// resources.striplight = new Model(striplight[0], new BasicMaterial([ 1.0, 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ], 1.0, 0.0));
		// resources.striplightfitting = new Model(stripfitting[0], resources.metalMat);
		// resources.doorframe = new Model(doorframe[0], resources.metalMat);
		// resources.rustedmetalMat = new DiffuseNormalRoughnessMaterial(rustmetaldiffuse, rustmetalnorm, rustmetalrough, 0.0, 1.0);
		// resources.door = new Model(door[0], resources.rustedmetalMat);
		// resources.doorhandle = new Model(doorhandle[0], resources.metalMat);
		resources.metalHexMat = new DiffuseNormalRoughnessPOMMaterial(metalhexdiffuse, metalhexnorm, metalhexrough, metalhexdisplacement, 0.0, 1.0, 0.005, 8);
		// resources.metalHex = new Model(floor[0], resources.metalHexMat);
		// resources.metalHex500 = new Model(floor500[0], resources.metalHexMat);
		resources.ship = new Model(ship[0], new DiffuseMaterial(shipao, 0.2, 0.0, 1.0));
		resources.tower = new Model(spiraltower[0], new BasicMaterial([ 0.8, 0.8, 1.0 ], 0.5, 0.7, 0.0));
		resources.ovalfloor = new Model(ovalfloor[0], resources.metalHexMat);
		resources.checkpoint = new Model(checkpoint[0], new DiffuseNormalRoughnessMaterial(checkpointdiffuse, checkpointnorm, checkpointrough, 0.0, 1.0));
		resources.checkpointsign = [];
		resources.checkpointsign[0] = new Model(checkpointsign[0], new EmissiveDiffuseNormalRoughnessMetalSpecularMaterial(gunmetaldiffuse, checkpointsign0, gunmetalnorm, gunmetalrsm));
		resources.checkpointsign[1] = new Model(checkpointsign[0], new EmissiveDiffuseNormalRoughnessMetalSpecularMaterial(gunmetaldiffuse, checkpointsign1, gunmetalnorm, gunmetalrsm));
		resources.checkpointsign[2] = new Model(checkpointsign[0], new EmissiveDiffuseNormalRoughnessMetalSpecularMaterial(gunmetaldiffuse, checkpointsign2, gunmetalnorm, gunmetalrsm));
		resources.checkpointsign[3] = new Model(checkpointsign[0], new EmissiveDiffuseNormalRoughnessMetalSpecularMaterial(gunmetaldiffuse, checkpointsign3, gunmetalnorm, gunmetalrsm));
		resources.oreMat = new DiffuseNormalRoughnessMetalSpecularPOMMaterial(orediffuse, orenorm, orersm, oredisplacement, 0.05, 8);
		resources.ovalwalls = new Model(ovalwalls[0], resources.oreMat);
		resources.light = new Model(light[0], new EmissiveDiffuseMaterial(lightdiffuse, lightemission, 1.0, 0.0, 0.0));
		resources.crystalsBlue = new Model(crystal[0], new DiffuseMaterial(crystalaoblue, 0.2, 0.2, 0.0));
		resources.crystalsRed = new Model(crystal[0], new DiffuseMaterial(crystalaored, 0.2, 0.2, 0.0));

		callback();
	});
}

function mainLoop(time)
{
	var dt = time - oldTime;
	if (oldTime < 0)
	{
		dt = 0;
	}
	oldTime = time;

	var curObject = tickObjects.next;
	while (curObject != null)
	{
		curObject.val.tick(dt);
		curObject = curObject.next;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

	drawScene();

	updateStats((performance.now() - time).toFixed(0), (1000/dt).toFixed(0));
	updateHUD();

	window.requestAnimationFrame(mainLoop);
}

async function updateStats(time, fps)
{
	interfaceElements.frameTime.nodeValue = time + "ms";
	interfaceElements.fps.nodeValue = fps;
	interfaceElements.triangles.nodeValue = stats.triangles;
	interfaceElements.lights.nodeValue = lightNum;
}