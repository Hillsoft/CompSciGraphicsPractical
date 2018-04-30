var lightPos = [];
var lightColor = [];
var lightType = [];
var lightNum = 0;

function moveLight(light, newPosition)
{
	lightPos[3 * light.lightIndex] = newPosition[0];
	lightPos[3 * light.lightIndex + 1] = newPosition[1];
	lightPos[3 * light.lightIndex + 2] = newPosition[2];
}

function setLightColor(light, newColor)
{
	lightColor[3 * light.lightIndex] = newColor[0];
	lightColor[3 * light.lightIndex + 1] = newColor[1];
	lightColor[3 * light.lightIndex + 2] = newColor[2];
}

function DirectionalLight(direction, color)
{
	this.lightIndex = lightNum;
	lightNum++;

	lightType[this.lightIndex] = 0;

	moveLight(this, position);
	setLightColor(this, color);

	return this;
}

function PointLight(position, color)
{
	this.lightIndex = lightNum;
	lightNum++;

	lightType[this.lightIndex] = 1;

	moveLight(this, position);
	setLightColor(this, color);

	return this;
}