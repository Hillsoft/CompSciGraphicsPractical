function drawModel(model, pMatrix, vMatrix, mMatrix)
{
	gl.useProgram(textureShader.program);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.vertexAttribPointer(textureShader.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.uv_buffer);
	gl.vertexAttribPointer(textureShader.texcoord, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.normal_buffer);
	gl.vertexAttribPointer(textureShader.normal, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.tangent_buffer);
	gl.vertexAttribPointer(textureShader.tangent, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.biTangent_buffer);
	gl.vertexAttribPointer(textureShader.biTangent, 3, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(textureShader.position);
	gl.enableVertexAttribArray(textureShader.texcoord);
	gl.enableVertexAttribArray(textureShader.normal);
	gl.enableVertexAttribArray(textureShader.tangent);
	gl.enableVertexAttribArray(textureShader.biTangent);

	gl.uniformMatrix4fv(textureShader.pMatrix, false, pMatrix);
	gl.uniformMatrix4fv(textureShader.vMatrix, false, vMatrix);
	gl.uniformMatrix4fv(textureShader.mMatrix, false, mMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, model.texture);
	gl.uniform1i(textureShader.diffuse, 0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, model.normalTex);
	gl.uniform1i(textureShader.normalTex, 1);

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, model.roughnessTex);
	gl.uniform1i(textureShader.roughnessTex, 2);

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

	model.normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normal_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);

	model.tangent_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.tangent_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.tangents), gl.STATIC_DRAW);

	model.biTangent_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.biTangent_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.biTangents), gl.STATIC_DRAW);

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

