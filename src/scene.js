import * as THREE from 'three';
import warterTexture from './textures/warter.jpg';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

//--- Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
const isSP = window.innerWidth < 768;
const cameraZ = isSP ? 4.0 : 2.5;

camera.position.set(0, 0, cameraZ);

//--- Renderer
const container = document.querySelector('#three');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.classList.add('webgl');
container.appendChild(renderer.domElement);

renderer.setClearColor(0xedebe0, 1);
// renderer.setSize(window.innerWidth, window.innerHeight); risizeで管理しているので不要かもしれない

const pressPoints = [];

//--- envMap
const loader = new THREE.TextureLoader();

const envMap = loader.load(warterTexture);

envMap.mapping = THREE.EquirectangularReflectionMapping;

//--- Geometry
const geometry = new THREE.SphereGeometry(1, 64, 64);

//--- Shader
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uPressPoints: { value: pressPoints },
    uEnvMap: { value: envMap },
  },
  transparent: true,
});

//--- Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//---Shaderに渡すデータを固定長に
const MAX_POINTS = 10;

function getFilledPressPoints() {
  const points = [];

  for (let i = 0; i < MAX_POINTS; i++) {
    if (pressPoints[i]) {
      points.push(pressPoints[i]);
    } else {
      points.push(new THREE.Vector3(0, 0, 0));
    }
  }

  return points;
}
//--- マウス
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const pressPos = new THREE.Vector3();

window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  pressPos
    .copy(raycaster.ray.origin)
    .add(raycaster.ray.direction.clone().multiplyScalar(2));

  pressPoints.push(pressPos.clone());

  if (pressPoints.length > 10) {
    pressPoints.shift();
  }
});

// --Animate;

// const animate = () => {
//   requestAnimationFrame(animate);

//   material.uniforms.uPressPoints.value = getFilledPressPoints();

//   // 時間更新
//   material.uniforms.uTime.value += 0.03;
//   renderer.render(scene, camera);
// };
// animate();

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const isSP = width < 768;
  const cameraZ = isSP ? 4.0 : 2.5;

  camera.position.set(0, 0, cameraZ);

  const dpr = isSP
    ? Math.min(window.devicePixelRatio, 1.2)
    : Math.min(window.devicePixelRatio, 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);
resize(); // 初期化も必須
