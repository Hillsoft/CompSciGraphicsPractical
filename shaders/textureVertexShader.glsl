attribute vec3 position;
attribute vec2 texcoord;
attribute vec3 normal;

uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 mMatrix;

varying vec2 vTexcoord;
varying vec3 vNormal;

void main(void)
{
	gl_Position = pMatrix * vMatrix * mMatrix * vec4(position, 1.0);
	vTexcoord = texcoord;
	vNormal = (mMatrix * vec4(normal, 0.0)).xyz;
}
