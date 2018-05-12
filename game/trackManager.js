function Checkpoint(position, facing)
{
	this.model = new StaticMesh(resources.checkpoint, position, facing, [ 0, 1, 0 ]);
	this.facing = facing;
	this.position = position;

	return this;
}

function TrackManager(ship)
{
	this.tick = function(dt)
	{
		this.lapTime += dt;

		if (this.checkpoints.length == 0)
			return;

		var check = this.checkpoints[this.nextCheckpoint];

		var shipMMatrix = inverse(transpose(this.ship.model.getMMatrix()));
		// console.log(shipMMatrix);

		var planeNormal = mat4vec4Multiply(shipMMatrix, check.facing.concat(0));
		var planeCenter = mat4vec4Multiply(shipMMatrix, check.position.concat(1));
		var planeConstant = dot(planeNormal, planeCenter);

		if (dot(planeCenter, planeCenter) < 900 && aabbPlaneCollision(this.ship.bbMin, this.ship.bbMax, planeNormal, planeConstant))
		{
			console.log("Checkpoint " + this.nextCheckpoint + " reached");
			if (this.nextCheckpoint == 0)
			{
				this.lap++;
				var mins = Math.floor(this.lapTime / 60000);
				var secs = "00" + (Math.floor(this.lapTime / 1000) % 60);
				secs = secs.substr(secs.length - 2);
				var millis = "000" + this.lapTime % 1000;
				millis = millis.substr(millis.length - 3);
				console.log("Lap completed - " + mins + ":" + secs + "." + millis);
				this.lapTime = 0;
			}

			this.nextCheckpoint++;
			if (this.nextCheckpoint >= this.checkpoints.length)
			{
				this.nextCheckpoint = 0;
			}
		}
	}

	this.addCheckpoint = function(checkpoint)
	{
		this.checkpoints.push(checkpoint);
	}

	this.ship = ship;
	this.checkpoints = [];
	this.nextCheckpoint = 1;
	this.lap = 0;
	this.lapTime = 0;

	registerTickObject(this);

	return this;
}
