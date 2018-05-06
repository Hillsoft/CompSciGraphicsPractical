var cameraControls = {
	forward: 87,
	backward: 83,
	left: 65,
	right: 68,
	speed: 2,
	mouseSensitivity: 0.001,
	controllerSensitivity: 0.05,
}

function FPSCamera(angle, a, zMin, zMax)
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
		// var facing = this.getFacing();
		// var target = addVectors(this.position, facing);
		// var zAxis = normalize(subVectors(this.position, target));
		var zAxis = scaleVector(-1, this.getFacing());
		var xAxis = normalize(cross(this.up, zAxis));
		var yAxis = cross(zAxis, xAxis);
	 
		return inverse([
		   xAxis[0], xAxis[1], xAxis[2], 0,
		   yAxis[0], yAxis[1], yAxis[2], 0,
		   zAxis[0], zAxis[1], zAxis[2], 0,
		   this.position[0],
		   this.position[1],
		   this.position[2],
		   1,
		]);
	}

	this.tick = function(dt)
	{
		var change = cameraControls.speed * dt / 1000;
		if (pressedKeys[cameraControls.forward])
		{
			this.position = addVectors(this.position, scaleVector(change, this.getFacing()));
		}
		if (pressedKeys[cameraControls.backward])
		{
			this.position = addVectors(this.position, scaleVector(-change, this.getFacing()));
		}
		if (pressedKeys[cameraControls.left])
		{
			this.position = addVectors(this.position, scaleVector(change, normalize(cross(this.up, this.getFacing()))));
		}
		if (pressedKeys[cameraControls.right])
		{
			this.position = addVectors(this.position, scaleVector(-change, normalize(cross(this.up, this.getFacing()))));
		}

		var gp = navigator.getGamepads()[0];
		if (gp != null)
		{
			this.position = addVectors(this.position, scaleVector(change * gamepadAxisMap(-gp.axes[1]), this.getFacing()));
			this.position = addVectors(this.position, scaleVector(change * gamepadAxisMap(-gp.axes[0]), normalize(cross(this.up, this.getFacing()))));
			this.xAngle += cameraControls.controllerSensitivity * gamepadAxisMap(gp.axes[2]);
			this.yAngle += cameraControls.controllerSensitivity * gamepadAxisMap(gp.axes[3]);
			if (this.yAngle > 80 * Math.PI / 180)
			{
				this.yAngle = 80 * Math.PI / 180;
			}
			if (this.yAngle < -80 * Math.PI/ 180)
			{
				this.yAngle = -80 * Math.PI / 180;
			}
		}
	}

	this.mousemove = function(event)
	{
		if (mouseLocked)
		{
			var movementX = event.movementX ||
				event.mozMovementX ||
				event.webkitMovementX ||
				0;

			var movementY = event.movementY ||
				event.mozMovementY ||
				event.webkitMovementY ||
				0;

			this.xAngle += movementX * cameraControls.mouseSensitivity;
			this.yAngle += movementY * cameraControls.mouseSensitivity;
			if (this.yAngle > 80 * Math.PI / 180)
			{
				this.yAngle = 80 * Math.PI / 180;
			}
			if (this.yAngle < -80 * Math.PI/ 180)
			{
				this.yAngle = -80 * Math.PI / 180;
			}
		}
	}

	this.getFacing = function()
	{
		return normalize([ Math.cos(this.xAngle), -Math.tan(this.yAngle), Math.sin(this.xAngle) ]);
	}

	this.angle = angle;
	this.a = a;
	this.zMin = zMin;
	this.zMax = zMax;
	this.position = [ 0, 0, -6 ];
	this.up = [ 0, 1, 0 ];
	this.xAngle = Math.PI / 2;
	this.yAngle = 0;

	registerTickObject(this);
	document.addEventListener("mousemove", (camera => event => camera.mousemove(event))(this));

	return this;
}