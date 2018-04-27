precision mediump float;
varying vec2 vTexcoord;

uniform sampler2D diffuseTex;

void main(void)
{
	gl_FragColor = texture2D(diffuseTex, vTexcoord);
}
