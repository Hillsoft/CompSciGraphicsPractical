function Ship(intitials)
{
	this.intitials = intitials;

	this.reset = function()
	{
		this.position = [ 0, 3.5, 0 ];
		this.facing = [ 0, 0, 1 ];
		this.velocity = [ 0, 0, 0 ];
		this.spin = 0;

		this.intitials();

		this.trackManager.reset();
	}

	this.setTrackManager = function(tm)
	{
		this.trackManager = tm;
	}

	this.tick = function(dt)
	{
		dt = dt / 1000;
		this.velocity = addVectors(this.velocity, scaleVector(dt * this.thrusters[0] * thrusterStrengths[0], this.facing));
		this.velocity = addVectors(this.velocity, scaleVector(-dt * this.thrusters[1] * thrusterStrengths[1], this.facing));
		var right = normalize(cross(this.facing, this.up));
		this.velocity = addVectors(this.velocity, scaleVector(dt * this.thrusters[2] * thrusterStrengths[2], right));

		this.position = addVectors(this.position, scaleVector(dt, this.velocity));

		this.spin += dt * this.dspin * spinSpeed;
		var theta = dt * this.spin;
		this.facing = [
			Math.cos(theta) * this.facing[0] - Math.sin(theta) * this.facing[2],
			this.facing[1],
			Math.sin(theta) * this.facing[0] + Math.cos(theta) * this.facing[2]
		];

		moveLight(this.lights[0], addVectors(scaleVector(-3.8, this.facing), this.position));
		setLightColor(this.lights[0], scaleVector(this.thrusters[0], [ 300, 100, 100 ]));

		moveLight(this.lights[1], addVectors(addVectors(scaleVector(10.4, this.facing), scaleVector(-1, this.up)), this.position));
		setLightColor(this.lights[1], scaleVector(this.thrusters[1], [ 150, 75, 75 ]));

		moveLight(this.lights[2], addVectors(addVectors(scaleVector(-3.5, right), scaleVector(-0.8, this.up)), this.position));
		setLightColor(this.lights[2], scaleVector(Math.max(0, this.thrusters[2]), [ 150, 75, 75 ]));

		moveLight(this.lights[3], addVectors(addVectors(scaleVector(3.5, right), scaleVector(-0.8, this.up)), this.position));
		setLightColor(this.lights[3], scaleVector(Math.max(0, -this.thrusters[2]), [ 150, 75, 75 ]));

		moveLight(this.lights[4], addVectors(addVectors(addVectors(scaleVector(12.5, this.facing), scaleVector(-0.9, this.up)), scaleVector(1, right)), this.position));
		setLightColor(this.lights[4], scaleVector(Math.max(0, -this.dspin), [ 30, 30, 70 ]));

		moveLight(this.lights[5], addVectors(addVectors(addVectors(scaleVector(12.5, this.facing), scaleVector(-0.9, this.up)), scaleVector(1, right)), this.position));
		setLightColor(this.lights[5], scaleVector(Math.max(0, this.dspin), [ 30, 30, 70 ]));

		this.imMatrix = inverse(transpose(this.model.getMMatrix()));
	}

	this.model = new MovableMesh(resources.ship, this);

	this.position = [ 0, 3.5, 0 ];
	this.facing = [ 0, 0, 1 ];
	this.up = [ 0, 1, 0 ];

	this.thrusters = [ 0, 0, 0 ];
	this.velocity = [ 0, 0, 0 ];
	this.spin = 0;
	this.dspin = 0;

	this.intitials();

	this.lights = [
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
		new PointLight([ 0, 0, 0 ], [ 0, 0, 0 ]),
	];

	this.bbMin1 = [ -8.1876, -1.755, -8.2624 ];
	this.bbMax1 = [ 8.1876, 3.5, 3.06786 ];

	this.bbMin2 = [ -1.6984, -1.755, -5.9234 ];
	this.bbMax2 = [ 1.6984, 3.5, 14.7315 ];

	registerTickObject(this);
	hudShip = this;

	return this;
}

function ShipCamera(ship)
{
	this.getProjectionMatrix = function()
	{
		return projection(60, canvas.width / canvas.height, 1, 1000);
	}

	this.getViewMatrix = function()
	{
		var lagPos = addVectors(this.ship.position, scaleVector(-cameraVelocityLag, this.ship.velocity));
		var theta = -this.ship.spin * cameraSpinLag;
		var lagDir = [
			Math.cos(theta) * this.ship.facing[0] - Math.sin(theta) * this.ship.facing[2],
			this.ship.facing[1],
			Math.sin(theta) * this.ship.facing[0] + Math.cos(theta) * this.ship.facing[2]
		];
		this.position = addVectors(addVectors(scaleVector(6, this.ship.up), scaleVector(-18, lagDir)), lagPos);
		// this.position = addVectors(addVectors(scaleVector(0, this.ship.up), scaleVector(15, this.ship.facing)), this.ship.position);
		return lookAt(this.position, addVectors(this.position, lagDir), this.ship.up);
	}

	this.ship = ship;

	return this;
}

function ShipPlayerController(ship)
{
	this.tick = function(dt)
	{
		var gp = navigator.getGamepads()[0];

		if (this.motionAssist)
		{
			var forwardError = motionAssistMaxSpeed * (gp.buttons[7].value - gp.buttons[6].value) - dot(this.ship.facing, this.ship.velocity);
			if (forwardError > 0)
			{
				this.ship.thrusters[0] = Math.min(1, Math.max(0, forwardError));
				this.ship.thrusters[1] = 0;
			}
			else
			{
				this.ship.thrusters[0] = 0;
				this.ship.thrusters[1] = Math.min(1, Math.max(0, -forwardError));
			}

			var right = normalize(cross(this.ship.facing, this.ship.up));
			var sideError = motionAssistMaxSideSpeed * gamepadAxisMap(gp.axes[0]) - dot(right, this.ship.velocity);

			this.ship.thrusters[2] = Math.min(1, Math.max(-1, sideError));
		}
		else
		{
			this.ship.thrusters[0] = gp.buttons[7].value;
			this.ship.thrusters[1] = gp.buttons[6].value;
			this.ship.thrusters[2] = gamepadAxisMap(gp.axes[0]);
		}

		if (this.rotationAssist)
		{
			var spinError = spinAssistMaxSpeed * gamepadAxisMap(gp.axes[2]) - this.ship.spin;
			this.ship.dspin = Math.min(1, Math.max(-1, spinError));
		}
		else
		{
			this.ship.dspin = gamepadAxisMap(gp.axes[2]);
		}
	}

	this.gamepadButtonPressed = function(button)
	{
		if (button == 3)
			this.rotationAssist = !this.rotationAssist;
		if (button == 2)
			this.motionAssist = !this.motionAssist;
	}

	this.ship = ship;
	this.rotationAssist = false;
	this.motionAssist = false;

	registerTickObject(this);
	registerGamepadInputListener(this);
	hudControls = this;

	return this;
}