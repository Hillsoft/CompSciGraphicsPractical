var canvas = null;
var gl = null;
var basicShader = null;
var camera = null;
var tickObjects = {
	next: null
};
var oldTime = 0;

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
	});

	gl = canvas.getContext("experimental-webgl");

	loadResources(function() {
		camera = new FPSCamera(50, canvas.width / canvas.height, 1, 100);

		new CubeModel();

		mainLoop(0);
	});
}

function loadResources(callback)
{
	$.when(
		$.ajax("shaders/basicVertexShader.glsl"),
		$.ajax("shaders/basicFragmentShader.glsl")
	).done(function(bvs, bfs) {
		var basicVertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(basicVertexShader, bvs[0]);
		gl.compileShader(basicVertexShader);

		var basicFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(basicFragmentShader, bfs[0]);
		gl.compileShader(basicFragmentShader);

		basicShader = {};
		basicShader.program = gl.createProgram();
		gl.attachShader(basicShader.program, basicVertexShader);
		gl.attachShader(basicShader.program, basicFragmentShader);
		gl.linkProgram(basicShader.program);

		basicShader.pMatrix = gl.getUniformLocation(basicShader.program, "pMatrix");
		basicShader.vMatrix = gl.getUniformLocation(basicShader.program, "vMatrix");
		basicShader.mMatrix = gl.getUniformLocation(basicShader.program, "mMatrix");
		basicShader.position = gl.getAttribLocation(basicShader.program, "position");
		basicShader.color = gl.getAttribLocation(basicShader.program, "color");

		callback();
	});
}

function mainLoop(time)
{
	var dt = time - oldTime;
	oldTime = time;
	$("#time").html(dt + "ms");

	var curObject = tickObjects.next;
	while (curObject != null)
	{
		curObject.val.tick(dt);
		curObject = curObject.next;
	}

	drawScene();

	window.requestAnimationFrame(mainLoop);
}