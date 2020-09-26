    "use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
    this.vsSpriteTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-sprite-vs.glsl");
    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.programs.push(
        this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));
    this.programs.push(
        this.spriteProgram = new TexturedProgram(gl, this.vsSpriteTextured, this.fsTextured));
    this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
    this.programs.push(
        this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsTextured));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);

    this.gameObjects = [];
    this.backgroundMaterial = new Material(this.backgroundProgram);
    this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/background.jpg"));
    this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);
    this.background = new GameObject( this.backgroundMesh );
    this.background.update = function(){};
    this.gameObjects.push(this.background);

    this.raiderMaterial = new Material(this.texturedProgram);
    this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/raider.png"));
    this.raiderMesh = new Mesh(this.raiderMaterial, this.texturedQuadGeometry);
    this.avatar = new GameObject( this.raiderMesh );
    this.avatar.position.set(-13, -13);
    this.gameObjects.push(this.avatar);

    this.flameMaterial = new Material(this.texturedProgram);
    this.flameMaterial.colorTexture.set(new Texture2D(gl, "media/afterburner.png"));
    this.flameMesh = new Mesh(this.flameMaterial, this.texturedQuadGeometry);
    this.flame = new GameObject(this.flameMesh);
    this.flame.position.set(-1.1, 0.2);
    this.flame.scale.set(0.7, 0.7, 0.7);
    this.flame.orientation = Math.PI;
    this.flame.parent = this.avatar;
    this.flame.toDraw = false;
    this.flame.control = function(t, dt, keysPressed, colliders){
      // anytime key is pressed, flame shows, all other times, toDraw is false
      if (keysPressed.UP || keysPressed.DOWN || keysPressed.LEFT || keysPressed.RIGHT) {
        this.toDraw = true;
      } else {
        this.toDraw = false;
      }
    };
    this.gameObjects.push(this.flame);

    const genericMove = function(t, dt){
      const acceleration = new Vec3(this.force).mul(this.invMass);
      this.velocity.addScaled(dt, acceleration);
      this.position.addScaled(dt, this.velocity);

      const angularAcceleration = this.torque * this.invAngularMass;
      this.angularVelocity += angularAcceleration * dt;
      this.angularVelocity *= Math.exp(-dt * this.angularDrag * this.invAngularMass);
      this.orientation += this.angularVelocity * dt;

      const ahead = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation), 0);
      const aheadVelocity = ahead.times(ahead.dot(this.velocity));
      const sideVelocity = this.velocity.minus(aheadVelocity);
      this.velocity = new Vec3();
      this.velocity.addScaled(Math.exp(-dt * this.backDrag * this.invMass), aheadVelocity);
      this.velocity.addScaled(Math.exp(-dt * this.sideDrag * this.invMass), sideVelocity);

    };

    this.projectileMaterial = new Material(this.texturedProgram);
    this.projectileMaterial.colorTexture.set(new Texture2D(gl, "media/spark.png"));
    this.projectileMesh = new Mesh(this.projectileMaterial, this.texturedQuadGeometry);
    this.projectile = new GameObject(this.projectileMesh);
    this.projectile.toDraw = false;
    this.projectile.velocity.set(10, 10, 0);
    this.projectile.sideDrag = 0;
    this.projectile.backDrag = 0;
    this.projectile.move = function(t, dt){
      const ahead = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation), 0);
      const aheadVelocity = ahead.times(ahead.dot(this.velocity));
      this.position.addScaled(dt, aheadVelocity);
    };
    this.gameObjects.push(this.projectile);

    this.asteroidMaterial = new Material(this.texturedProgram);
    this.asteroidMaterial.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
    this.asteroidMesh = new Mesh(this.asteroidMaterial, this.texturedQuadGeometry);
    for(let i=0; i < 32; i++){
      const asteroid = new GameObject( this.asteroidMesh );
      asteroid.position.setRandom(new Vec3(-35, -10, 0), new Vec3(12, 12, 0) );
      asteroid.velocity.setRandom(new Vec3(-6, -6, 0), new Vec3(6, 6, 0));
      asteroid.angularVelocity = Math.random(-2, 2);
      asteroid.sideDrag = 0;
      asteroid.backDrag = 0;
      asteroid.isAsteroid = true;
      this.gameObjects.push(asteroid);
      asteroid.move = genericMove;
    }

    this.explodedMaterial = new Material(this.spriteProgram);
    this.explodedMaterial.colorTexture.set(new Texture2D(gl, "media/boom.png"));
    this.explodedMesh = new Mesh(this.explodedMaterial, this.texturedQuadGeometry);

    this.avatar.backDrag = 0.9;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.5;
    this.avatar.control = function(t, dt, keysPressed, colliders){
      this.thrust = 0;
      if(keysPressed.UP) {
        this.thrust += 8;
      } if(keysPressed.DOWN){
        this.thrust -= 8;
      }
      this.torque = 0;
      if(keysPressed.LEFT) {
        this.torque += 1;
      } if(keysPressed.RIGHT){
        this.torque -= 1;
      }
      const ahead = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation), 0);
      this.force = ahead.mul(this.thrust);
    };
    this.avatar.move = genericMove;

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;
    this.timeSinceProjLastShot = 250;
    this.explodeTime = 0;

    this.camera = new OrthoCamera(...this.programs);
    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;
    this.timeSinceProjLastShot += 1;

    this.camera.position = this.avatar.position;
    this.camera.update();

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const gameObject of this.gameObjects) {
      gameObject.control(t, dt, keysPressed, this.gameObjects);
    }

    //asteroid collision
    for(let i = 0; i < this.gameObjects.length; i++){
      var collider = this.gameObjects[i];
      if(collider === this.avatar) { continue; }
      else if(collider === this.flame) { continue; }
      else if(collider === this.projectile) { continue; }
      else {
        for (let j = i + 1; j < this.gameObjects.length; j++) {
          var other = this.gameObjects[j];
          if(other != this.avatar && other != this.flame && other != this.projectile && other.toDraw){
            var diff = collider.position.minus(other.position);
            var dist = diff.dot(diff);
            if(dist < 3.5) { // assuming each radius is 0.25
              var normal = diff.direction();
              collider.position.addScaled(0.01, normal);
              other.position.addScaled(-0.01, normal);
              var relVelocity = collider.velocity.minus(other.velocity);
              var resCoefficient = 1; // if 0, collision is in-elastic
              var impulseMag = normal.dot(relVelocity) / (1 + 1)  * (1 + resCoefficient);
              collider.velocity.addScaled(-impulseMag / 1, normal);
              other.velocity.addScaled(impulseMag / 1, normal);
            }
          }
        }
      }
    }

    // projectile
    if(keysPressed.SPACE && this.timeSinceProjLastShot > 250){
      this.projectile.orientation = this.avatar.orientation;
      this.projectile.position.set(this.avatar.position);
      this.timeSinceProjLastShot = 0;
      this.projectile.toDraw = true;
    }

    // if projectile hits asteroid
    if(this.projectile.toDraw){
      for(let i = 0; i < this.gameObjects.length; i++){
        var collider = this.gameObjects[i];
        if(collider.isAsteroid){
          var diff = this.projectile.position.minus(collider.position);
          var dist = diff.dot(diff);
          if(dist < 4.5){ // collision has occurred with projectile; replace with explosion
            var explosion = new GameObject(this.explodedMesh);
            explosion.position.set(collider.position);
            this.gameObjects[i] = explosion;
            this.gameObjects[i].isExploded = true;
            this.projectile.toDraw = false;
          }
        }
      }
    }

    for(collider of this.gameObjects){
      if(collider.isExploded){
        gl.useProgram(this.spriteProgram.glProgram);
        const offsetXHandle = gl.getUniformLocation(this.spriteProgram.glProgram, "sprite.offsetX");
        const offsetYHandle = gl.getUniformLocation(this.spriteProgram.glProgram, "sprite.offsetY");
        var offsetX = 1.0 / 6.0 * (this.explodeTime % 6);
        var offsetY = 1.0 / 6.0 * Math.floor(this.explodeTime / 6);
        gl.uniform1f(offsetXHandle, offsetX);
        gl.uniform1f(offsetYHandle, offsetY);
        this.explodeTime += 1;
        if(this.explodeTime == 35){
          collider.toDraw = false;
          this.explodeTime = 0;
        }
      }
    }

    for(const gameObject of this.gameObjects) {
      gameObject.move(t, dt);
    }

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
      if(gameObject.toDraw){
        gameObject.draw(this, this.camera);
      }
    }
  }
}
