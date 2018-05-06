function DiffuseMaterial(texture, roughness)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshDShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshDShader.diffuse, 0);

		gl.uniform1f(meshDShader.roughness, this.roughness);

		return meshDShader;
	}

	this.texture = texture;
	this.roughness = roughness;

	return this;
}

function DiffuseNormalRoughnessMaterial(texture, normalmap, roughness)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshDNRShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshDNRShader.diffuse, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.normalmap);
		gl.uniform1i(meshDNRShader.normalTex, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.roughness);
		gl.uniform1i(meshDNRShader.roughnessTex, 2);

		return meshDNRShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.roughness = roughness;

	return this;
}

function DiffuseNormalRoughnessPOMMaterial(texture, normalmap, roughness, displacement, depthScale = 0.05, numLayers = 8)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshDNRPOMShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshDNRPOMShader.diffuse, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.normalmap);
		gl.uniform1i(meshDNRPOMShader.normalTex, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.roughness);
		gl.uniform1i(meshDNRPOMShader.roughnessTex, 2);

		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.displacement);
		gl.uniform1i(meshDNRPOMShader.displacementTex, 3);

		gl.uniform1f(meshDNRPOMShader.depthScale, depthScale);
		gl.uniform1f(meshDNRPOMShader.numLayers, numLayers);
		gl.uniform3f(meshDNRPOMShader.camera, camera.position[0], camera.position[1], camera.position[2]);

		return meshDNRPOMShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.roughness = roughness;
	this.displacement = displacement;

	return this;
}
