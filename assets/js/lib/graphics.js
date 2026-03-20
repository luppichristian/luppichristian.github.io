function fitCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  return ratio;
}

export function initHeroShader(canvas) {
  if (!canvas) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return () => {};

  const vertexSrc = `
    attribute vec2 aPos;
    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const fragSrc = `
    precision mediump float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec2 uMouse;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= uRes.x / uRes.y;
      float n = noise(uv * 18.0 + uTime * 0.2);
      float lines = sin((uv.y + uTime * 0.1) * 160.0) * 0.06;
      float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + length(p - uMouse) * 8.0);

      vec3 base = vec3(0.03, 0.07, 0.12);
      vec3 electric = vec3(0.2, 0.75, 1.0);
      vec3 cobalt = vec3(0.29, 0.47, 1.0);

      float glow = smoothstep(0.95, 0.2, length(p + vec2(0.15, -0.1)));
      vec3 color = base + electric * glow * 0.38 + cobalt * pulse * 0.18 + n * 0.05 + lines;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return () => {};

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(prog, "aPos");
  const resLoc = gl.getUniformLocation(prog, "uRes");
  const timeLoc = gl.getUniformLocation(prog, "uTime");
  const mouseLoc = gl.getUniformLocation(prog, "uMouse");

  let mouse = { x: 0, y: 0 };
  const onMove = (ev) => {
    const box = canvas.getBoundingClientRect();
    mouse = {
      x: ((ev.clientX - box.left) / box.width) * 2 - 1,
      y: ((ev.clientY - box.top) / box.height) * -2 + 1
    };
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const onResize = () => fitCanvas(canvas);
  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  let raf = 0;
  const loop = (t) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, t * 0.001);
    gl.uniform2f(mouseLoc, mouse.x * 0.25, mouse.y * 0.25);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(loop);
  };

  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", onResize);
  };
}

export function initParticleField(canvas) {
  if (!canvas) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let ratio = 1;
  let width = 0;
  let height = 0;

  const particles = Array.from({ length: 42 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    r: Math.random() * 1.2 + 0.8
  }));

  const resize = () => {
    ratio = fitCanvas(canvas);
    width = canvas.width;
    height = canvas.height;
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let raf = 0;
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(90, 176, 228, 0.55)";

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;

      const px = p.x * width;
      const py = p.y * height;
      ctx.beginPath();
      ctx.arc(px, py, p.r * ratio, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
