function Camera(angle, a, zMin, zMax)
{
	this.getProjectionMatrix = function()
	{
		var ang = Math.tan((this.angle * 0.5) * Math.PI / 180);
		return [
			0.5 / ang, 0, 0, 0,
			0, 0.5 * this.a / ang, 0, 0,
			0, 0, -(this.zMax + this.zMin) / (this.zMax - this.zMin), -1,
			0, 0, (-2 * this.zMax * this.zMin) / (this.zMax - this.zMin), 0
		];
	}

	this.getViewMatrix = function()
	{
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, -6, 1
		];
	}

	this.angle = angle;
	this.a = a;
	this.zMin = zMin;
	this.zMax = zMax;

	return this;
}