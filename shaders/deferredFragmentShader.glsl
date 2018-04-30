#version 300 es

precision mediump float;

const vec3 ambientLight = vec3(0.1);

in vec2 vTexcoord;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D positionTex;
uniform sampler2D roughnessTex;
uniform vec3 lights[100];
uniform vec3 lightColors[100];
uniform int numLights;
uniform vec3 cameraPosition;

out vec4 fragColor;

void main(void)
{
	vec4 diffuse = texture(diffuseTex, vTexcoord);
	vec3 normal = texture(normalTex, vTexcoord).xyz;
	vec3 position = texture(positionTex, vTexcoord).xyz;
	float roughness = texture(roughnessTex, vTexcoord).x;

	vec3 lightingValue = vec3(0.0);
	float curLight = 0.0;
	vec3 relativeLight = vec3(0.0);
	fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 perfectReflection = vec3(0.0);
	for (int i = 0; i < numLights; i++)
	{
		relativeLight = lights[i] - position;
		curLight = max(0.0, dot(normal, normalize(relativeLight)) * (1.0 / dot(relativeLight, relativeLight)));
		lightingValue += curLight * lightColors[i];

		perfectReflection = normalize(2.0 * dot(normalize(relativeLight), normal) * normal - normalize(relativeLight));
		fragColor += vec4((1.0 - (roughness * 0.85)) * pow(max(0.0, dot(perfectReflection, normalize(cameraPosition - position))), 1.0 / roughness) * (1.0 / dot(relativeLight, relativeLight)) * lightColors[i], 0.0);
	}

	lightingValue += ambientLight;
	fragColor += vec4(lightingValue, 0.0) * diffuse;

	if (diffuse.w == 0.0)
	{
		fragColor = vec4(ambientLight, 1.0);
	}
}