function Model(objData, texture, normalTex, roughnessTex)
{
	this.vertices = [];
	this.uvs = [];
	this.normals = [];
	this.faceIndices = [];
	this.tangents = [];
	this.biTangents = [];

	var lines = objData.split("\n");
	var vertOffset = -1;
	var rawvertices = [];
	var rawuvs = [];
	var rawnormals = [];
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
		else if (parts[0] == "vn")
		{
			rawnormals.push(parseFloat(parts[1]));
			rawnormals.push(parseFloat(parts[2]));
			rawnormals.push(parseFloat(parts[3]));
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
				this.normals.push(rawnormals[3 * (parseInt(vtn[2]) + vertOffset)]);
				this.normals.push(rawnormals[3 * (parseInt(vtn[2]) + vertOffset) + 1]);
				this.normals.push(rawnormals[3 * (parseInt(vtn[2]) + vertOffset) + 2]);
				this.tangents.push(0); this.tangents.push(0); this.tangents.push(0);
				this.biTangents.push(0); this.biTangents.push(0); this.biTangents.push(0);
				this.faceIndices.push(currentIndex);
				currentIndex++;
			}

			for (j = 3; j < parts.length; j++)
			{
				var v0 = [
					this.vertices[3 * (currentIndex - parts.length + 1)],
					this.vertices[3 * (currentIndex - parts.length + 1) + 1],
					this.vertices[3 * (currentIndex - parts.length + 1) + 2]
				];
				var v1 = [
					this.vertices[3 * (currentIndex - parts.length + j - 1)],
					this.vertices[3 * (currentIndex - parts.length + j - 1) + 1],
					this.vertices[3 * (currentIndex - parts.length + j - 1) + 2]
				];
				var v2 = [
					this.vertices[3 * (currentIndex - parts.length + j)],
					this.vertices[3 * (currentIndex - parts.length + j) + 1],
					this.vertices[3 * (currentIndex - parts.length + j) + 2]
				];

				var uv0 = [
					1 - this.uvs[2 * (currentIndex - parts.length + 1)],
					this.uvs[2 * (currentIndex - parts.length + 1) + 1]
				];
				var uv1 = [
					1 - this.uvs[2 * (currentIndex - parts.length + j - 1)],
					this.uvs[2 * (currentIndex - parts.length + j - 1) + 1]
				];
				var uv2 = [
					1 - this.uvs[2 * (currentIndex - parts.length + j)],
					this.uvs[2 * (currentIndex - parts.length + j) + 1]
				];

				var deltaPos1 = subVectors(v1, v0);
				var deltaPos2 = subVectors(v2, v0);

				var deltaUV1 = subVectors2(uv1, uv0);
				var deltaUV2 = subVectors2(uv2, uv0);

				var r = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
				var tangent = scaleVector(r, subVectors(scaleVector(deltaUV2[1], deltaPos1), scaleVector(deltaUV1[1], deltaPos2)));
				var biTangent = scaleVector(r, subVectors(scaleVector(deltaUV1[0], deltaPos2), scaleVector(deltaUV2[0], deltaPos1)));

				this.tangents[3 * (currentIndex - parts.length + 1)] += tangent[0];
				this.tangents[3 * (currentIndex - parts.length + 1) + 1] += tangent[1];
				this.tangents[3 * (currentIndex - parts.length + 1) + 2] += tangent[2];
				this.biTangents[3 * (currentIndex - parts.length + 1)] += biTangent[0];
				this.biTangents[3 * (currentIndex - parts.length + 1) + 1] += biTangent[1];
				this.biTangents[3 * (currentIndex - parts.length + 1) + 2] += biTangent[2];

				this.tangents[3 * (currentIndex - parts.length + j - 1)] += tangent[0];
				this.tangents[3 * (currentIndex - parts.length + j - 1) + 1] += tangent[1];
				this.tangents[3 * (currentIndex - parts.length + j - 1) + 2] += tangent[2];
				this.biTangents[3 * (currentIndex - parts.length + j - 1)] += biTangent[0];
				this.biTangents[3 * (currentIndex - parts.length + j - 1) + 1] += biTangent[1];
				this.biTangents[3 * (currentIndex - parts.length + j - 1) + 2] += biTangent[2];

				this.tangents[3 * (currentIndex - parts.length + j)] += tangent[0];
				this.tangents[3 * (currentIndex - parts.length + j) + 1] += tangent[1];
				this.tangents[3 * (currentIndex - parts.length + j) + 2] += tangent[2];
				this.biTangents[3 * (currentIndex - parts.length + j)] += biTangent[0];
				this.biTangents[3 * (currentIndex - parts.length + j) + 1] += biTangent[1];
				this.biTangents[3 * (currentIndex - parts.length + j) + 2] += biTangent[2];
			}

			for (j = 1; j < parts.length; j++)
			{
				var curTangent = [
					this.tangents[3 * (currentIndex - parts.length + j)],
					this.tangents[3 * (currentIndex - parts.length + j) + 1],
					this.tangents[3 * (currentIndex - parts.length + j) + 2]
				];
				var curBiTangent = [
					this.biTangents[3 * (currentIndex - parts.length + j)],
					this.biTangents[3 * (currentIndex - parts.length + j) + 1],
					this.biTangents[3 * (currentIndex - parts.length + j) + 2]
				];

				curTangent = normalize(curTangent);
				curBiTangent = normalize(curBiTangent);

				this.tangents[3 * (currentIndex - parts.length + j)] = curTangent[0];
				this.tangents[3 * (currentIndex - parts.length + j) + 1] = curTangent[1];
				this.tangents[3 * (currentIndex - parts.length + j) + 2] = curTangent[2];

				this.biTangents[3 * (currentIndex - parts.length + j)] = curBiTangent[0];
				this.biTangents[3 * (currentIndex - parts.length + j) + 1] = curBiTangent[1];
				this.biTangents[3 * (currentIndex - parts.length + j) + 2] = curBiTangent[2];
			}
		}
	}

	this.texture = texture;
	this.normalTex = normalTex;
	this.roughnessTex = roughnessTex;

	initModel(this);

	return this;
}

function StaticMesh(model, position, facing, up, scale = 1)
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
		scale * xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], scale * yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], scale * zAxis[2], 0,
		position[0],
		position[1],
		position[2],
		1,
	];

	registerDrawObject(this);
	stats.triangles += this.model.faceIndices.length / 3;

	return this;
}
