#version 300 es

precision highp float;
in vec3 position;
in vec2 texcoord;
in vec3 normal;
in vec3 tangent;
in vec3 biTangent;

uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 mMatrix;

out vec2 vTexcoord;
out vec3 vNormal;
out vec3 vPosition;
out vec3 vTangent;
out vec3 vBiTangent;

void main(void)
{
	vPosition = (mMatrix * vec4(position, 1.0)).xyz;
	gl_Position = pMatrix * vMatrix * vec4(vPosition, 1.0);
	vTexcoord = texcoord;
	vNormal = normalize(mMatrix * vec4(normal, 0.0)).xyz;
	vTangent = normalize(mMatrix * vec4(tangent, 0.0)).xyz;
	vBiTangent = normalize(mMatrix * vec4(biTangent, 0.0)).xyz;
}
