// Actually a line
function Wall(startPos, endPos, ship)
{
	this.tick = function(dt)
	{
		var shipMMatrix = this.ship.imMatrix;
		if (typeof(shipMMatrix) == "undefined")
		{
			console.log("Warning: ship model matrix not found");
			return;
		}

		var localStartPos = mat4vec4Multiply(shipMMatrix, this.startPos.concat(1));
		var localEndPos = mat4vec4Multiply(shipMMatrix, this.endPos.concat(1));

		if (aabbRayCollision(this.ship.bbMin1, this.ship.bbMax1, localStartPos, localEndPos) || aabbRayCollision(this.ship.bbMin2, this.ship.bbMax2, localStartPos, localEndPos))
		{
			notify("You crashed", 1500);
			this.ship.reset();
		}
	}

	this.startPos = startPos;
	this.endPos = endPos;
	this.ship = ship;

	registerTickObject(this);

	return this;
}