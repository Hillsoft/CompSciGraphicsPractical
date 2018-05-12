function drawModel(model, pMatrix, vMatrix, mMatrix)
{
	var shader = model.material.prepareShader();

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertex_buffer);
	gl.vertexAttribPointer(shader.position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.position);

	if (typeof(shader.texcoord) !== "undefined")
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, model.uv_buffer);
		gl.vertexAttribPointer(shader.texcoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.texcoord);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, model.normal_buffer);
	gl.vertexAttribPointer(shader.normal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.normal);

	if (typeof(shader.tangent) !== "undefined")
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, model.tangent_buffer);
		gl.vertexAttribPointer(shader.tangent, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.tangent);

		gl.bindBuffer(gl.ARRAY_BUFFER, model.biTangent_buffer);
		gl.vertexAttribPointer(shader.biTangent, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.biTangent);
	}

	gl.uniformMatrix4fv(shader.pMatrix, false, pMatrix);
	gl.uniformMatrix4fv(shader.vMatrix, false, vMatrix);
	gl.uniformMatrix4fv(shader.mMatrix, false, mMatrix);

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

function Model(objData, material)
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
					this.uvs[2 * (currentIndex - parts.length + 1)],
					1 - this.uvs[2 * (currentIndex - parts.length + 1) + 1]
				];
				var uv1 = [
					this.uvs[2 * (currentIndex - parts.length + j - 1)],
					1 - this.uvs[2 * (currentIndex - parts.length + j - 1) + 1]
				];
				var uv2 = [
					this.uvs[2 * (currentIndex - parts.length + j)],
					1 - this.uvs[2 * (currentIndex - parts.length + j) + 1]
				];

				var deltaPos1 = subVectors(v1, v0);
				var deltaPos2 = subVectors(v2, v0);

				var deltaUV1 = subVectors2(uv1, uv0);
				var deltaUV2 = subVectors2(uv2, uv0);

				var r = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
				var tangent = normalize(scaleVector(r, subVectors(scaleVector(deltaUV2[1], deltaPos1), scaleVector(deltaUV1[1], deltaPos2))));
				var biTangent = normalize(scaleVector(r, subVectors(scaleVector(deltaUV1[0], deltaPos2), scaleVector(deltaUV2[0], deltaPos1))));

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

	this.material = material;

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

function MovableMesh(model, owner)
{

	this.draw = function(pMatrix, vMatrix)
	{
		var zAxis = scaleVector(-1, this.owner.facing);
		var xAxis = normalize(cross(this.owner.up, zAxis));
		var yAxis = cross(zAxis, xAxis);

		var mMatrix = [
			xAxis[0], xAxis[1], xAxis[2], 0,
			yAxis[0], yAxis[1], yAxis[2], 0,
			zAxis[0], zAxis[1], zAxis[2], 0,
			this.owner.position[0],
			this.owner.position[1],
			this.owner.position[2],
			1,
		];

		drawModel(this.model, pMatrix, vMatrix, mMatrix);
	}

	this.model = model;
	this.owner = owner;

	registerDrawObject(this);
	stats.triangles += this.model.faceIndices.length / 3;

	return this;
}
