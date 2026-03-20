/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const waveVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 primaryColor;
uniform float primaryBlend;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float pixelSize;
uniform float colorLevels;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  float f = fbm(p + fbm(p2));
  return smoothstep(0.0, 1.0, f);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  // Pixelation: sample at block centers for retro look
  vec2 pixelScale = resolution.xy / max(pixelSize, 1.0);
  vec2 uvPixel = floor(uv * pixelScale + 0.5) / pixelScale;
  float f = pattern(uvPixel);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  // Color quantization for pixellated look (more levels = smoother transitions)
  f = floor(f * colorLevels + 0.5) / colorLevels;
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = mix(col, primaryColor, f * primaryBlend);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface WaveMeshProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  primaryColor: [number, number, number];
  primaryBlend: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
  pixelSize: number;
  colorLevels: number;
}

function WaveMesh({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  primaryColor,
  primaryBlend,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
  pixelSize,
  colorLevels
}: WaveMeshProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, size, gl } = useThree();

  const uniforms = useRef({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    waveSpeed: { value: waveSpeed },
    waveFrequency: { value: waveFrequency },
    waveAmplitude: { value: waveAmplitude },
    waveColor: { value: new THREE.Color(...waveColor) },
    primaryColor: { value: new THREE.Color(...primaryColor) },
    primaryBlend: { value: primaryBlend },
    mousePos: { value: new THREE.Vector2(0, 0) },
    enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
    mouseRadius: { value: mouseRadius },
    pixelSize: { value: pixelSize },
    colorLevels: { value: colorLevels }
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    uniforms.current.resolution.value.set(size.width * dpr, size.height * dpr);
  }, [size, gl]);

  useFrame(({ clock }) => {
    const u = uniforms.current;
    if (!disableAnimation) u.time.value = clock.getElapsedTime();
    u.waveSpeed.value = waveSpeed;
    u.waveFrequency.value = waveFrequency;
    u.waveAmplitude.value = waveAmplitude;
    u.waveColor.value.set(...waveColor);
    u.primaryColor.value.set(...primaryColor);
    u.primaryBlend.value = primaryBlend;
    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    u.pixelSize.value = pixelSize;
    u.colorLevels.value = colorLevels;
    if (enableMouseInteraction) u.mousePos.value.copy(mouseRef.current);
  });

  const handlePointerMove = (e: { clientX: number; clientY: number }) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
  };

  return (
    <>
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={uniforms.current}
          depthWrite={false}
        />
      </mesh>
      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

interface WaveBackgroundProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  primaryColor?: [number, number, number];
  primaryBlend?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  pixelSize?: number;
  colorLevels?: number;
}

export default function WaveBackground({
  waveSpeed = 0.03,
  waveFrequency = 2.5,
  waveAmplitude = 0.25,
  waveColor = [0.5, 0.5, 0.5],
  primaryColor = [0.25, 1, 0.85],
  primaryBlend = 0.25,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  pixelSize = 6,
  colorLevels = 8
}: WaveBackgroundProps) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
    >
      <WaveMesh
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        primaryColor={primaryColor}
        primaryBlend={primaryBlend}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
        pixelSize={pixelSize}
        colorLevels={colorLevels}
      />
    </Canvas>
  );
}
