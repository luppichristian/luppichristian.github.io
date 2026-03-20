let gsapInstance = null;

async function loadGsap() {
  if (gsapInstance) return gsapInstance;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm");
    gsapInstance = mod.gsap;
  } catch {
    gsapInstance = null;
  }
  return gsapInstance;
}

export async function runPageEntrance(root) {
  const gsap = await loadGsap();
  const items = [...root.querySelectorAll("[data-stagger]")];
  if (!items.length) return;
  if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "none";
    });
    return;
  }
  gsap.fromTo(
    items,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.58, stagger: 0.08, ease: "power2.out" }
  );
}

export function initParallax(selector) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cards = [...document.querySelectorAll(selector)];
  cards.forEach((card) => {
    card.addEventListener("pointermove", (ev) => {
      const box = card.getBoundingClientRect();
      const x = (ev.clientX - box.left) / box.width - 0.5;
      const y = (ev.clientY - box.top) / box.height - 0.5;
      card.style.transform = `translateY(-2px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

export function initHeroCursorEffect(selector) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const panel = document.querySelector(selector);
  if (!panel) return () => {};

  const points = [...panel.querySelectorAll(".hero-point")];
  const actions = [...panel.querySelectorAll(".hero-actions .button")];

  const comet = document.createElement("span");
  comet.className = "hero-comet";
  comet.setAttribute("aria-hidden", "true");
  const cometTail = document.createElement("span");
  cometTail.className = "hero-comet-tail";
  cometTail.setAttribute("aria-hidden", "true");
  panel.append(cometTail, comet);

  const target = { x: 0.5, y: 0.5 };
  const current = { x: 0.5, y: 0.5 };
  const cometPos = { x: 0.5, y: 0.5 };
  let last = { x: 0.5, y: 0.5 };
  let hovering = false;
  let raf = 0;
  let time = 0;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  const applyTransforms = () => {
    const dx = current.x - 0.5;
    const dy = current.y - 0.5;
    const velocity = Math.hypot(current.x - last.x, current.y - last.y);
    const energy = Math.min(1, velocity * 40 + (hovering ? 0.35 : 0));

    const tiltX = -dy * 5.2;
    const tiltY = dx * 6.2;

    panel.style.setProperty("--mx", `${(current.x * 100).toFixed(2)}%`);
    panel.style.setProperty("--my", `${(current.y * 100).toFixed(2)}%`);
    panel.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    panel.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    panel.style.setProperty("--energy", energy.toFixed(3));
    panel.style.setProperty("--scan-shift", `${(time * 0.55 + dx * 36).toFixed(2)}px`);
    panel.style.setProperty("--halo-size", `${(240 + energy * 140).toFixed(1)}px`);

    const cometEase = hovering ? 0.2 : 0.08;
    cometPos.x += (current.x - cometPos.x) * cometEase;
    cometPos.y += (current.y - cometPos.y) * cometEase;
    const tx = (current.x - cometPos.x) * 100;
    const ty = (current.y - cometPos.y) * 100;
    const angle = Math.atan2(ty, tx);
    const speed = Math.hypot(tx, ty);
    const tailScale = Math.max(0.55, Math.min(1.45, speed * 0.1 + 0.58));

    comet.style.transform = `translate3d(calc(${(cometPos.x * 100).toFixed(2)}% - 7px), calc(${(cometPos.y * 100).toFixed(2)}% - 7px), 0)`;
    comet.style.opacity = `${(0.45 + energy * 0.55).toFixed(2)}`;

    cometTail.style.transform = `translate3d(calc(${(cometPos.x * 100).toFixed(2)}% - 125px), calc(${(cometPos.y * 100).toFixed(2)}% - 9px), 0) rotate(${angle.toFixed(3)}rad) scaleX(${tailScale.toFixed(3)})`;
    cometTail.style.opacity = `${(0.18 + energy * 0.52).toFixed(2)}`;

    points.forEach((point, index) => {
      const factor = (index + 1) * 0.8;
      point.style.translate = `${(dx * factor * 10).toFixed(2)}px ${(dy * factor * 8).toFixed(2)}px`;
    });

    actions.forEach((button, index) => {
      const factor = index === 0 ? 1.1 : 0.8;
      button.style.translate = `${(dx * factor * 8).toFixed(2)}px ${(dy * factor * 6).toFixed(2)}px`;
    });

    last = { x: current.x, y: current.y };
  };

  const loop = () => {
    time += 1;
    current.x += (target.x - current.x) * (hovering ? 0.13 : 0.08);
    current.y += (target.y - current.y) * (hovering ? 0.13 : 0.08);
    applyTransforms();
    raf = requestAnimationFrame(loop);
  };

  const onMove = (ev) => {
    const box = panel.getBoundingClientRect();
    target.x = clamp01((ev.clientX - box.left) / box.width);
    target.y = clamp01((ev.clientY - box.top) / box.height);
    hovering = true;
  };

  const onEnter = () => {
    hovering = true;
  };

  const onLeave = () => {
    hovering = false;
    target.x = 0.5;
    target.y = 0.5;
  };

  panel.addEventListener("pointerenter", onEnter);
  panel.addEventListener("pointermove", onMove);
  panel.addEventListener("pointerleave", onLeave);

  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    panel.removeEventListener("pointerenter", onEnter);
    panel.removeEventListener("pointermove", onMove);
    panel.removeEventListener("pointerleave", onLeave);
    panel.style.removeProperty("--mx");
    panel.style.removeProperty("--my");
    panel.style.removeProperty("--tilt-x");
    panel.style.removeProperty("--tilt-y");
    panel.style.removeProperty("--energy");
    panel.style.removeProperty("--scan-shift");
    panel.style.removeProperty("--halo-size");
    points.forEach((point) => {
      point.style.translate = "";
    });
    actions.forEach((button) => {
      button.style.translate = "";
    });
    comet.remove();
    cometTail.remove();
  };
}

export function runViewTransition(render) {
  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render();
    return;
  }
  document.startViewTransition(() => {
    render();
  });
}
