/* ============================================================
   HERO WEBGL BACKGROUND — Caustic glass light shader
   Falls back gracefully if WebGL not supported.
   Video fades in over the top once loaded.
   ============================================================ */
(function initHeroGL() {
  const canvas = document.getElementById('hero-canvas');
  const video  = document.querySelector('.hero-bg-video');
  if (!canvas) return;

  /* Fade video in once it can play */
  if (video) {
    video.addEventListener('canplaythrough', () => {
      video.classList.add('video-ready');
    }, { once: true });
    /* Fallback: fade in after 3s regardless */
    setTimeout(() => video.classList.add('video-ready'), 3000);
  }

  /* Try WebGL */
  const gl = canvas.getContext('webgl') ||
             canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  let W, H;
  const mouse = [0.5, 0.45];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    gl.viewport(0, 0, W, H);
  }
  window.addEventListener('resize', resize, { passive: true });

  /* Smooth mouse tracking */
  window.addEventListener('mousemove', e => {
    mouse[0] += (e.clientX / window.innerWidth  - mouse[0]) * 0.04;
    mouse[1] += (e.clientY / window.innerHeight - mouse[1]) * 0.04;
  }, { passive: true });

  /* Touch support */
  window.addEventListener('touchmove', e => {
    if (!e.touches[0]) return;
    mouse[0] += (e.touches[0].clientX / window.innerWidth  - mouse[0]) * 0.08;
    mouse[1] += (e.touches[0].clientY / window.innerHeight - mouse[1]) * 0.08;
  }, { passive: true });

  const VS = `
    attribute vec2 a;
    void main() { gl_Position = vec4(a, 0., 1.); }
  `;

  const FS = `
    precision highp float;
    uniform vec2  u_res;
    uniform vec2  u_mouse;
    uniform float u_time;

    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),            hash(i + vec2(1,0)), f.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p  = rot * p * 2.0 + vec2(100.0);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      uv.y = 1.0 - uv.y;
      float t = u_time * 0.16;

      vec2 mouse = u_mouse;
      mouse.y    = 1.0 - mouse.y;

      /* Dark navy base */
      vec3 col = vec3(0.04, 0.07, 0.12);

      /* Layered caustic noise */
      vec2 q = vec2(fbm(uv + t * 0.07), fbm(uv + vec2(1.0)));
      vec2 r = vec2(
        fbm(uv + q + vec2(1.7, 9.2) + t * 0.045),
        fbm(uv + q + vec2(8.3, 2.8) + t * 0.055)
      );
      float f = fbm(uv + r);

      /* Blue caustic tones */
      vec3 caustic = mix(vec3(0.02, 0.06, 0.14), vec3(0.07, 0.20, 0.42), clamp(f * f * 4.0, 0., 1.));
      caustic      = mix(caustic, vec3(0.10, 0.28, 0.58), clamp(f * 2.0,   0., 1.));
      caustic      = mix(caustic, vec3(0.45, 0.70, 1.00), clamp(length(q), 0., 1.));

      /* Bright hotspots — light punching through glass */
      caustic += vec3(0.55, 0.78, 1.0) * pow(max(0., f - 0.38), 2.8) * 2.8;

      /* Mouse-driven light source */
      float md = length(uv - mouse);
      caustic  += vec3(0.38, 0.65, 1.0) * exp(-md * md * 3.2) * 0.65;

      col += caustic * 0.36;

      /* Glass panel edge lines — diagonal architectural geometry */
      float p1 = smoothstep(0.003, 0., abs(uv.x * 0.62 - uv.y * 0.84 - 0.12 + sin(t*0.28)*0.022));
      float p2 = smoothstep(0.003, 0., abs(uv.x * 0.48 - uv.y * 0.91 + 0.16 + cos(t*0.22)*0.016));
      float p3 = smoothstep(0.003, 0., abs(uv.x * 0.71 - uv.y * 0.79 - 0.38 + sin(t*0.19)*0.019));
      col += vec3(0.38, 0.62, 0.90) * max(max(p1,p2),p3) * 0.65;

      /* Subtle diagonal texture — glass surface micro-detail */
      col += pow(sin((uv.x - uv.y * 0.6) * 20.0 + t * 0.09) * 0.5 + 0.5, 10.0) * 0.032;

      /* Brand gold warmth — bottom right */
      col += vec3(0.76, 0.62, 0.32) *
             exp(-length((uv - vec2(0.88, 0.78)) * vec2(1.4, 1.8)) * 2.8) * 0.14;

      /* Vignette */
      vec2 vc = uv * 2.0 - 1.0;
      col    *= pow(max(0., 1.0 - dot(vc * 0.65, vc * 0.65)), 1.1) * 0.9 + 0.1;

      /* Tone map + gamma */
      col  = col / (col + 0.75);
      col  = pow(col, vec3(0.88));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  const prog = gl.createProgram();
  const vs   = shader(gl.VERTEX_SHADER,   VS);
  const fs   = shader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { canvas.style.display = 'none'; return; }

  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uTime  = gl.getUniformLocation(prog, 'u_time');

  resize();

  /* Only animate when hero is visible — performance */
  let visible = true;
  const observer = new IntersectionObserver(
    ([e]) => { visible = e.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(canvas);

  function frame(ts) {
    requestAnimationFrame(frame);
    if (!visible) return;
    gl.uniform2f(uRes,   W, H);
    gl.uniform2fv(uMouse, mouse);
    gl.uniform1f(uTime,  ts * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  requestAnimationFrame(frame);
})();