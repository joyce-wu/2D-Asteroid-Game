"use strict";

class HeartGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [0.0, 0.0, 0.5];
    var numFans = 100;
    var numVertices = numFans + 1;
    this.numVertices = numVertices;
    var angle = (2 * Math.PI) / numFans;
    var angles = [];
    for(var v = 0; v < numFans; v++){
      var currentAngle = v * angle;
      angles.push(currentAngle);
      var x = 16 * Math.pow(Math.sin(currentAngle), 3);
      var y = 13 * Math.cos(currentAngle) - 5*Math.cos(2*currentAngle) - 2*Math.cos(3*currentAngle) - Math.cos(4*currentAngle);
      vertexArray.push(x/55, y/55, 0.5);
    }
    // console.log(vertexArray);
    // console.log(angles);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    var colorArray = [];
    for(var v = 0; v < numVertices; v++){
      colorArray.push(0, 0, 0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    var indexArray = [];
    for(var i = 0; i < numVertices; i++){
      indexArray.push(i);
    }
    indexArray.push(1);
    // console.log(indexArray);
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

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_FAN, this.numVertices, gl.UNSIGNED_SHORT, 0);
  }
}
