Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 modelPosition;

  uniform struct{
    vec4 checkerColorOne;
    vec4 checkerColorTwo;
    float checkerWidth;
  } material;

  void main(void) {
    if(fract(modelPosition.x * material.checkerWidth) < 0.5 && fract(modelPosition.y * material.checkerWidth) < 0.5 ){
      fragmentColor = material.checkerColorOne;
    }else if(fract(modelPosition.x * material.checkerWidth) > 0.5 && fract(modelPosition.y * material.checkerWidth) > 0.5){
      fragmentColor = material.checkerColorOne;
    }else{
      fragmentColor = material.checkerColorTwo;
    }
  }
`;
