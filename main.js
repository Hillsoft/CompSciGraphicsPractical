var canvas = null;
var gl = null;
var basicShader = null;
var camera = null;

function graphicsInit(canvasId)
{
	canvas = document.getElementById(canvasId);
	gl = canvas.getContext("experimental-webgl");

	loadResources(function() {
		camera = new Camera(40, canvas.width / canvas.height, 1, 100);

		registerObject(new CubeModel());

		mainLoop();
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

function mainLoop()
{
	drawScene();

	window.requestAnimationFrame(mainLoop);
}