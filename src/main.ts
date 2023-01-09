import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1500
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
new OrbitControls(camera, renderer.domElement);

const cubeGeometery = new THREE.BoxGeometry(10, 0.5, 10);
const material = new THREE.MeshStandardMaterial({
  color: 'white'
});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const directionalLight = new THREE.DirectionalLight('red', 10);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
const cube = new THREE.Mesh(cubeGeometery, material);
const axesHelper = new THREE.AxesHelper(10);

scene.add(camera);
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLightHelper);
scene.add(cube);
scene.add(axesHelper);

camera.position.z = 15;
directionalLight.position.x = 4;

// Cannon Here

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(15, 150.1)),
  mass: 10
});

world.addBody(groundBody);

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);
  // cube.rotation.y += 0.1;

  cube.position.copy(groundBody.position as any);
  cube.quaternion.copy(groundBody.quaternion as any);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();
