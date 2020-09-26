"use strict";

class StarGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [0.0, 0.0, 0.5];
    var outerRadius = 0.40;
    var innerRadius = 0.15;
    var angle = (36 * Math.PI) / 180;
    for(var v = 0; v < 10; v++){
      if(v%2 == 0){ //outer vertices
        vertexArray.push(outerRadius * Math.cos(angle * v), outerRadius * Math.sin(angle * v), 0.5);
      }else{
        vertexArray.push(innerRadius * Math.cos(angle * v), innerRadius * Math.sin(angle * v) , 0.5);
      }
    }
    console.log(vertexArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    var colorArray = [];
    for(var v = 0; v < 11 * 3; v++){
      // colorArray.push(this.getRandomInt(256));
      colorArray.push(Math.random());
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    var indexArray = [];
    for(var i = 0; i < 11; i++){
      indexArray.push(i);
    }
    indexArray.push(1);
    console.log(indexArray);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< four pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT, //< four pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindVertexArray(null);
  }

  // getRandomInt(max){
  //   return Math.floor(Math.random() * Math.floor(max));
  // }

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_FAN, 12, gl.UNSIGNED_SHORT, 0);
  }
}
