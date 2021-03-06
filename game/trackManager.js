function Checkpoint(position, facing, ship)
{
	this.model = new StaticMesh(resources.checkpoint, position, facing, [ 0, 1, 0 ]);
	this.facing = facing;
	this.position = position;

	var right = normalize(cross(this.facing, [ 0, 1, 0 ]));
	new Wall(
		addVectors(scaleVector(2.2, this.facing), addVectors(this.position, scaleVector(25.3127, right))),
		addVectors(scaleVector(-2.2, this.facing), addVectors(this.position, scaleVector(25.3127, right))),
		ship
	);
	new Wall(
		addVectors(scaleVector(2.2, this.facing), addVectors(this.position, scaleVector(-25.3127, right))),
		addVectors(scaleVector(-2.2, this.facing), addVectors(this.position, scaleVector(-25.3127, right))),
		ship
	);

	return this;
}

function TrackManager(ship)
{
	this.tick = function(dt)
	{
		this.lapTime += dt;

		if (this.checkpoints.length < 2)
			return;

		var check = this.checkpoints[this.nextCheckpoint];

		var shipMMatrix = this.ship.imMatrix;
		if (typeof(shipMMatrix) == "undefined")
			return;

		var planeNormal = mat4vec4Multiply(shipMMatrix, check.facing.concat(0));
		var planeCenter = mat4vec4Multiply(shipMMatrix, check.position.concat(1));
		var planeConstant = dot(planeNormal, planeCenter);

		if (dot(planeCenter, planeCenter) < 900 && (aabbPlaneCollision(this.ship.bbMin1, this.ship.bbMax1, planeNormal, planeConstant) || aabbPlaneCollision(this.ship.bbMin2, this.ship.bbMax2, planeNormal, planeConstant)))
		{
			if (this.nextCheckpoint == 0)
			{
				var lapFinishedText = "Lap Finished";
				if (this.bestLap == null || this.lapTime < this.bestLap)
				{
					lapFinishedText = "New Session Record";
					this.bestLap = Math.floor(this.lapTime);
				}
				if (userHighscore == null || this.lapTime < userHighscore)
				{
					lapFinishedText = "New Personal Best";
					userHighscore = Math.floor(this.lapTime);
					userHighscoreText = parseTime(userHighscore);
					$.ajax("ajax/post_score?user=" + username + "&time=" + this.lapTime.toFixed(0));
				}
				if (highscore == null || this.lapTime < highscore)
				{
					lapFinishedText = "New World Record";
					highscore = Math.floor(this.lapTime);
					highscoreText = parseTime(highscore);
				}

				notify(lapFinishedText + "\n" + parseTime(this.lapTime), 3000);

				this.lap++;
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

	this.reset = function()
	{
		this.nextCheckpoint = 1;
		this.lap = 0;
		this.lapTime = 0;
	}

	this.ship = ship;
	this.checkpoints = [];
	this.nextCheckpoint = 1;
	this.lap = 0;
	this.lapTime = 0;
	this.bestLap = null;

	this.ship.setTrackManager(this);
	hudTM = this;

	registerTickObject(this);

	return this;
}
