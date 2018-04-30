var lightPos = [];
var lightColor = [];
var lightType = [];
var lightNum = 0;

function DirectionalLight(direction, color)
{
	var lightIndex = lightNum;
	lightNum++;

	lightPos[3 * lightIndex] = direction[0];
	lightPos[3 * lightIndex + 1] = direction[1];
	lightPos[3 * lightIndex + 2] = direction[2];
	lightColor[3 * lightIndex] = color[0];
	lightColor[3 * lightIndex + 1] = color[1];
	lightColor[3 * lightIndex + 2] = color[2];
	lightType[lightIndex] = 0;

	this.lightIndex = lightIndex;

	return this;
}

function PointLight(position, color)
{
	var lightIndex = lightNum;
	lightNum++;

	lightPos[3 * lightIndex] = position[0];
	lightPos[3 * lightIndex + 1] = position[1];
	lightPos[3 * lightIndex + 2] = position[2];
	lightColor[3 * lightIndex] = color[0];
	lightColor[3 * lightIndex + 1] = color[1];
	lightColor[3 * lightIndex + 2] = color[2];
	lightType[lightIndex] = 1;

	this.lightIndex = lightIndex;

	return this;
}