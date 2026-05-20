import * as THREE from 'three';

export class Renderer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.playerModels = new Map();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 100);
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.y = 1.6;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    
    this.container.appendChild(this.renderer.domElement);
    
    this.setupLights();
    this.createMap();
    
    window.addEventListener('resize', this.onResize.bind(this));
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.receiveShadow = true;
    this.scene.add(directionalLight);
  }

  createMap() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(60, 60);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3a7c5e });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(60, 20, 0x888888, 0x444444);
    gridHelper.position.y = -0.4;
    this.scene.add(gridHelper);
    
    // Boxes (cover)
    const boxPositions = [
      [-10, 0, -5], [10, 0, 5], [-5, 0, 10], [5, 0, -10],
      [-15, 0, -15], [15, 0, 15], [0, 0, 0]
    ];
    
    boxPositions.forEach(pos => {
      const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
      const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(pos[0], pos[1], pos[2]);
      box.castShadow = true;
      box.receiveShadow = true;
      this.scene.add(box);
    });
    
    // Walls around the map
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const wallHeight = 3;
    
    // North wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(62, wallHeight, 1), wallMaterial);
    northWall.position.set(0, wallHeight/2, -30.5);
    northWall.receiveShadow = true;
    this.scene.add(northWall);
    
    // South wall
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(62, wallHeight, 1), wallMaterial);
    southWall.position.set(0, wallHeight/2, 30.5);
    southWall.receiveShadow = true;
    this.scene.add(southWall);
    
    // East wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, 62), wallMaterial);
    eastWall.position.set(30.5, wallHeight/2, 0);
    eastWall.receiveShadow = true;
    this.scene.add(eastWall);
    
    // West wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, 62), wallMaterial);
    westWall.position.set(-30.5, wallHeight/2, 0);
    westWall.receiveShadow = true;
    this.scene.add(westWall);
  }

  updatePlayerModel(id, playerData) {
    let model = this.playerModels.get(id);
    
    if (!model) {
      // Create player model
      const geometry = new THREE.BoxGeometry(0.8, 1.8, 0.8);
      const material = new THREE.MeshStandardMaterial({ color: 0xff4444 });
      model = new THREE.Mesh(geometry, material);
      model.castShadow = true;
      model.receiveShadow = true;
      this.scene.add(model);
      this.playerModels.set(id, model);
    }
    
    model.position.set(playerData.x, 0.9, playerData.z);
    model.rotation.y = playerData.rotation;
    
    // Change color based on HP
    const hpPercent = playerData.hp / 100;
    const color = new THREE.Color().setHSL(0.05 * (1 - hpPercent), 1, 0.5);
    model.material.color = color;
  }

  updateLocalCamera(rotation) {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = rotation;
  }

  showHitEffect() {
    // Simple screen flash effect
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = 1000;
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 100);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}