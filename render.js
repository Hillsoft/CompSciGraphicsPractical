var objects = {
	next: null
};

function registerObject(obj)
{
	objects.next = {
		val: obj,
		next: objects.next
	};
}

function unregisterObject(obj)
{
	var curObject = objects;
	while (curObject.next != null)
	{
		if (curObject.next.val == obj)
		{
			curObject.next = curObject.next.next;
		}
		curObject = curObject.next;
	}
}

function drawScene()
{
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clearDepth(1.0);

	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var pMatrix = camera.getProjectionMatrix();
	var vMatrix = camera.getViewMatrix();

	var curObject = objects.next;
	while (curObject != null)
	{
		drawModel(curObject.val, pMatrix, vMatrix);
		curObject = curObject.next;
	}
}