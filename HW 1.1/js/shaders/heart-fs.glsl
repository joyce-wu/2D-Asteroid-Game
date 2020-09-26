Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 modelPosition;
  in float time;

  void main(void) {
    if(fract(modelPosition.x * 4.0) < 0.5 && fract(modelPosition.y * 4.0) < 0.5 ){
      fragmentColor = vec4(0.5, 1, 1, 1);
    }else if(fract(modelPosition.x * 4.0) > 0.5 && fract(modelPosition.y * 4.0) > 0.5){
      fragmentColor = vec4(0.5, 1, 1, 1);
    }else{
      fragmentColor = vec4(0.25, 0.25, 0, 1);
    }
  }
`;
