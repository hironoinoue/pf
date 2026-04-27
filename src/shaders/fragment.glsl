uniform sampler2D uEnvMap;

varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 reflectDir = reflect(-viewDir, normalize(vNormal));

  // 疑似envMap（2Dから参照）
  vec2 uv = reflectDir.xy * 0.5 + 0.5;
  vec3 envColor = texture2D(uEnvMap, uv).rgb;

  vec3 baseColor = vec3(0.5, 0.8, 1.0);

  vec3 color = mix(baseColor, envColor, 0.6);

//なめらかに　緑色の計算
  float fresnel = 1.0 - dot(normalize(vNormal), viewDir);
  fresnel = smoothstep(0.0, 1.0, fresnel);

  color += fresnel * 0.2;

  gl_FragColor = vec4(color, 0.9);
}