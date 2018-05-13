function aabbPlaneCollision(aabbMin, aabbMax, planeNormal, planeConstant)
{
	var center = scaleVector(0.5, addVectors(aabbMin, aabbMax));
	var extents = addVectors(aabbMax, scaleVector(-1, center));

	var r = extents[0] * Math.abs(planeNormal[0]) + extents[1] * Math.abs(planeNormal[1]) + extents[2] * Math.abs(planeNormal[2]);
	var s = dot(planeNormal, center) - planeConstant;

	return Math.abs(s) <= r;
}

function aabbRayCollision(aabbMin, aabbMax, rayStart, rayEnd)
{
	var rDelta = addVectors(rayEnd, scaleVector(-1, rayStart));

	var rDeltaInv = [ 1 / rDelta[0], 1 / rDelta[1], 1 / rDelta[2] ];
	var sign = [ rDeltaInv[0] < 0 ? 1 : 0, rDeltaInv[1] < 0 ? 1 : 0, rDeltaInv[2] < 0 ? 1 : 0 ];

	var bounds = [ aabbMin, aabbMax ];
	var tMin = (bounds[sign[0]][0] - rayStart[0]) * rDeltaInv[0];
	var tMax = (bounds[1 - sign[0]][0] - rayStart[0]) * rDeltaInv[0];
	var tyMin = (bounds[sign[1]][1] - rayStart[1]) * rDeltaInv[1];
	var tyMax = (bounds[1 - sign[1]][1] - rayStart[1]) * rDeltaInv[1];

	if (!isFinite(tyMin) && !isFinite(tyMax))
	{
		if (tyMin > 0) tyMin = -tyMin;
		if (tyMax < 0) tyMax = -tyMax;
	}

	if ((tMin > tyMax) || (tyMin > tMax))
		return false;
	if (tyMin > tMin)
		tMin = tyMin;
	if (tyMax < tMax)
		tMax = tyMax;

	var tzMin = (bounds[sign[2]][2] - rayStart[2]) * rDeltaInv[2];
	var tzMax = (bounds[1 - sign[2]][2] - rayStart[2]) * rDeltaInv[2];

	if ((tMin > tzMax) || (tzMin > tMax))
		return false;
	if (tzMin > tMin)
		tMin = tzMin;
	if (tzMax < tMax)
		tMax = tzMax;

	return (
		(0 <= tMin && tMin <= 1) ||
		(0 <= tMax && tMax <= 1) ||
		(tMin < 0 && tMax > 1)
	);
}
