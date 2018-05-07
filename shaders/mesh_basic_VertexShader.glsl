#version 300 es

in vec3 position;
in vec3 normal;

uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 mMatrix;

out vec3 vNormal;
out vec3 vPosition;

void main(void)
{
	vPosition = (mMatrix * vec4(position, 1.0)).xyz;
	gl_Position = pMatrix * vMatrix * vec4(vPosition, 1.0);
	vNormal = (mMatrix * vec4(normal, 0.0)).xyz;
}
