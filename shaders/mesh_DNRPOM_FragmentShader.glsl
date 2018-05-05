#version 300 es

precision mediump float;
in vec2 vTexcoord;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vTangent;
in vec3 vBiTangent;
in vec3 vTsViewPos;
in vec3 vTsFragPos;

uniform sampler2D diffuseTex;
uniform sampler2D normalTex;
uniform sampler2D roughnessTex;
uniform sampler2D displacementTex;

uniform float depthScale;
uniform float numLayers;

out vec4 fragColor[4];

void main(void)
{
	// Calculate POM uvs
	vec3 viewDir = normalize(vTsViewPos - vTsFragPos);

	float layerDepth = 1.0 / numLayers;
	float curLayerDepth = 0.0;
	vec2 deltauv = viewDir.xy * depthScale / (viewDir.z * numLayers);
	vec2 curuv = vTexcoord;

	float depthTex = texture(displacementTex, curuv).r;

	for (int i = 0; i < 32; i++)
	{
		curLayerDepth += layerDepth;
		curuv -= deltauv;
		depthTex = texture(displacementTex, curuv).r;
		if (depthTex < curLayerDepth)
		{
			break;
		}
	}

	vec2 prevuv = curuv + deltauv;
	float next = depthTex - curLayerDepth;
	float prev = texture(displacementTex, prevuv).r - curLayerDepth + layerDepth;
	float weight = next / (next - prev);

	vec2 pTexcoord = mix(curuv, prevuv, weight);


	vec4 normalMap = 2.0 * texture(normalTex, pTexcoord) - vec4(1.0);
	fragColor[0] = texture(diffuseTex, pTexcoord);
	fragColor[1] = vec4(normalize(normalMap.r * vTangent + normalMap.g * vBiTangent + normalMap.b * vNormal), 1.0);
	fragColor[2] = vec4(vPosition, 1.0);
	fragColor[3] = vec4(clamp(texture(roughnessTex, pTexcoord).x, 0.01, 1.0));
}
