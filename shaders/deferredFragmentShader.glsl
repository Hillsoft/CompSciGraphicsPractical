#version 300 es

precision mediump float;

in vec2 vTexcoord;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D positionTex;

out vec4 fragColor;

void main(void)
{
	vec4 diffuse = texture(diffuseTex, vTexcoord);
	vec3 normal = texture(normalTex, vTexcoord).xyz;
	vec3 position = texture(positionTex, vTexcoord).xyz;

	float lightingValue = clamp(dot(normal, normalize(vec3(-1.0, 1.0, 0.0))), 0.0, 1.0);
	lightingValue += 0.3;
	lightingValue = clamp(lightingValue, 0.0, 1.0);
	fragColor = vec4(vec3(lightingValue), 1.0) * diffuse;
}
