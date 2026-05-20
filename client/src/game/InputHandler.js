export class InputHandler {
  constructor(camera) {
    this.camera = camera;
    this.keys = new Set();
    this.mouseX = 0;
    this.mouseY = 0;
    this.shooting = false;
    this.move = { x: 0, z: 0 };
    this.rotation = 0;
  }

  init() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    
    // Lock pointer on click
    this.container = document.querySelector('.canvas-container');
    if (this.container) {
      this.container.addEventListener('click', () => {
        this.container.requestPointerLock();
      });
    }
    
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
  }

  onKeyDown(e) {
    this.keys.add(e.code);
    this.updateMovement();
  }

  onKeyUp(e) {
    this.keys.delete(e.code);
    this.updateMovement();
  }

  updateMovement() {
    this.move.x = 0;
    this.move.z = 0;
    
    if (this.keys.has('KeyW')) this.move.z -= 1;
    if (this.keys.has('KeyS')) this.move.z += 1;
    if (this.keys.has('KeyA')) this.move.x -= 1;
    if (this.keys.has('KeyD')) this.move.x += 1;
    
    // Normalize diagonal movement
    if (this.move.x !== 0 && this.move.z !== 0) {
      this.move.x *= 0.707;
      this.move.z *= 0.707;
    }
  }

  onMouseMove(e) {
    if (document.pointerLockElement === this.container) {
      this.mouseX += e.movementX * 0.002;
      this.mouseY += e.movementY * 0.002;
      this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY));
      
      this.rotation = this.mouseX;
      
      if (this.camera) {
        this.camera.rotation.x = this.mouseY;
      }
    }
  }

  onMouseDown(e) {
    if (e.button === 0 && document.pointerLockElement === this.container) {
      this.shooting = true;
    }
  }

  onMouseUp(e) {
    if (e.button === 0) {
      this.shooting = false;
    }
  }

  onPointerLockChange() {
    if (document.pointerLockElement !== this.container) {
      this.shooting = false;
    }
  }

  getMovement() {
    return this.move;
  }

  getRotation() {
    return this.rotation;
  }

  isShooting() {
    return this.shooting;
  }

  getAimDirection() {
    if (!this.camera) return 0;
    
    const direction = this.camera.getWorldDirection(new THREE.Vector3());
    return Math.atan2(direction.x, direction.z);
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}