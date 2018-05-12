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
