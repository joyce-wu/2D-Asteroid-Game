Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
in vec4 vertexPosition;
in vec4 vertexTexCoord;
out vec4 texCoord; // passed to FS
out vec4 modelPosition;

uniform struct {
	mat4 modelMatrix;
} gameObject;

uniform struct {
  mat4 viewProjMatrix;
} camera;

uniform struct {
  float offsetX;
  float offsetY;
} sprite;

void main(void) {
  texCoord.x = vertexTexCoord.x / 6.0 + sprite.offsetX;
  texCoord.y = vertexTexCoord.y / 6.0 + sprite.offsetY;
  modelPosition = vertexPosition;
  gl_Position = vertexPosition * gameObject.modelMatrix
   * camera.viewProjMatrix;
}
`;
