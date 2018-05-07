var lightPos = [ 0, 0, 0 ];
var lightColor = [ 0, 0, 0 ];
var lightDir = [ 0, 0, 0 ];
var lightRadii = [ 0, 0 ];
var lightType = [ 0 ];
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

function aimLight(light, newDirection)
{
	newDirection = normalize(newDirection);
	lightDir[3 * light.lightIndex] = newDirection[0];
	lightDir[3 * light.lightIndex + 1] = newDirection[1];
	lightDir[3 * light.lightIndex + 2] = newDirection[2];
}

function setLightRadii(light, innerRadius, outerRadius)
{
	lightRadii[2 * light.lightIndex] = Math.cos(innerRadius);
	lightRadii[2 * light.lightIndex + 1] = Math.cos(outerRadius);
}

function DirectionalLight(direction, color)
{
	this.lightIndex = lightNum;
	lightNum++;

	lightType[this.lightIndex] = 0;

	aimLight(this, direction);
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

function SpotLight(position, direction, color, innerRadius, outerRadius)
{
	this.lightIndex = lightNum;
	lightNum++;

	lightType[this.lightIndex] = 2;

	moveLight(this, position);
	setLightColor(this, color);
	aimLight(this, direction);
	setLightRadii(this, innerRadius, outerRadius);

	return this;
}