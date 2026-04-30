import * as THREE from 'three';
import warterTexture from '../textures/warter.jpg';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

let renderer;
let animationId;

let onPointerMove;
let resize;

export function initScene() {
  if (renderer) return;

  // ===================
  // Renderer
  // ===================
  const container = document.querySelector('#three');
  if (!container) return;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.domElement.classList.add('webgl');
  container.appendChild(renderer.domElement);

  renderer.setClearColor(0xedebe0, 1);

  // ===================
  // Scene
  // ===================
  const scene = new THREE.Scene();

  // ===================
  // Camera
  // ===================
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );

  // --- SP判定（状態は1つに統一）
  let isSP = window.innerWidth < 768;
  let prevIsSP = isSP;

  const cameraZ = isSP ? 4.0 : 2.5;
  camera.position.set(0, 0, cameraZ);

  let targetCameraZ = cameraZ;

  // ===================
  // SPスクロールズーム
  // ===================
  function onWheel(e) {
    targetCameraZ += e.deltaY * 0.002;
    targetCameraZ = THREE.MathUtils.clamp(targetCameraZ, 2.5, 6);
  }

  if (isSP) {
    window.addEventListener('wheel', onWheel);
  }

  // ===================
  // Press Points
  // ===================
  const pressArray = [];

  // env map
  const loader = new THREE.TextureLoader();
  const envMap = loader.load(warterTexture);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // geometry
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // shader
  const pressPoints = new Float32Array(30);

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

  // ===================
  // update press
  // ===================
  function updatePress() {
    for (let i = 0; i < 10; i++) {
      const p = pressArray[i] ?? new THREE.Vector3(0, 0, 0);

      pressPoints[i * 3 + 0] = p.x;
      pressPoints[i * 3 + 1] = p.y;
      pressPoints[i * 3 + 2] = p.z;
    }
  }

  // mesh
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ===================
  // pointer
  // ===================
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const pressPos = new THREE.Vector3();

  onPointerMove = function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    pressPos
      .copy(raycaster.ray.origin)
      .add(raycaster.ray.direction.clone().multiplyScalar(2));

    pressArray.push(pressPos.clone());

    if (pressArray.length > 10) {
      pressArray.shift();
    }
  };

  window.addEventListener('pointermove', onPointerMove);

  // ===================
  // resize
  // ===================
  resize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const newIsSP = width < 768;

    // SP状態変化時のみイベント切り替え
    if (prevIsSP !== newIsSP) {
      window.removeEventListener('wheel', onWheel);

      if (newIsSP) {
        window.addEventListener('wheel', onWheel);
      }

      prevIsSP = newIsSP;
      isSP = newIsSP;
    }

    const cameraZ = newIsSP ? 4.0 : 2.5;
    camera.position.set(0, 0, cameraZ);
    targetCameraZ = cameraZ;

    const dpr = newIsSP
      ? Math.min(window.devicePixelRatio, 1.2)
      : Math.min(window.devicePixelRatio, 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
  };

  window.addEventListener('resize', resize);
  resize();

  // ===================
  // animate
  // ===================
  function animate() {
    animationId = requestAnimationFrame(animate);

    updatePress();

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetCameraZ,
      0.08,
    );

    material.uniforms.uTime.value += 0.03;

    renderer.render(scene, camera);
  }

  animate();
}

export function destroyScene() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (onPointerMove) {
    window.removeEventListener('pointermove', onPointerMove);
    onPointerMove = null;
  }

  if (resize) {
    window.removeEventListener('resize', resize);
    resize = null;
  }

  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  renderer?.dispose();
  renderer = null;
}
