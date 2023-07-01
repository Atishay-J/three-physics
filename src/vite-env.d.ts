/// <reference types="vite/client" />

declare module '*.glb' {
  const src: unknown;
  export default src;
}

declare module '*.gltf' {
  const src: unknown;
  export default src;
}

declare module 'three/addons/loaders/GLTFLoader.js';
