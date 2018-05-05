#version 300 es

precision mediump float;
in vec2 vTexcoord;
in vec3 vNormal;
in vec3 vPosition;

uniform sampler2D diffuseTex;
uniform float roughness;

out vec4 fragColor[4];

void main(void)
{
	fragColor[0] = texture(diffuseTex, vTexcoord);
	fragColor[1] = vec4(vNormal, 1.0);
	fragColor[2] = vec4(vPosition, 1.0);
	fragColor[3] = vec4(vec3(clamp(roughness, 0.01, 1.0)), 1.0);
}
