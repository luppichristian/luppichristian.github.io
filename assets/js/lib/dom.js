export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(Number(value) || 0);
}

export function createSvgForProject(type) {
  const svg = {
    sdl: `<svg viewBox="0 0 640 220" role="img" aria-label="SDL architecture diagram"><defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="#37c6ff"/><stop offset="1" stop-color="#4a7bff"/></linearGradient></defs><rect x="18" y="25" width="160" height="170" rx="14" fill="#101c2d" stroke="#2c4866"/><rect x="240" y="25" width="160" height="170" rx="14" fill="#101c2d" stroke="#2c4866"/><rect x="462" y="25" width="160" height="170" rx="14" fill="#101c2d" stroke="#2c4866"/><path d="M178 110h62M400 110h62" stroke="url(#a)" stroke-width="3"/><circle cx="208" cy="110" r="5" fill="#37c6ff"/><circle cx="430" cy="110" r="5" fill="#37c6ff"/><text x="48" y="108" fill="#d4e6ff" font-size="18" font-family="JetBrains Mono">Platform</text><text x="266" y="108" fill="#d4e6ff" font-size="18" font-family="JetBrains Mono">SDL Layer</text><text x="494" y="108" fill="#d4e6ff" font-size="18" font-family="JetBrains Mono">Engine</text></svg>`,
    gpu: `<svg viewBox="0 0 640 220" role="img" aria-label="GPU pipeline diagram"><defs><linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#35d49a"/><stop offset="1" stop-color="#36c2ff"/></linearGradient></defs><path d="M30 110h580" stroke="#2c4866" stroke-width="2"/><rect x="40" y="70" width="120" height="80" rx="12" fill="#112235" stroke="#2c4866"/><rect x="190" y="70" width="120" height="80" rx="12" fill="#112235" stroke="#2c4866"/><rect x="340" y="70" width="120" height="80" rx="12" fill="#112235" stroke="#2c4866"/><rect x="490" y="70" width="120" height="80" rx="12" fill="#112235" stroke="#2c4866"/><path d="M160 110h30M310 110h30M460 110h30" stroke="url(#b)" stroke-width="3"/><text x="58" y="116" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Author</text><text x="202" y="116" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Compile</text><text x="354" y="116" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Pack</text><text x="516" y="116" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Runtime</text></svg>`,
    engine: `<svg viewBox="0 0 640 220" role="img" aria-label="Engine runtime graph"><defs><linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="#36c2ff"/><stop offset="1" stop-color="#9ac4ff"/></linearGradient></defs><circle cx="160" cy="110" r="56" fill="#112235" stroke="#2c4866"/><circle cx="320" cy="64" r="44" fill="#112235" stroke="#2c4866"/><circle cx="320" cy="158" r="44" fill="#112235" stroke="#2c4866"/><circle cx="485" cy="110" r="56" fill="#112235" stroke="#2c4866"/><path d="M216 92l60-22M216 128l60 22M364 64l64 28M364 158l64-28" stroke="url(#c)" stroke-width="3"/><text x="126" y="114" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Input</text><text x="295" y="68" fill="#d4e6ff" font-size="13" font-family="JetBrains Mono">Update</text><text x="294" y="162" fill="#d4e6ff" font-size="13" font-family="JetBrains Mono">Render</text><text x="454" y="114" fill="#d4e6ff" font-size="14" font-family="JetBrains Mono">Sync</text></svg>`
  };

  return svg[type] || svg.engine;
}

export function highlightCode(code) {
  const escaped = escapeHtml(code);
  return escaped
    .replace(/(\/\/.*)$/gm, '<span class="com">$1</span>')
    .replace(/\b(const|int|bool|for|if|return|struct|uint32_t|uint16_t|void)\b/g, '<span class="kw">$1</span>')
    .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}
