function testArea()
{
	new StaticMesh(resources.metalHex500, [ -250, 0, -250 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.metalHex500, [ 250, 0, -250 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.metalHex500, [ -250, 0, 250 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.metalHex500, [ 250, 0, 250 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	new StaticMesh(resources.tower, [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	var ship = new Ship();
	new ShipPlayerController(ship);
	camera = new ShipCamera(ship);

	new DirectionalLight([ -8, -30, 7 ], [ 2.0, 2.0, 2.2 ], false);
}

function ovalCircuit()
{
	var ship = new Ship(function()
	{
		this.position = [ -50, 3.5, -150 ];
		this.facing = [ 1, 0, 0 ];
	});
	new ShipPlayerController(ship);
	camera = new ShipCamera(ship);

	var tm = new TrackManager(ship);

	tm.addCheckpoint(new Checkpoint([ 0, 0, -150 ], [ 1, 0, 0 ], ship));
	tm.addCheckpoint(new Checkpoint([ 450, 0, 0 ], [ 0, 0, 1 ], ship));
	tm.addCheckpoint(new Checkpoint([ 0, 0, 150 ], [ -1, 0, 0 ], ship));
	tm.addCheckpoint(new Checkpoint([ -450, 0, 0 ], [ 0, 0, 1 ], ship));


	var lightCLeft = new LightCullingVolume([ -500, 0, -180 ], [ 500, 50, 0 ]);
	var lightCRight = new LightCullingVolume([ -500, 0, 0 ], [ 500, 50, 180 ]);

	// new DirectionalLight([ -8, -30, 7 ], [ 2.0, 2.0, 2.2 ]);
	var lightHeight = 35;
	for (var i = -5; i <= 5; i += 4)
	{
		lightCLeft.addLight(new PointLight([ 30 * i, lightHeight, -150 ], [ 1000, 1000, 1000 ]));
		lightCRight.addLight(new PointLight([ 30 * i, lightHeight, 150 ], [ 1000, 1000, 1000 ]));

		new StaticMesh(resources.light, [ 30 * i, lightHeight, -150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.light, [ 30 * i, lightHeight, 150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	}

	var lightCLeftWide = new LightCullingVolume([ -500, 0, -180 ], [ 500, 50, 120 ]);
	lightCLeftWide.addLight(new PointLight([ 300, lightHeight, -150 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ -300, lightHeight, -150 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ 406.066, lightHeight, -106.066 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ -406.066, lightHeight, -106.066 ], [ 1000, 1000, 1000 ]));

	new StaticMesh(resources.light, [ 300, lightHeight, -150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ -300, lightHeight, -150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ 406.066, lightHeight, -106.066 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ -406.66, lightHeight, -106.66 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	var lightCRightWide = new LightCullingVolume([ -500, 0, -120 ], [ 500, 50, 180 ]);
	lightCRightWide.addLight(new PointLight([ 300, lightHeight, 150 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ -300, lightHeight, 150 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ 406.066, lightHeight, 106.066 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ -406.066, lightHeight, 106.066 ], [ 1000, 1000, 1000 ]));

	new StaticMesh(resources.light, [ 300, lightHeight, 150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ -300, lightHeight, 150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ 406.066, lightHeight, 106.066 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.light, [ -406.66, lightHeight, 106.66 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	var lightCTop = new LightCullingVolume([ 270, 0, -180 ], [ 500, 50, 180 ]);
	lightCTop.addLight(new PointLight([ 450, lightHeight, 0 ], [ 1000, 1000, 1000, 1000 ]));
	new StaticMesh(resources.light, [ 450, lightHeight, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	var lightCBottom = new LightCullingVolume([ -500, 0, -180 ], [ -270, 50, 180 ]);
	lightCBottom.addLight(new PointLight([ -450, lightHeight, 0 ], [ 1000, 1000, 1000, 1000 ]));
	new StaticMesh(resources.light, [ -450, lightHeight, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	new StaticMesh(resources.ovalfloor, [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.ovalwalls, [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);

	// Straight walls
	new Wall([ 300, 0, 120 ], [ -300, 0, 120 ], ship);
	new Wall([ 300, 0, 180 ], [ -300, 0, 180 ], ship);
	new Wall([ 300, 0, -120 ], [ -300, 0, -120 ], ship);
	new Wall([ 300, 0, -180 ], [ -300, 0, -180 ], ship);

	// Curved walls
	var dTheta = Math.PI / 16;
	for (var theta = 0; theta < Math.PI; theta += dTheta)
	{
		new Wall(
			[ 300 + 120 * Math.sin(theta), 0, 120 * Math.cos(theta) ],
			[ 300 + 120 * Math.sin(theta + dTheta), 0, 120 * Math.cos(theta + dTheta) ],
			ship
		);
		new Wall(
			[ 300 + 180 * Math.sin(theta), 0, 180 * Math.cos(theta) ],
			[ 300 + 180 * Math.sin(theta + dTheta), 0, 180 * Math.cos(theta + dTheta) ],
			ship
		);

		new Wall(
			[ -300 - 120 * Math.sin(theta), 0, -120 * Math.cos(theta) ],
			[ -300 - 120 * Math.sin(theta + dTheta), 0, -120 * Math.cos(theta + dTheta) ],
			ship
		);
		new Wall(
			[ -300 - 180 * Math.sin(theta), 0, -180 * Math.cos(theta) ],
			[ -300 - 180 * Math.sin(theta + dTheta), 0, -180 * Math.cos(theta + dTheta) ],
			ship
		);
	}
}
