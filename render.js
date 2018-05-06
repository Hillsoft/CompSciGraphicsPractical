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

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	gl.useProgram(deferredShader.program);

	gl.uniform1i(deferredShader.lightNum, lightNum);

	gl.uniform3f(deferredShader.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);

	gl.uniform3fv(deferredShader.lights, lightPos);
	gl.uniform3fv(deferredShader.lightColors, lightColor);
	gl.uniform3fv(deferredShader.lightDirections, lightDir);
	gl.uniform2fv(deferredShader.lightRadii, lightRadii);
	gl.uniform1iv(deferredShader.lightTypes, lightType);

	gl.bindBuffer(gl.ARRAY_BUFFER, quad.vertices);
	gl.vertexAttribPointer(deferredShader.position, 2, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(deferredShader.position);

	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[0]);
	gl.uniform1i(deferredShader.diffuseTex, 7);

	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[1]);
	gl.uniform1i(deferredShader.normalTex, 6);

	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[2]);
	gl.uniform1i(deferredShader.positionTex, 5);

	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexs[3]);
	gl.uniform1i(deferredShader.roughnessTex, 4);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}