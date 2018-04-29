var llAdd = list => obj =>
{
	list.next = {
		val: obj,
		next: list.next
	};
}

var llRemove = list => obj =>
{
	var curObject = list;
	while (curObject.next != null)
	{
		if (curObject.next.val == obj)
		{
			curObject.next = curObject.next.next;
		}
		curObject = curObject.next;
	}
}

function makeTranslationMatrix(x, y, z)
{
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	];
}

function mat4Multiply(a, b)
{
	var res = [];
	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			res[4*i + j] = 0;
			for (var k = 0; k < 4; k++)
			{
				res[4*i + j] += a[4*i + k] * b[4*k + j];
			}
		}
	}
	return res;
}

function length(x)
{
	return Math.sqrt(x[0]*x[0] + x[1]*x[1] + x[2]*x[2]);
}

function normalize(x)
{
	var l = length(x);
	return [ x[0] / l, x[1] / l, x[2] / l ];
}

function scaleVector(s, x)
{
	return [ s * x[0], s * x[1], s * x[2] ];
}

function addVectors(x, y)
{
	return [ x[0] + y[0], x[1] + y[1], x[2] + y[2] ];
}

function subVectors(x, y)
{
	return [ x[0] - y[0], x[1] - y[1], x[2] - y[2] ];
}

function subVectors2(x, y)
{
	return [ x[0] - y[0], x[1] - y[1] ];
}

function cross(a, b) {
	return [
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	];
}

function inverse(m) {
	var m00 = m[0 * 4 + 0];
	var m01 = m[0 * 4 + 1];
	var m02 = m[0 * 4 + 2];
	var m03 = m[0 * 4 + 3];
	var m10 = m[1 * 4 + 0];
	var m11 = m[1 * 4 + 1];
	var m12 = m[1 * 4 + 2];
	var m13 = m[1 * 4 + 3];
	var m20 = m[2 * 4 + 0];
	var m21 = m[2 * 4 + 1];
	var m22 = m[2 * 4 + 2];
	var m23 = m[2 * 4 + 3];
	var m30 = m[3 * 4 + 0];
	var m31 = m[3 * 4 + 1];
	var m32 = m[3 * 4 + 2];
	var m33 = m[3 * 4 + 3];
	var tmp_0  = m22 * m33;
	var tmp_1  = m32 * m23;
	var tmp_2  = m12 * m33;
	var tmp_3  = m32 * m13;
	var tmp_4  = m12 * m23;
	var tmp_5  = m22 * m13;
	var tmp_6  = m02 * m33;
	var tmp_7  = m32 * m03;
	var tmp_8  = m02 * m23;
	var tmp_9  = m22 * m03;
	var tmp_10 = m02 * m13;
	var tmp_11 = m12 * m03;
	var tmp_12 = m20 * m31;
	var tmp_13 = m30 * m21;
	var tmp_14 = m10 * m31;
	var tmp_15 = m30 * m11;
	var tmp_16 = m10 * m21;
	var tmp_17 = m20 * m11;
	var tmp_18 = m00 * m31;
	var tmp_19 = m30 * m01;
	var tmp_20 = m00 * m21;
	var tmp_21 = m20 * m01;
	var tmp_22 = m00 * m11;
	var tmp_23 = m10 * m01;

	var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
		(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
		(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
		(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
		(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	return [
	  d * t0,
	  d * t1,
	  d * t2,
	  d * t3,
	  d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
			(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
	  d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
			(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
	  d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
			(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
	  d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
			(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
	  d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
			(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
	  d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
			(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
	  d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
			(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
	  d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
			(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
	  d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
			(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
	  d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
			(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
	  d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
			(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
	  d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
			(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
	];
}
