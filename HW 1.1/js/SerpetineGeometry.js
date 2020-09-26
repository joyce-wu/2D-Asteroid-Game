"use strict";

class SerpetineGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [];
    var offsetY = 0.15;
    var numFans = 200;
    var coordX = -1.0;
    var radius = 0.70;
    var angle = (4 * Math.PI) / numFans;
    for(var v = 0; v < numFans; v++){ // even index is outer, odd is inner
        vertexArray.push(coordX, radius * Math.sin(angle * v) + offsetY, 0.5);
        vertexArray.push(coordX, radius * Math.sin(angle * v), 0.5);
        coordX += 0.01;
    }
    // console.log(vertexArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    var colorArray = [];
    var numVertices = numFans * 2;
    for(var v = 0; v < numVertices; v++){
      // colorArray.push(Math.random());
      colorArray.push(0, 0, 0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.indexArray = [];
    for(var i = 0; i < numVertices; i++){
      this.indexArray.push(i);
    }
    // indexArray.push(0, 1);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexArray), gl.STATIC_DRAW);

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

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_STRIP, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
  }
}
