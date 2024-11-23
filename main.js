import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // Very dark gray for a spooky night vibe

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(20, 10, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Ocean-like ground
const oceanGeometry = new THREE.PlaneGeometry(100, 100);
const oceanMaterial = new THREE.MeshStandardMaterial({
  color: 0x001a33, // Dark blue for the ocean floor
  roughness: 0.8,
  metalness: 0.1,
});
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2;
ocean.receiveShadow = true;
scene.add(ocean);

// Fog for a mysterious atmosphere
scene.fog = new THREE.Fog(0x000000, 10, 50); // Deep black fog for a very eerie look

// Lighting
const ambientLight = new THREE.AmbientLight(0x222222, 0.4); // Low ambient light for night
scene.add(ambientLight);

const lighthouseLight = new THREE.DirectionalLight(0xeeeeff, 0.5); // Lighthouse beam light
lighthouseLight.position.set(0, 25, 0);
lighthouseLight.castShadow = true;
scene.add(lighthouseLight);

// Lighthouse
const lighthouseBase = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 10),
  new THREE.MeshStandardMaterial({ color: 0x555555 })
);
lighthouseBase.position.y = 5;
lighthouseBase.castShadow = true;

const lighthouseTower = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5, 1.5, 15),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
lighthouseTower.position.y = 12.5;
lighthouseTower.castShadow = true;

const lighthouseLightTop = new THREE.Mesh(
  new THREE.SphereGeometry(2, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffff99, emissive: 0xffff66 })
);
lighthouseLightTop.position.y = 22;
lighthouseLightTop.castShadow = true;

const lighthouse = new THREE.Group();
lighthouse.add(lighthouseBase);
lighthouse.add(lighthouseTower);
lighthouse.add(lighthouseLightTop);
scene.add(lighthouse);

// Glowing Sea Creatures (like jellyfish or glowing fish)
const seaCreatures = [];
const creatureMaterial = new THREE.MeshStandardMaterial({ emissive: 0x33ccff, emissiveIntensity: 1.5 });
for (let i = 0; i < 6; i++) {
  const creatureGeometry = new THREE.SphereGeometry(0.7, 16, 16);
  const creature = new THREE.Mesh(creatureGeometry, creatureMaterial);
  creature.position.set(
    Math.random() * 40 - 20,
    Math.random() * 3 + 1,
    Math.random() * 40 - 20
  );
  creature.castShadow = true;
  scene.add(creature);
  seaCreatures.push({
    creature: creature,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
  });
}

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Update glowing sea creatures' movement
  seaCreatures.forEach(({ creature, velocity }) => {
    creature.position.add(velocity);
    if (creature.position.y < 1 || creature.position.y > 3) velocity.y *= -1;
    if (creature.position.x < -20 || creature.position.x > 20) velocity.x *= -1;
    if (creature.position.z < -20 || creature.position.z > 20) velocity.z *= -1;
  });

  // Rotate lighthouse light effect
  lighthouseLightTop.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

