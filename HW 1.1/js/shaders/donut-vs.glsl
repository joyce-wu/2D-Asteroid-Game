Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexColor;
  out vec4 color;
  out vec4 modelPosition;
  out float time;

  uniform struct{
    vec3 position;
    float time;
  } gameObject;

  void main(void) {
    gl_Position = vertexPosition;
    gl_Position.xyz += gameObject.position;
    color = vertexColor;
    modelPosition = gl_Position;
    time = gameObject.time;
  }
`;
