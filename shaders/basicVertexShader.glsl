attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 mMatrix;

void main(void)
{
	gl_Position = pMatrix * vMatrix * mMatrix * vec4(position, 1.0);
	vColor = color;
}
