import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background for a more eerie atmosphere

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

// Ocean-like ground with added detail
const oceanGeometry = new THREE.PlaneGeometry(100, 100);
const oceanMaterial = new THREE.MeshStandardMaterial({
  color: 0x001a33, // Dark ocean blue
  roughness: 0.8,
  metalness: 0.1,
});
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2;
ocean.receiveShadow = true;
scene.add(ocean);

// Fog for a creepy atmosphere
scene.fog = new THREE.Fog(0x000000, 10, 50); // Black fog that adds depth and mystery

// Lighting
const ambientLight = new THREE.AmbientLight(0x222222, 0.5); // Increased ambient light
scene.add(ambientLight);

const lighthouseLight = new THREE.DirectionalLight(0xffff99, 1.2); // Brighter lighthouse light glow
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

const lighthouseCollisionBox = new THREE.BoxHelper(lighthouse, 0xffff00); // Yellow collision box
lighthouseCollisionBox.update();
scene.add(lighthouseCollisionBox);

const lighthouse = new THREE.Group();
lighthouse.add(lighthouseBase);
lighthouse.add(lighthouseTower);
lighthouse.add(lighthouseLightTop);
scene.add(lighthouse);

// Glowing Sea Creatures (like jellyfish or glowing fish)
const seaCreatures = [];
const creatureMaterial = new THREE.MeshStandardMaterial({
  emissive: 0x33ccff, // Bright cyan glow for sea creatures
  emissiveIntensity: 2.0, // Increased glow intensity
});
for (let i = 0; i < 20; i++) { // Increased the number of creatures
  const creatureGeometry = new THREE.SphereGeometry(0.7, 16, 16);
  const creature = new THREE.Mesh(creatureGeometry, creatureMaterial);
  creature.position.set(
    Math.random() * 50 - 25,
    Math.random() * 3 + 1,
    Math.random() * 50 - 25
  );
  creature.castShadow = true;
  scene.add(creature);
  seaCreatures.push({
    creature: creature,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    ),
  });
}

// Additional Spooky Elements

// Haunted Trees with glowing eyes
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2e2e2e });
const treeGeometry = new THREE.CylinderGeometry(0.5, 1, 5);
for (let i = 0; i < 6; i++) { // Increased the number of trees
  const tree = new THREE.Mesh(treeGeometry, treeMaterial);
  tree.position.set(Math.random() * 30 - 15, 2.5, Math.random() * 30 - 15);
  tree.castShadow = true;
  scene.add(tree);

  const glowingEyes = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  glowingEyes.position.set(
    tree.position.x,
    tree.position.y + 2.5,
    tree.position.z
  );
  scene.add(glowingEyes);
}

// Creepy Floating Lanterns
const lanternMaterial = new THREE.MeshStandardMaterial({ emissive: 0xffffcc, emissiveIntensity: 1.2 });
for (let i = 0; i < 5; i++) { // Increased the number of lanterns
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1),
    lanternMaterial
  );
  lantern.position.set(Math.random() * 30 - 15, Math.random() * 5 + 2, Math.random() * 30 - 15);
  lantern.castShadow = true;
  scene.add(lantern);
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
    if (creature.position.x < -25 || creature.position.x > 25) velocity.x *= -1;
    if (creature.position.z < -25 || creature.position.z > 25) velocity.z *= -1;
  });

  // Rotate lighthouse light effect
  lighthouseLightTop.rotation.y += 0.01;

  // Update the lighthouse collision box
  lighthouseCollisionBox.update();

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
