Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 modelPosition;
  in float time;

  void main(void) {
  if(fract(modelPosition.x * 10.0) < 0.5 && fract(modelPosition.y * 10.0) < 0.5 ){
    fragmentColor = vec4(1, 1, 1, 1);
  }else if(fract(modelPosition.x * 10.0) > 0.5 && fract(modelPosition.y * 10.0) > 0.5){
    fragmentColor = vec4(1, 1, 1, 1);
  }else{
    fragmentColor = vec4(0, 1, 0, 1);
  }

  }
`;
