import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import kangaroo from './models/kangaroo/kangaroo.gltf';
import babyHippo from './models/babyHippo.glb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

// model
const loader = new GLTFLoader();

let kangarooModel: THREE.Object3D<THREE.Event>;

const kangarooPhyMaterial = new CANNON.Material();
const kangarooPhysBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(15, 2, 15)),
  material: kangarooPhyMaterial,
  mass: 1,
  position: new CANNON.Vec3(0, 8, 0)
});

// loader.load(
//   kangaroo as string,
//   function (gltf: { scene: THREE.Object3D<THREE.Event> }) {
//     kangarooModel = gltf.scene;
//     kangarooModel.scale.set(0.5, 0.5, 0.5);
//     // kangarooModel.position.y = 1;
//     scene.add(kangarooModel);
//   },
//   undefined,
//   function (err: any) {
//     console.log('Error while loading modle', err);
//   }
// );

// Cannon Here

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBodyMaterial = new CANNON.Material();

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 10)),
  // mass: 10
  type: CANNON.Body.STATIC,
  material: groundBodyMaterial
});

const cubeBodyMaterial = new CANNON.Material();

const cubeBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4)), // This needs to be half of the size of THREE geometry
  mass: 10,
  material: cubeBodyMaterial
});

cubeBody.position = new CANNON.Vec3(0.2, 10, 0);

const sphereBodyMaterial = new CANNON.Material();

const sphereBody = new CANNON.Body({
  mass: 30,
  shape: new CANNON.Sphere(0.4), // This needs to be same as Three Geometry
  position: new CANNON.Vec3(0, 3, 0),
  linearDamping: 0.31, // This adds resistance and give more natural feel
  material: sphereBodyMaterial
});

const sphereGroundContactMaterial = new CANNON.ContactMaterial(
  groundBodyMaterial,
  sphereBodyMaterial,
  {
    restitution: 0.8
  }
);

const kangarooGroundContactMaterial = new CANNON.ContactMaterial(
  groundBodyMaterial,
  kangarooPhyMaterial,
  {
    restitution: 3
  }
);

const contactMaterial = new CANNON.ContactMaterial(
  groundBodyMaterial,
  cubeBodyMaterial,
  {
    friction: 0
  }
);

world.addContactMaterial(sphereGroundContactMaterial);
world.addContactMaterial(contactMaterial);
world.addContactMaterial(kangarooGroundContactMaterial);
world.addBody(sphereBody);
world.addBody(cubeBody);
world.addBody(groundBody);
world.addBody(kangarooPhysBody);

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);
  // cube.rotation.y += 0.1;
  requestAnimationFrame(animate);

  plane.position.copy(groundBody.position as any);
  plane.quaternion.copy(groundBody.quaternion as any);

  // kangarooModel.position.copy(kangarooPhysBody.position as any);
  // kangarooModel.quaternion.copy(kangarooPhysBody.quaternion as any);

  sphere.position.copy(sphereBody.position as any);
  sphere.quaternion.copy(sphereBody.quaternion as any);

  renderer.render(scene, camera);
}
document.body.appendChild(renderer.domElement);
animate();
