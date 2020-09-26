"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.triangleGeometry = new TriangleGeometry(gl);
    this.heartGeometry = new HeartGeometry(gl);
    this.donutGeometry = new DonutGeometry(gl);

    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.fsStriped = new Shader(gl, gl.FRAGMENT_SHADER, "striped-fs.glsl");
    this.fsCheckered = new Shader(gl, gl.FRAGMENT_SHADER, "checkered-fs.glsl");

    this.programs = [];
    this.programs.push( this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid));
    this.programs.push( this.stripedProgram = new Program(gl, this.vsIdle, this.fsStriped));
    this.programs.push( this.checkedProgram = new Program(gl, this.vsIdle, this.fsCheckered));

    this.solidMaterial = new Material(this.solidProgram);
    this.stripedMaterial = new Material(this.stripedProgram);
    this.stripedMaterial.solidColor.set(0.1, 0.4, 0.5);
    this.stripedMaterial.stripeWidth = 0.1;
    this.checkeredMaterial = new Material(this.stripedProgram);
    // this.checkeredMaterial.checkerColorOne.set(0.2, 0.4, 0.5);
    // this.checkeredMaterial.checkerColorTwo.set(0.0, 0.0, 0.5);
    // this.checkeredMaterial.checkerWidth = 4.0;

    this.triangleMesh = new Mesh(this.stripedMaterial, this.triangleGeometry);
    this.donutMesh = new Mesh(this.stripedMaterial, this.donutGeometry);
    this.heartMesh = new Mesh(this.stripedMaterial, this.heartGeometry);

    this.gameObjects = [];
    this.gameObjects.push(this.triangleObject = new GameObject(this.triangleMesh));
    this.gameObjects.push(this.donutObject = new GameObject(this.donutMesh));
    this.gameObjects.push(this.heartObject = new GameObject(this.heartMesh));

    this.triangleObject.position.x = -0.3;
    this.triangleObject.position.y = -0.3;
    this.triangleObject.update();

    this.donutObject.position.x = 0.4;
    this.donutObject.position.y = 0.3;
    this.donutObject.update();

    this.addComponentsAndGatherUniforms(...this.programs);

    this.camera = new OrthoCamera(...this.programs);
    this.selectedObject = 0;

    this.keysPressed = {};
    this.keysPressedFormer = {};
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.clientWidth / canvas.clientHeight);
  }

  update(gl, keysPressed) {
    this.keysPressedFormer = Object.assign({}, this.keysPressed);
    this.keysPressed = Object.assign({}, keysPressed);
    // console.log("Former ".concat(this.keysPressedFormer.T, "    Now ", this.keysPressed.T));

    // console.log(keysPressed);
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 100.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;

    // KEY MOVEMENTS
    if(this.keysPressed.UP){
      this.gameObjects[this.selectedObject].position.y += 0.1;
      this.gameObjects[this.selectedObject].update();
    }
    if(this.keysPressed.DOWN){
      this.gameObjects[this.selectedObject].position.y -= 0.1;
      this.gameObjects[this.selectedObject].update();
    }
    if(this.keysPressed.LEFT){
      this.gameObjects[this.selectedObject].position.x -= 0.1;
      this.gameObjects[this.selectedObject].update();
    }
    if(this.keysPressed.RIGHT){
      this.gameObjects[this.selectedObject].position.x += 0.1;
      this.gameObjects[this.selectedObject].update();
    }

    // TAB BETWEEN OBJECTS
    if(this.keysPressed.T){
      if(this.keysPressedFormer.T === 'undefined' || !this.keysPressedFormer.T){
        this.selectedObject += 1;
        // console.log(this.selectedObject);
        if(this.selectedObject == this.gameObjects.length){
            this.selectedObject = 0; //loop back around
        }
      }
    }

    // OBJECT ROTATION
    if(this.keysPressed.A){
      this.gameObjects[this.selectedObject].orientation += 0.1;
      this.gameObjects[this.selectedObject].update();
    }
    if(this.keysPressed.D){
      this.gameObjects[this.selectedObject].orientation -= 0.1;
      this.gameObjects[this.selectedObject].update();
    }

    // NEW OBJECT CREATED
    if(this.keysPressed.N){
      if(this.keysPressedFormer.N === 'undefined' || !this.keysPressedFormer.N){
        this.gameObjects.push(new GameObject(this.donutMesh));
        this.gameObjects[this.gameObjects.length - 1].position.x = this.camera.position.x;
        this.gameObjects[this.gameObjects.length - 1].position.y = this.camera.position.y;
      }
    }

    // SELECTED OBJECT DELETED
    if(this.keysPressed.U){
      if(this.keysPressedFormer.U === 'undefined' || !this.keysPressedFormer.U){
        this.gameObjects.splice(this.selectedObject, 1);
        if(this.selectedObject >= this.gameObjects.length){ // loops back around if last obj is deleted
          this.selectedObject = 0;
        }
      }
    }

    // PAN
    if(this.keysPressed.MOUSE_DOWN && this.keysPressed.MOUSE_MOVE){
      // console.log("MOUSE DOWN".concat(this.keysPressed.MOUSE_DOWN));
      if(this.keysPressed.CLIENT_X < this.keysPressedFormer.CLIENT_X){ // scrolling left
        this.camera.position.x += 0.2 * dt;
      }else if(this.keysPressed.CLIENT_X > this.keysPressedFormer.CLIENT_X){ // scrolling right
        this.camera.position.x -= 0.2 * dt;
      }

      if(this.keysPressed.CLIENT_Y < this.keysPressedFormer.CLIENT_Y){ // scrolling down
        this.camera.position.y -= 0.2 * dt;
      }else if(this.keysPressed.CLIENT_Y > this.keysPressedFormer.CLIENT_Y){
        this.camera.position.y += 0.2 * dt; // scrolling up
      }
      this.camera.update();
    }



    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const objects of this.gameObjects){
      objects.update();
    }

    for(const objects of this.gameObjects){
      objects.draw(this, this.camera);
    }

    this.gameObjects[this.selectedObject].using(this.solidMaterial).draw(this, this.camera);


  }
}
