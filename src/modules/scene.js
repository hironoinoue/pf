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
  //   Renderer
  // ===================

  const container = document.querySelector('#three');
  if (!container) return;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.domElement.classList.add('webgl');
  container.appendChild(renderer.domElement);

  renderer.setClearColor(0xedebe0, 1);

  // ===================
  //   Scene
  // ===================

  const scene = new THREE.Scene();

  // ===================
  //   Camera
  // ===================

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  const isSP = window.innerWidth < 768;
  const cameraZ = isSP ? 4.0 : 2.5;

  camera.position.set(0, 0, cameraZ);

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

  //---Shader (Shaderに渡すデータを固定長に)
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
  // マウス
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const pressPos = new THREE.Vector3();

  // マウス位置
  onPointerMove = function (e) {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // 位置計算
    pressPos
      .copy(raycaster.ray.origin)
      .add(raycaster.ray.direction.clone().multiplyScalar(2));

    // 座標を10個まで保持する
    pressPoints.push(pressPos.clone());

    if (pressPoints.length > 10) {
      pressPoints.shift();
    }
  };

  window.addEventListener('pointermove', onPointerMove);

  // ========================
  //   画面サイズの変化に合わせ、
  // 　CameraとRendererを再設定
  // ========================

  resize = function () {
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
  };

  window.addEventListener('resize', resize);
  resize();

  // ===================
  //   Animation
  // ===================

  // function animate() {
  //   animationId = requestAnimationFrame(animate);

  //   material.uniforms.uPressPoints.value = getFilledPressPoints();
  //   material.uniforms.uTime.value += 0.03;

  //   renderer.render(scene, camera);
  // }
  // animate();
}

export function destroyScene() {
  if (animationId) {
    //アニメーション停止
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (onPointerMove) {
    //イベント解除
    window.removeEventListener('pointermove', onPointerMove);
    onPointerMove = null;
  }

  if (resize) {
    //イベント解除
    window.removeEventListener('resize', resize);
    resize = null;
  }

  if (renderer?.domElement?.parentNode) {
    // DOM削除
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  // renderer削除
  renderer?.dispose();
  renderer = null;
}
