var cameraControls = {
	forward: 87,
	backward: 83,
	left: 65,
	right: 68,
	speed: 2,
	mouseSensitivity: 0.001,
	controllerSensitivity: 0.05,
}

function lookAt(eye, center, up)
{
	var zAxis = scaleVector(-1, subVectors(center, eye));
	var xAxis = normalize(cross(up, zAxis));
	var yAxis = cross(zAxis, xAxis);

	return inverse([
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		eye[0],
		eye[1],
		eye[2],
		1,
	]);
}

function projection(angle, a, zMin, zMax)
{
	var ang = Math.tan((angle * 0.5) * Math.PI / 180);
	return [
		0.5 / ang, 0, 0, 0,
		0, 0.5 * a / ang, 0, 0,
		0, 0, -(zMax + zMin) / (zMax - zMin), -1,
		0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
	];
}

function orthographic(minx, maxx, miny, maxy, minz, maxz)
{
	return [
		2 / (maxx - minx), 0, 0, -(maxx + minx) / (maxx - minx),
		0, 2 / (maxy - miny), 0, -(maxy + miny) / (maxy - miny),
		0, 0, -2 / (maxz - minz), -(maxz + minz) / (maxz - minz),
		0, 0, 0, 1
	];
}

function FPSCamera(angle, a, zMin, zMax)
{
	this.getProjectionMatrix = function()
	{
		return projection(this.angle, this.a, this.zMin, this.zMax);
	}

	this.getViewMatrix = function()
	{
		return lookAt(this.position, addVectors(this.position, this.getFacing()), this.up);
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
			var right = normalize(cross(this.up, this.getFacing()));
			var forward = cross(right, this.up);
			this.position = addVectors(this.position, scaleVector(change * gamepadAxisMap(-gp.axes[1]), forward));
			this.position = addVectors(this.position, scaleVector(change * gamepadAxisMap(-gp.axes[0]), right));
			this.position = addVectors(this.position, scaleVector(change * gamepadAxisMap(gp.buttons[7].value), this.up));
			this.position = addVectors(this.position, scaleVector(-change * gamepadAxisMap(gp.buttons[6].value), this.up));
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
	this.position = [ 0, 1.7, -16 ];
	this.up = [ 0, 1, 0 ];
	this.xAngle = Math.PI / 2;
	this.yAngle = 0;

	registerTickObject(this);
	document.addEventListener("mousemove", (camera => event => camera.mousemove(event))(this));

	return this;
}