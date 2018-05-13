#version 300 es

precision mediump float;
in vec3 vNormal;
in vec3 vPosition;

uniform vec3 diffuse;
uniform float roughness;
uniform float diffuseVal;
uniform float metallic;

out vec4 fragColor[5];

void main(void)
{
	fragColor[0] = vec4(diffuse, 1.0);
	fragColor[1] = vec4(vNormal, 1.0);
	fragColor[2] = vec4(vPosition, 1.0);
	fragColor[3] = vec4(clamp(roughness, 0.01, 1.0), metallic, diffuseVal, 1.0);
	fragColor[4] = vec4(0.0, 0.0, 0.0, 1.0);
}
