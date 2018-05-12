function demoLevel()
{
	new StaticMesh(resources.suzanne, [ 0, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ -3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ 3, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ -6, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ 6, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ 0, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ -3, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ 3, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ -6, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.suzanne, [ 6, 0, -3 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);

	new DirectionalLight([ -8, -10, 7 ], [ 0.6, 0.6, 0.65 ], true);
	new PointLight([ -10, 10, -5 ], [ 10, 10, 25 ]);
	new PointLight([ 10, 10, -5 ], [ 50, 20, 20 ]);

	for (var x = -10; x <= 10; x += 2)
	{
		for (var y = -10; y <= 10; y += 2)
		{
			new StaticMesh(resources.metalHex, [ 1 * x, -1.5, 1 * y ], [ 0, 0, 1 ], [ 0, 1, 0 ], 1);
		}
	}
}

function loadLevel()
{
	new StaticMesh(resources.damagedwall, [ -1, 1, -17], [ 1, 0, 0 ], [ 0, 0, 1 ]);
	new StaticMesh(resources.damagedwall, [ 1, 1, -17], [ 1, 0, 0 ], [ 0, 0, 1 ]);
	new StaticMesh(resources.damagedwall, [ -1, 3, -17], [ 1, 0, 0 ], [ 0, 0, 1 ]);
	new StaticMesh(resources.damagedwall, [ 1, 3, -17], [ 1, 0, 0 ], [ 0, 0, 1 ]);
	new StaticMesh(resources.doorframe, [ 0, 0, -17], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.door, [ 0, 0, -17 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.doorhandle, [ 0, 0, -17 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);

	for (var i = -8; i < 5; i++)
	{
		new StaticMesh(resources.tiles, [ -1, 0, 2 * i ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
		new StaticMesh(resources.tiles, [ 1, 0, 2 * i ], [ 0, 0, 1 ], [ 0, 1, 0 ]);

		new StaticMesh(resources.plaster, [ -1, 3, 2 * i ], [ 0, 0, 1 ], [ 0, -1, 0 ]);
		new StaticMesh(resources.plaster, [ 1, 3, 2 * i ], [ 0, 0, 1 ], [ 0, -1, 0 ]);

		new StaticMesh(resources.damagedwall, [ -1.5, 1, 2 * i ], [ 0, 0, 1 ], [ 1, 0, 0 ]);
		new StaticMesh(resources.damagedwall, [ -1.5, 3, 2 * i ], [ 0, 0, 1 ], [ 1, 0, 0 ]);

		new StaticMesh(resources.damagedwall, [ 1.5, 1, 2 * i ], [ 0, 0, 1 ], [ -1, 0, 0 ]);
		new StaticMesh(resources.damagedwall, [ 1.5, 3, 2 * i ], [ 0, 0, 1 ], [ -1, 0, 0 ]);

		if (i % 3 == 0)
		{
			new StaticMesh(resources.striplight, [ 0, 2.9, 2 * i ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
			new StaticMesh(resources.striplightfitting, [ 0, 2.9, 2 * i ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
			// new SpotLight([ 0, 2.8, 2 * i ], [ 0, 1, 0 ], [ 3, 3, 3 ], Math.PI / 4, Math.PI / 2);
			// new SpotLight([ 0, 2, 2 * i ], [ 0, -1, 0 ], [ 1, 1, 1 ], 0, Math.PI / 2);
			new PointLight([ 0, 2.8, 2 * i ], [ 1, 1, 1 ]);
		}
	}
}

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
	new StaticMesh(resources.checkpoint, [ 0, 0, -150 ], [ 1, 0, 0 ], [ 0, 1, 0 ]);
	// new SpotLight([ 0, 30, -150 ], [ 0, -1, 0 ], [ 1250, 1000, 1250 ], Math.PI / 5, Math.PI / 4)
	new StaticMesh(resources.checkpoint, [ 0, 0, 150 ], [ -1, 0, 0 ], [ 0, 1, 0 ]);
	// new SpotLight([ 0, 30, 150 ], [ 0, -1, 0 ], [ 1250, 1000, 1250 ], Math.PI / 5, Math.PI / 4)
	new StaticMesh(resources.checkpoint, [ 450, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	// new SpotLight([ 450, 30, 0 ], [ 0, -1, 0 ], [ 1250, 1000, 1250 ], Math.PI / 5, Math.PI / 4)
	new StaticMesh(resources.checkpoint, [ -450, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	// new SpotLight([ -450, 30, 0 ], [ 0, -1, 0 ], [ 1250, 1000, 1250 ], Math.PI / 5, Math.PI / 4)

	var ship = new Ship();
	ship.position = [ -20, 3.5, -150 ];
	ship.facing = [ 1, 0, 0 ];
	new ShipPlayerController(ship);
	camera = new ShipCamera(ship);

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
