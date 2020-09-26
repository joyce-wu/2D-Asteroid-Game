"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsDonut = new Shader(gl, gl.VERTEX_SHADER, "donut-vs.glsl");
    this.fsDonut = new Shader(gl, gl.FRAGMENT_SHADER, "donut-fs.glsl");
    this.donutProgram = new Program(gl, this.vsDonut, this.fsDonut);
    this.donutGeometry = new DonutGeometry(gl);
    this.donutPosition = {x: -0.55, y: -0.45, z: 0.0};

    this.vsHeart = new Shader(gl, gl.VERTEX_SHADER, "heart-vs.glsl");
    this.fsHeart = new Shader(gl, gl.FRAGMENT_SHADER, "heart-fs.glsl");
    this.heartProgram = new Program(gl, this.vsHeart, this.fsHeart);
    this.heartGeometry = new HeartGeometry(gl);
    this.heartPosition = {x: 0.3, y: 0.15, z: 0.0}

    this.vsSerpetine = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSerpetine = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.serpetineProgram = new Program(gl, this.vsSerpetine, this.fsSerpetine);
    this.serpetineGeometry = new SerpetineGeometry(gl);
    this.serpetinePosition = {x: 0, y: 0, z: 0};

    this.time = new Date().getTime();
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    // console.log(keysPressed);
    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.time = new Date().getTime();

    // serpetine
    gl.useProgram(this.serpetineProgram.glProgram);
    const serpetinePositionHandle = gl.getUniformLocation(this.serpetineProgram.glProgram, "gameObject.position");
    const serpetineTime = gl.getUniformLocation(this.serpetineProgram.glProgram, "gameObject.time");
    gl.uniform3f(serpetinePositionHandle, this.serpetinePosition.x, this.serpetinePosition.y, this.serpetinePosition.z);
    gl.uniform1f(serpetineTime, Math.sin(this.time / 400));
    this.serpetineGeometry.draw();

    // donut
    gl.useProgram(this.donutProgram.glProgram);
    const donutPositionHandle = gl.getUniformLocation(this.donutProgram.glProgram, "gameObject.position");
    const donutTime = gl.getUniformLocation(this.donutProgram.glProgram, "gameObject.time");
    if(donutPositionHandle === null) {
      console.log("Could not find uniform: gameObject.position.");
    } else {
      gl.uniform3f(donutPositionHandle, this.donutPosition.x, this.donutPosition.y, this.donutPosition.z);
      gl.uniform1f(donutTime, Math.abs(Math.sin(this.time)));
    }

    if(keysPressed["RIGHT"] === true){
      if(this.donutPosition.x > 2.0){
        this.donutPosition.x = -2.0; //wraps around if it leaves the canvas
      }else{
        this.donutPosition.x += 0.1;
      }
    }
    if(keysPressed["LEFT"] === true){
      if(this.donutPosition.x < -2.0){
        this.donutPosition.x = 2.0;
      }else{
        this.donutPosition.x -= 0.1;
      }
    }
    if(keysPressed["UP"] === true){
      if(this.donutPosition.y > 2.0){
        this.donutPosition.y = -2.0; //wraps around if it leaves the canvas
      }else{
        this.donutPosition.y += 0.1;
      }
    }
    if(keysPressed["DOWN"] === true){
      if(this.donutPosition.y < -2.0){
        this.donutPosition.y = 2.0;
      }else{
        this.donutPosition.y -= 0.1;
      }
    }
    this.donutGeometry.draw();

    // heart
    gl.useProgram(this.heartProgram.glProgram);
    const heartPositionHandle = gl.getUniformLocation(this.heartProgram.glProgram, "gameObject.position");
    const heartTimeHandle = gl.getUniformLocation(this.heartProgram.glProgram, "gameObject.time");
    gl.uniform1f(heartTimeHandle, Math.sin(this.time * 0.002));
    gl.uniform3f(heartPositionHandle, this.heartPosition.x, this.heartPosition.y, this.heartPosition.z);
    console.log(this.time / 10000);
    this.heartGeometry.draw();

  }
}
