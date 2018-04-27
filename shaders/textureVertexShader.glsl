attribute vec3 position;
attribute vec2 texcoord;

uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 mMatrix;

varying vec2 vTexcoord;

void main(void)
{
	gl_Position = pMatrix * vMatrix * mMatrix * vec4(position, 1.0);
	vTexcoord = texcoord;
}
