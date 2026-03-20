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

export function runViewTransition(render) {
  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render();
    return;
  }
  document.startViewTransition(() => {
    render();
  });
}
