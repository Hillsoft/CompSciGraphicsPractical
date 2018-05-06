function loadLevel()
{
	new SpotLight([ 0, 3.8, 0 ], [ 0, 1, 0 ], [ 5, 5, 5 ], Math.PI / 4, Math.PI / 2);
	new SpotLight([ 0, 3, 0 ], [ 0, -1, 0 ], [ 1, 1, 1 ], 0, Math.PI / 2);

	new StaticMesh(resources.tiles, [ -1, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);
	new StaticMesh(resources.tiles, [ 1, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ]);

	new StaticMesh(resources.plaster, [ -1, 4, 0 ], [ 0, 0, 1 ], [ 0, -1, 0 ]);
	new StaticMesh(resources.plaster, [ 1, 4, 0 ], [ 0, 0, 1 ], [ 0, -1, 0 ]);

	new StaticMesh(resources.damagedwall, [ -2, 1, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ]);
	new StaticMesh(resources.damagedwall, [ -2, 3, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ]);

	new StaticMesh(resources.damagedwall, [ 2, 1, 0 ], [ 0, 0, 1 ], [ -1, 0, 0 ]);
	new StaticMesh(resources.damagedwall, [ 2, 3, 0 ], [ 0, 0, 1 ], [ -1, 0, 0 ]);
}
