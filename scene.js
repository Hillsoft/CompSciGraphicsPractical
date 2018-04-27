function drawModel(model, pMatrix, vMatrix, mMatrix)
{
	gl.useProgram(textureShader.program);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.vertexAttribPointer(textureShader.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.uv_buffer);
	gl.vertexAttribPointer(textureShader.texcoord, 2, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(textureShader.position);
	gl.enableVertexAttribArray(textureShader.texcoord);

	gl.uniformMatrix4fv(textureShader.pMatrix, false, pMatrix);
	gl.uniformMatrix4fv(textureShader.vMatrix, false, vMatrix);
	gl.uniformMatrix4fv(textureShader.mMatrix, false, mMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, model.texture);
	gl.uniform1i(textureShader.diffuse, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.index_buffer);
	gl.drawElements(gl.TRIANGLES, model.faceIndices.length, gl.UNSIGNED_SHORT, 0);
}

function initModel(model)
{
	model.vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

	model.uv_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.uv_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.uvs), gl.STATIC_DRAW);

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

function Model(objData, texture)
{
	this.vertices = [];
	this.uvs = [];
	this.faceIndices = [];

	var lines = objData.split("\n");
	var vertOffset = -1;
	var rawvertices = [];
	var rawuvs = [];
	var currentIndex = 0;
	for (var i = 0; i < lines.length; i++)
	{
		var parts = lines[i].split(" ");
		if (parts[0] == "v")
		{
			// vertex command
			rawvertices.push(parseFloat(parts[1]));
			rawvertices.push(parseFloat(parts[2]));
			rawvertices.push(parseFloat(parts[3]));
		}
		else if (parts[0] == "vt")
		{
			rawuvs.push(parseFloat(parts[1]));
			rawuvs.push(1.0 - parseFloat(parts[2]));
		}
		else if (parts[0] == "f")
		{
			var firstVertex = currentIndex;
			for (var j = 1; j < parts.length; j++)
			{
				if (j > 3)
				{
					this.faceIndices.push(firstVertex);
					this.faceIndices.push(currentIndex - 1);
				}

				var vtn = parts[j].split("/");
				this.vertices.push(rawvertices[3 * (parseInt(vtn[0]) + vertOffset)]);
				this.vertices.push(rawvertices[3 * (parseInt(vtn[0]) + vertOffset) + 1]);
				this.vertices.push(rawvertices[3 * (parseInt(vtn[0]) + vertOffset) + 2]);
				this.uvs.push(rawuvs[2 * (parseInt(vtn[1]) + vertOffset)]);
				this.uvs.push(rawuvs[2 * (parseInt(vtn[1]) + vertOffset) + 1]);
				this.faceIndices.push(currentIndex);
				currentIndex++;
			}
		}
	}

	this.texture = texture;

	initModel(this);

	return this;
}

function StaticMesh(model, position, facing, up)
{
	this.draw = function(pMatrix, vMatrix)
	{
		drawModel(model, pMatrix, vMatrix, this.mMatrix);
	}

	this.model = model;
	
	var zAxis = scaleVector(-1, facing);
	var xAxis = normalize(cross(up, zAxis));
	var yAxis = cross(zAxis, xAxis);
 
	this.mMatrix = [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		position[0],
		position[1],
		position[2],
		1,
	];

	registerDrawObject(this);

	return this;
}
