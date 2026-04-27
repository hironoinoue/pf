precision mediump float;

uniform float uTime;
uniform vec3 uPressPoints[10];


varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 pos = position;

  float noise =
    sin(pos.x * 2.3 + uTime) * 0.06 +
    sin(pos.y * 3.7 + uTime * 1.1) * 0.06 +
    sin(pos.z * 4.1 + uTime * 0.9) * 0.06;

  pos += normal * noise;

  float press = 0.0;

  for(int i = 0; i < 10; i++) {
    float d = distance(pos, uPressPoints[i]);
    press += smoothstep(0.9, 0.0, d);
  }
  press = clamp(press, 0.0, 0.9);

  pos -= normal * press * 0.35;

  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}