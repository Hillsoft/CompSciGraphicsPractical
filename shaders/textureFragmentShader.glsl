precision mediump float;
varying vec2 vTexcoord;
varying vec3 vNormal;

uniform sampler2D diffuseTex;

void main(void)
{
	float lightingValue = clamp(dot(vNormal, normalize(vec3(-1.0, 1.0, 0.0))), 0.0, 1.0);
	lightingValue += 0.3;
	lightingValue = clamp(lightingValue, 0.0, 1.0);
	gl_FragColor = vec4(vec3(lightingValue), 1.0) * texture2D(diffuseTex, vTexcoord);
}
