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

const planeGeometery = new THREE.BoxGeometry(20, 0.2, 20);
const cubeGeometery = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const sphereGeo = new THREE.SphereGeometry(0.4);

const material = new THREE.MeshStandardMaterial({
  color: 'white'
});
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 'yellow'
});
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight('red', 10);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
const plane = new THREE.Mesh(planeGeometery, material);
const cube = new THREE.Mesh(cubeGeometery, cubeMaterial);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
const axesHelper = new THREE.AxesHelper(10);

scene.add(camera);
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLightHelper);
scene.add(plane);
scene.add(cube);
scene.add(sphere);
scene.add(axesHelper);

camera.position.z = 25;
camera.position.y = 10;
camera.lookAt(0, 0, 0);
directionalLight.position.x = 4;

// Cannon Here

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 10)),
  // mass: 10
  type: CANNON.Body.STATIC
});

const cubeBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4)), // This needs to be half of the size of THREE geometry
  mass: 10
});

cubeBody.position = new CANNON.Vec3(0.2, 10, 0);

const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(0.4), // This needs to be same as Three Geometry
  position: new CANNON.Vec3(0, 3, 0)
});

world.addBody(sphereBody);
world.addBody(cubeBody);
world.addBody(groundBody);

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);
  // cube.rotation.y += 0.1;

  plane.position.copy(groundBody.position as any);
  plane.quaternion.copy(groundBody.quaternion as any);

  cube.position.copy(cubeBody.position as any);
  cube.quaternion.copy(cubeBody.quaternion as any);

  sphere.position.copy(sphereBody.position as any);
  sphere.quaternion.copy(sphereBody.quaternion as any);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();
