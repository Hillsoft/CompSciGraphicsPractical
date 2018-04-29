var drawObjects = {
	next: null
};

var registerDrawObject = llAdd(drawObjects);
var unregisterDrawObject = llRemove(drawObjects);

function drawScene()
{
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.5, 0.5, 0.5, 0.0);
	gl.clearDepth(1.0);

	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var pMatrix = camera.getProjectionMatrix();
	var vMatrix = camera.getViewMatrix();

	var curObject = drawObjects.next;
	while (curObject != null)
	{
		// drawModel(curObject.val, pMatrix, vMatrix);
		curObject.val.draw(pMatrix, vMatrix);
		curObject = curObject.next;
	}
}