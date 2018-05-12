function aabbPlaneCollision(aabbMin, aabbMax, planeNormal, planeConstant)
{
	var center = scaleVector(0.5, addVectors(aabbMin, aabbMax));
	var extents = addVectors(aabbMax, scaleVector(-1, center));

	var r = extents[0] * Math.abs(planeNormal[0]) + extents[1] * Math.abs(planeNormal[1]) + extents[2] * Math.abs(planeNormal[2]);
	var s = dot(planeNormal, center) - planeConstant;

	// console.log(r);
	// console.log(s);

	return Math.abs(s) <= r;
}