#version 300 es

precision mediump float;

const vec3 ambientLight = vec3(0.05);
const float PI = 3.1415926;
const float r0 = 0.1;

in vec2 vTexcoord;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D positionTex;
uniform sampler2D roughnessTex;
uniform vec3 lights[32];
uniform vec3 lightColors[32];
uniform vec3 lightDirections[32];
uniform vec2 lightRadii[32];
uniform int lightTypes[32];
uniform int numLights;
uniform vec3 cameraPosition;

out vec4 fragColor;

float sqr(float x)
{
	return x*x;
}

float chi(float x)
{
	if (x > 0.0)
	{
		return 1.0;
	}

	return 0.0;
}

void main(void)
{
	vec4 diffuse = texture(diffuseTex, vTexcoord);
	vec3 normal = texture(normalTex, vTexcoord).xyz;
	vec3 position = texture(positionTex, vTexcoord).xyz;
	float roughness = texture(roughnessTex, vTexcoord).x;
	// float metallic = texture(roughnessTex, vTexcoord).y;
	float metallic = 0.0;
	// float diffuseVal = texture(roughnessTex, vTexcoord).z;
	float diffuseVal = 0.5 * (1.0 - metallic);

	if (diffuse.w == 0.0)
	{
		fragColor = vec4(ambientLight, 1.0);
		return;
	}

	vec3 relativeCamera = normalize(cameraPosition - position);

	vec3 lightingValue = vec3(0.0);
	float curLight = 0.0;
	vec3 relativeLight = vec3(0.0);
	float lightDist = 1.0;
	fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 perfectReflection = vec3(0.0);
	float fresnel = 0.0;
	float ndotl = 0.0;
	float ndoth = 0.0;
	float ndotv = 0.0;
	float vdoth = 0.0;
	vec3 halfVector = vec3(0.0);
	float d = 0.0;
	float g = 1.0;
	for (int i = 0; i < numLights; i++)
	{
		if (lightTypes[i] == 0)
		{
			relativeLight = -lightDirections[i];
			lightDist = 1.0;
		}
		if (lightTypes[i] == 1)
		{
			relativeLight = lights[i] - position;
			lightDist = min(1.0, 1.0 / dot(relativeLight, relativeLight));
		}
		if (lightTypes[i] == 2)
		{
			relativeLight = lights[i] - position;
			lightDist = min(3.0, 1.0 / dot(relativeLight, relativeLight));
			lightDist *= clamp((dot(normalize(relativeLight), lightDirections[i]) - lightRadii[i].y) / (lightRadii[i].x - lightRadii[i].y), 0.0, 1.0);
		}
		relativeLight = normalize(relativeLight);
		ndotl = dot(normal, relativeLight);
		halfVector = normalize(relativeLight + relativeCamera);
		ndoth = max(0.0, dot(normal, halfVector));
		ndotv = max(0.0, dot(normal, relativeCamera));
		vdoth = max(0.0, dot(relativeCamera, halfVector));

		// d = exp(-(1.0 - sqr(ndoth)) / (sqr(ndoth) * sqr(roughness))) / (PI * sqr(roughness) * sqr(sqr(ndoth)));
		if (ndoth <= 0.0)
		{
			d = 0.0;
		}
		else
		{
			d = sqr(roughness) / (PI * sqr(ndoth * (sqr(roughness) + (1.0 - sqr(ndoth)) / sqr(ndoth))));
		}

		fresnel = 1.0 - ndotv;
		fresnel = r0 + (1.0 - r0) * sqr(sqr(fresnel)) * fresnel;

		g = min(1.0, min(2.0 * ndoth * ndotv, 2.0 * ndoth * ndotl) / vdoth);

		fragColor += vec4(vec3(max(0.0, (1.0 - diffuseVal) * (d * fresnel * g / (4.0 * ndotv * ndotl)) * lightDist) * lightColors[i] * mix(vec3(1.0), diffuse.xyz, metallic)), 0.0);

		curLight = max(0.0, ndotl * lightDist);
		lightingValue += curLight * lightColors[i];
	}

	lightingValue *= diffuseVal;
	lightingValue += ambientLight + 0.1 * (1.0 - diffuseVal);
	fragColor += vec4(lightingValue, 0.0) * diffuse;
}
