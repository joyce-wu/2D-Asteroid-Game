Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

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
    float newPos = pow(sin(length(vertexPosition) / 2.0), gameObject.time);
    gl_Position.x = vertexPosition.x * newPos;
    gl_Position.y = vertexPosition.y * newPos;
    gl_Position.xyz += gameObject.position;
    color = vertexColor;
    modelPosition = vertexPosition;
    time = gameObject.time;
  }
`;
