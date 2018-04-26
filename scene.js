function drawModel(model, pMatrix, vMatrix)
{
	var mMatrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	// pMatrix = mMatrix;
	// vMatrix = mMatrix;

	gl.useProgram(basicShader.program);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.vertexAttribPointer(basicShader.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.color_buffer);
	gl.vertexAttribPointer(basicShader.color, 3, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(basicShader.position);
	gl.enableVertexAttribArray(basicShader.color);

	gl.uniformMatrix4fv(basicShader.pMatrix, false, pMatrix);
	gl.uniformMatrix4fv(basicShader.vMatrix, false, vMatrix);
	gl.uniformMatrix4fv(basicShader.mMatrix, false, mMatrix);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.index_buffer);
	gl.drawElements(gl.TRIANGLES, model.faceIndices.length, gl.UNSIGNED_SHORT, 0);
}

function initModel(model)
{
	model.vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

	model.color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.color_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);

	model.index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.faceIndices), gl.STATIC_DRAW);
}

function CubeModel()
{
	this.vertices = [
		-1,-1,-1, 1,-1,-1, 1, 1,-1, -1, 1,-1,
		-1,-1, 1, 1,-1, 1, 1, 1, 1, -1, 1, 1,
		-1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1,
		1,-1,-1, 1, 1,-1, 1, 1, 1, 1,-1, 1,
		-1,-1,-1, -1,-1, 1, 1,-1, 1, 1,-1,-1,
		-1, 1,-1, -1, 1, 1, 1, 1, 1, 1, 1,-1
	];

	this.colors = [
		5,3,7, 5,3,7, 5,3,7, 5,3,7,
        1,1,3, 1,1,3, 1,1,3, 1,1,3,
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,1,0, 1,1,0, 1,1,0, 1,1,0,
        0,1,0, 0,1,0, 0,1,0, 0,1,0
	];

	this.faceIndices = [
		0,1,2, 0,2,3, 4,5,6, 4,6,7,
        8,9,10, 8,10,11, 12,13,14, 12,14,15,
        16,17,18, 16,18,19, 20,21,22, 20,22,23
	];

	initModel(this);
	registerDrawObject(this);

	return this;
}