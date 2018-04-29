#version 300 es

precision mediump float;

in vec2 vTexcoord;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D positionTex;
uniform vec3 lights[100];
uniform vec3 lightColors[100];
uniform int numLights;

out vec4 fragColor;

void main(void)
{
	vec4 diffuse = texture(diffuseTex, vTexcoord);
	vec3 normal = texture(normalTex, vTexcoord).xyz;
	vec3 position = texture(positionTex, vTexcoord).xyz;

	vec3 lightingValue = vec3(0.0);
	float curLight = 0.0;
	vec3 relativeLight = vec3(0.0);
	for (int i = 0; i < numLights; i++)
	{
		relativeLight = lights[i] - position;
		curLight = dot(normal, normalize(relativeLight)) * (1.0 / dot(relativeLight, relativeLight));
		if (curLight < 0.0)
		{
			curLight = 0.0;
		}
		lightingValue += curLight * lightColors[i];
	}

	lightingValue += 0.3;
	fragColor = vec4(lightingValue, 1.0) * diffuse;

	if (diffuse.w == 0.0)
	{
		fragColor = vec4(0.3, 0.3, 0.3, 1.0);
	}
}
