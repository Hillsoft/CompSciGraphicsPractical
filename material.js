function BasicMaterial(diffuse, roughness, diffuseStrength, metallic)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshBasicShader.program);

		gl.uniform3f(meshBasicShader.diffuse, this.diffuse[0], this.diffuse[1], this.diffuse[2]);
		gl.uniform1f(meshBasicShader.roughness, this.roughness);
		gl.uniform1f(meshBasicShader.diffuseVal, this.diffuseStrength);
		gl.uniform1f(meshBasicShader.metallic, this.metallic);

		return meshBasicShader;
	}

	this.diffuse = diffuse;
	this.roughness = roughness;
	this.diffuseStrength = diffuseStrength;
	this.metallic = metallic;

	return this;
}

function DiffuseMaterial(texture, roughness, diffuseStrength, metallic)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshDShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshDShader.diffuse, 0);

		gl.uniform1f(meshDShader.roughness, this.roughness);
		gl.uniform1f(meshDShader.diffuseVal, this.diffuseStrength);
		gl.uniform1f(meshDShader.metallic, this.metallic);

		return meshDShader;
	}

	this.texture = texture;
	this.roughness = roughness;
	this.diffuseStrength = diffuseStrength;
	this.metallic = metallic;

	return this;
}

function DiffuseNormalRoughnessMaterial(texture, normalmap, roughness, diffuseStrength, metallic)
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

		gl.uniform1f(meshDNRShader.diffuseVal, this.diffuseStrength);
		gl.uniform1f(meshDNRShader.metallic, this.metallic);

		return meshDNRShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.roughness = roughness;
	this.diffuseStrength = diffuseStrength;
	this.metallic = metallic;

	return this;
}

function DiffuseNormalRoughnessPOMMaterial(texture, normalmap, roughness, displacement, diffuseStrength, metallic, depthScale = 0.05, numLayers = 8)
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

		gl.uniform1f(meshDNRPOMShader.diffuseVal, this.diffuseStrength);
		gl.uniform1f(meshDNRPOMShader.metallic, this.metallic);

		return meshDNRPOMShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.roughness = roughness;
	this.displacement = displacement;
	this.diffuseStrength = diffuseStrength;
	this.metallic = metallic;

	return this;
}

function DiffuseNormalRoughnessMetalSpecularPOMMaterial(texture, normalmap, rsm, displacement, depthScale = 0.05, numLayers = 8)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshDNRMSPOMShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshDNRMSPOMShader.diffuse, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.normalmap);
		gl.uniform1i(meshDNRMSPOMShader.normalTex, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.rsm);
		gl.uniform1i(meshDNRMSPOMShader.roughnessTex, 2);

		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.displacement);
		gl.uniform1i(meshDNRMSPOMShader.displacementTex, 3);

		gl.uniform1f(meshDNRMSPOMShader.depthScale, depthScale);
		gl.uniform1f(meshDNRMSPOMShader.numLayers, numLayers);
		gl.uniform3f(meshDNRMSPOMShader.camera, camera.position[0], camera.position[1], camera.position[2]);

		return meshDNRMSPOMShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.rsm = rsm;
	this.displacement = displacement;

	return this;
}

function EmissiveDiffuseMaterial(texture, emission, roughness, diffuseStrength, metallic)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshEDShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshEDShader.diffuse, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.emission);
		gl.uniform1i(meshEDShader.emission, 1);

		gl.uniform1f(meshEDShader.roughness, this.roughness);
		gl.uniform1f(meshEDShader.diffuseVal, this.diffuseStrength);
		gl.uniform1f(meshEDShader.metallic, this.metallic);

		return meshEDShader;
	}

	this.texture = texture;
	this.emission = emission;
	this.roughness = roughness;
	this.diffuseStrength = diffuseStrength;
	this.metallic = metallic;

	return this;
}

function EmissiveDiffuseNormalRoughnessMetalSpecularMaterial(texture, emission, normalmap, rsm)
{
	this.prepareShader = function()
	{
		gl.useProgram(meshEDNRMSShader.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(meshEDNRMSShader.diffuse, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.normalmap);
		gl.uniform1i(meshEDNRMSShader.normalTex, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.rsm);
		gl.uniform1i(meshEDNRMSShader.roughnessTex, 2);

		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.emission);
		gl.uniform1i(meshEDNRMSShader.emissionTex, 3);

		return meshEDNRMSShader;
	}

	this.texture = texture;
	this.normalmap = normalmap;
	this.rsm = rsm;
	this.emission = emission;

	return this;
}
