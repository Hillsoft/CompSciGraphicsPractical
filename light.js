var lightPos = [ 0, 0, 0 ];
var lightColor = [ 0, 0, 0 ];
var lightDir = [ 0, 0, 0 ];
var lightRadii = [ 0, 0 ];
var lightType = [ 0 ];
var lights = [ null ];
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

function getLightColor(light)
{
	return [
		lightColor[3 * light.lightIndex],
		lightColor[3 * light.lightIndex + 1],
		lightColor[3 * light.lightIndex + 2],
	];
}

function aimLight(light, newDirection)
{
	newDirection = normalize(newDirection);
	lightDir[3 * light.lightIndex] = newDirection[0];
	lightDir[3 * light.lightIndex + 1] = newDirection[1];
	lightDir[3 * light.lightIndex + 2] = newDirection[2];
}

function getLightDirection(light)
{
	return [
		lightDir[3 * light.lightIndex],
		lightDir[3 * light.lightIndex + 1],
		lightDir[3 * light.lightIndex + 2],
	];
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
	lights[this.lightIndex] = this;

	return this;
}

function PointLight(position, color)
{
	this.lightIndex = lightNum;
	lightNum++;

	lightType[this.lightIndex] = 1;

	moveLight(this, position);
	setLightColor(this, color);
	lights[this.lightIndex] = this;

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
	lights[this.lightIndex] = this;

	return this;
}

function LightCullingVolume(cornerMin, cornerMax)
{
	this.tick = function(dt)
	{
		if (typeof(camera.position) === "undefined")
			return;
		
		if (
			camera.position[0] > this.cmin[0] &&
			camera.position[1] > this.cmin[1] &&
			camera.position[2] > this.cmin[2] &&
			camera.position[0] < this.cmax[0] &&
			camera.position[1] < this.cmax[1] &&
			camera.position[2] < this.cmax[2]
		) {
			if (!this.active)
			{
				this.active = true;
				for (var i = 0; i < this.lights.length; i++)
				{
					setLightColor(this.lights[i], this.lights[i].originalColor);
				}
			}
		}
		else
		{
			if (this.active)
			{
				this.active = false;
				for (var i = 0; i < this.lights.length; i++)
				{
					setLightColor(this.lights[i], [ 0, 0, 0 ]);
				}
			}
		}
	}

	this.addLight = function(light)
	{
		light.originalColor = getLightColor(light);
		this.lights.push(light);
	}

	this.lights = [];
	this.active = true;
	this.cmin = cornerMin;
	this.cmax = cornerMax;

	registerTickObject(this);

	return this;
}