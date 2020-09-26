"use strict";

class Geometry {
  constructor(gl) {
    this.gl = gl;
  }

  drawSerpentine() {
    const gl = this.gl;
    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [];
    var offsetY = 0.05;
    var numFans = 200;
    var coordX = -1.0;
    var radius = 0.85;
    var angle = (4 * Math.PI) / numFans;
    for(var v = 0; v < numFans; v++){ // even index is outer, odd is inner
        vertexArray.push(coordX, radius * Math.sin(angle * v) + offsetY, 0.5);
        vertexArray.push(coordX, radius * Math.sin(angle * v), 0.5);
        coordX += 0.01;
    }
    console.log(vertexArray);
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
    var indexArray = [];
    for(var i = 0; i < numVertices; i++){
      indexArray.push(i);
    }
    // indexArray.push(0, 1);
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

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_STRIP, indexArray.length, gl.UNSIGNED_SHORT, 0);
  }

  drawCrescent() {
    const gl = this.gl;
    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [];
    var radius = 0.50;
    var numFans = 100;
    var angle = (2 * Math.PI) / numFans;
    var offsetX = 0.15;
    var offsetY = 0.15;
    for(var v = 0; v < numFans; v++){ // even index is outer, odd is inner (offset a little to right)
        vertexArray.push(radius * Math.cos(angle * v), radius * Math.sin(angle * v), 0.5);
        vertexArray.push(radius * Math.cos(angle * v), radius * Math.sin(angle * v), 0.5);
        // vertexArray.push(radius * Math.cos(angle * v) + offsetX, radius * Math.sin(angle * v) + offsetY, 0.5);
    }
    console.log(vertexArray);
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
    var indexArray = [];
    for(var i = 0; i < numVertices; i++){
      indexArray.push(i);
    }
    indexArray.push(0, 1);
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

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, indexArray.length, gl.UNSIGNED_SHORT, 0);
  }

  drawDonut() {
    const gl = this.gl;
    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [];
    var innerRadius = 0.30;
    var outerRadius = 0.40;
    var numFans = 100;
    var angle = (2 * Math.PI) / numFans;
    for(var v = 0; v < numFans; v++){ // even index is outer, odd is inner
        vertexArray.push(outerRadius * Math.cos(angle * v), outerRadius * Math.sin(angle * v), 0.5);
        vertexArray.push(innerRadius * Math.cos(angle * v), innerRadius * Math.sin(angle * v), 0.5);
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
    var indexArray = [];
    for(var i = 0; i < numVertices; i++){
      indexArray.push(i);
    }
    indexArray.push(0, 1);
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

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_STRIP, indexArray.length, gl.UNSIGNED_SHORT, 0);
  }

  drawHeart() {
    const gl = this.gl;
    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    var vertexArray = [0.0, 0.0, 0.5];
    var numFans = 100;
    var numVertices = numFans + 1;
    var angle = (2 * Math.PI) / numFans;
    var angles = [];
    for(var v = 0; v < numFans; v++){
      var currentAngle = v * angle;
      angles.push(currentAngle);
      var x = 16 * Math.pow(Math.sin(currentAngle), 3);
      var y = 13 * Math.cos(currentAngle) - 5*Math.cos(2*currentAngle) - 2*Math.cos(3*currentAngle) - Math.cos(4*currentAngle);
      vertexArray.push(x/35, y/35, 0.5);
    }
    // console.log(vertexArray);
    console.log(angles);
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

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_FAN, indexArray.length, gl.UNSIGNED_SHORT, 0);
  }

}
