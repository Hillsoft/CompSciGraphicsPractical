#version 300 es

in vec2 position;

out vec2 vTexcoord;

void main(void)
{
	gl_Position = vec4(position, 1.0, 1.0);
	vTexcoord = vec2((position.x + 1.0) / 2.0, (position.y + 1.0) / 2.0);
}
