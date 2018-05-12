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
	var ship = new Ship();
	ship.position = [ -20, 3.5, -150 ];
	ship.facing = [ 1, 0, 0 ];
	new ShipPlayerController(ship);
	camera = new ShipCamera(ship);

	var tm = new TrackManager(ship);

	tm.addCheckpoint(new Checkpoint([ 0, 0, -150 ], [ 1, 0, 0 ]));
	tm.addCheckpoint(new Checkpoint([ 450, 0, 0 ], [ 0, 0, 1 ]));
	tm.addCheckpoint(new Checkpoint([ 0, 0, 150 ], [ -1, 0, 0 ]));
	tm.addCheckpoint(new Checkpoint([ -450, 0, 0 ], [ 0, 0, 1 ]));


	var lightCLeft = new LightCullingVolume([ -500, 0, -180 ], [ 500, 50, 0 ]);
	var lightCRight = new LightCullingVolume([ -500, 0, 0 ], [ 500, 50, 180 ]);

	// new DirectionalLight([ -8, -30, 7 ], [ 2.0, 2.0, 2.2 ]);
	for (var i = -5; i <= 5; i += 5)
	{
		lightCLeft.addLight(new PointLight([ 30 * i, 30, -150 ], [ 1000, 1000, 1000 ]));
		lightCRight.addLight(new PointLight([ 30 * i, 30, 150 ], [ 1000, 1000, 1000 ]));
	}

	var lightCLeftWide = new LightCullingVolume([ -500, 0, -180 ], [ 500, 50, 120 ]);
	lightCLeftWide.addLight(new PointLight([ 300, 30, -150 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ -300, 30, -150 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ 406.066, 30, -106.066 ], [ 1000, 1000, 1000 ]));
	lightCLeftWide.addLight(new PointLight([ -406.066, 30, -106.066 ], [ 1000, 1000, 1000 ]));

	var lightCRightWide = new LightCullingVolume([ -500, 0, -120 ], [ 500, 50, 180 ]);
	lightCRightWide.addLight(new PointLight([ 300, 30, 150 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ -300, 30, 150 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ 406.066, 30, 106.066 ], [ 1000, 1000, 1000 ]));
	lightCRightWide.addLight(new PointLight([ -406.066, 30, 106.066 ], [ 1000, 1000, 1000 ]));

	var lightCTop = new LightCullingVolume([ 270, 0, -180 ], [ 500, 50, 180 ]);
	lightCTop.addLight(new PointLight([ 450, 30, 0 ], [ 1000, 1000, 1000, 1000 ]));

	var lightCBottom = new LightCullingVolume([ -500, 0, -180 ], [ -270, 50, 180 ]);
	lightCBottom.addLight(new PointLight([ -450, 30, 0 ], [ 1000, 1000, 1000, 1000 ]));

	new StaticMesh(resources.ovalfloor, [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.ovalwalls, [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
}
