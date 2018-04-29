#version 300 es

precision mediump float;
in vec2 vTexcoord;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vTangent;
in vec3 vBiTangent;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D roughnessTex;

out vec4 fragColor[4];

void main(void)
{
	vec4 normalMap = 2.0 * texture(normalTex, vTexcoord) - vec4(1.0);
	fragColor[0] = texture(diffuseTex, vTexcoord);
	fragColor[1] = vec4(normalMap.r * vTangent + normalMap.g * vBiTangent + normalMap.b * vNormal, 1.0);
	fragColor[2] = vec4(vPosition, 1.0);
	fragColor[3] = vec4(clamp(texture(roughnessTex, vTexcoord).x, 0.01, 1.0));
}
