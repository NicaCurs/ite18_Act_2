import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x002233); // Dark blue for underwater vibe

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting - Ambient light and a glowing spotlight for atmosphere
const ambientLight = new THREE.AmbientLight(0x444444, 0.5); // Dim ambient light for depth
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0x66ccff, 1.5); // Glowing light source (magical underwater)
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// Underwater terrain (Ocean floor)
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x003366, // Deep ocean floor color
  roughness: 0.9,
  metalness: 0.1,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Glowing Jellyfish
const jellyfishMaterial = new THREE.MeshStandardMaterial({
  emissive: 0x66ffff, // Soft cyan glow
  emissiveIntensity: 1.5,
  color: 0x001a1a, // Transparent body
});
const jellyfishGroup = [];
for (let i = 0; i < 8; i++) { // Multiple jellyfish
  const jellyfish = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 16),
    jellyfishMaterial
  );
  jellyfish.position.set(
    Math.random() * 40 - 20,
    Math.random() * 5 + 2,
    Math.random() * 40 - 20
  );
  jellyfish.castShadow = true;
  scene.add(jellyfish);
  jellyfishGroup.push({
    jellyfish: jellyfish,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    ),
  });
}

// Glowing Bioluminescent Fish
const fishMaterial = new THREE.MeshStandardMaterial({
  emissive: 0x66ccff, // Glowing blue-green fish
  emissiveIntensity: 2.0,
  color: 0x001a1a, // Transparent fish body
});
const fishGroup = [];
for (let i = 0; i < 10; i++) { // More fish
  const fish = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    fishMaterial
  );
  fish.position.set(
    Math.random() * 50 - 25,
    Math.random() * 5 + 2,
    Math.random() * 50 - 25
  );
  fish.castShadow = true;
  scene.add(fish);
  fishGroup.push({
    fish: fish,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    ),
  });
}

// Glowing Coral Reef (static, magical effect)
const coralMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xff33cc, // Bright pink glow for coral
  emissiveIntensity: 2.0,
  color: 0x00cc00, // Green coral base
});
const coralGroup = [];
for (let i = 0; i < 5; i++) { // A few coral clusters
  const coral = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.7, 3),
    coralMaterial
  );
  coral.position.set(
    Math.random() * 30 - 15,
    0,
    Math.random() * 30 - 15
  );
  coral.castShadow = true;
  scene.add(coral);
  coralGroup.push(coral);
}

// Add some glowing underwater plants
const plantMaterial = new THREE.MeshStandardMaterial({
  emissive: 0x33ff66, // Soft green glow for plants
  emissiveIntensity: 1.5,
  color: 0x003300, // Dark green for the plant body
});
for (let i = 0; i < 6; i++) { // Some underwater plants
  const plant = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 4),
    plantMaterial
  );
  plant.position.set(
    Math.random() * 40 - 20,
    2,
    Math.random() * 40 - 20
  );
  plant.castShadow = true;
  scene.add(plant);
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

  // Update jellyfish movement
  jellyfishGroup.forEach(({ jellyfish, velocity }) => {
    jellyfish.position.add(velocity);
    if (jellyfish.position.y < 1 || jellyfish.position.y > 5) velocity.y *= -1;
    if (jellyfish.position.x < -25 || jellyfish.position.x > 25) velocity.x *= -1;
    if (jellyfish.position.z < -25 || jellyfish.position.z > 25) velocity.z *= -1;
  });

  // Update fish movement
  fishGroup.forEach(({ fish, velocity }) => {
    fish.position.add(velocity);
    if (fish.position.y < 1 || fish.position.y > 5) velocity.y *= -1;
    if (fish.position.x < -25 || fish.position.x > 25) velocity.x *= -1;
    if (fish.position.z < -25 || fish.position.z > 25) velocity.z *= -1;
  });

  // Rotate coral reefs slowly
  coralGroup.forEach(coral => coral.rotation.y += 0.005);

  // Render scene
  controls.update();
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
