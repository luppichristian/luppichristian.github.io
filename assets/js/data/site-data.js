export const PROFILE = {
  name: "Christian Luppi",
  role: "Systems Programmer & Creative Developer",
  location: "Italy",
  email: "business.luppichristian@gmail.com",
  github: "https://github.com/luppichristian",
  itch: "https://christian-luppi.itch.io/",
  x: "https://x.com/luppi_christian",
  youtube: "https://www.youtube.com/@christianluppi",
  kofi: "https://ko-fi.com/christianluppi"
};

export const ITCH_PROFILE = {
  title: "itch.io Releases",
  handle: "christian-luppi.itch.io",
  url: "https://christian-luppi.itch.io/",
  description: "Building game engines, parsers, and performance-focused tools in C/C++. Exploring low-level systems and AI-assisted development.",
  releasedCount: 2,
  focus: ["Native desktop tools", "C/C++ diagnostics", "Engine-adjacent workflows"]
};

export const ITCH_PROJECTS = [
  {
    title: "GFX Support View",
    slug: "gfx-support-view",
    url: "https://christian-luppi.itch.io/gfx-support-view",
    description: "Desktop utility for inspecting your system's graphics API support in one place.",
    price: "$1.99",
    category: "Tool",
    status: "Released",
    published: "Mar 2026",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["Vulkan", "OpenGL", "DirectX", "Metal"],
    image: "https://img.itch.zone/aW1nLzI2Mzk3ODY0LnBuZw==/315x250%23c/PIQY%2BL.png"
  },
  {
    title: "Win32 Input Tester",
    slug: "win32-input-tester",
    url: "https://christian-luppi.itch.io/win32-input-tester",
    description: "Native Windows utility for inspecting low-level keyboard, mouse, controller, tablet, raw input, HID, and clipboard data.",
    price: "$2.99",
    category: "Tool",
    status: "Released",
    published: "Mar 2026",
    platforms: ["Windows"],
    tags: ["Win32", "Input", "HID", "Diagnostics"],
    image: "https://img.itch.zone/aW1nLzI2MjcxOTM4LnBuZw==/315x250%23c/ThZr4R.png"
  }
];

export const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["C", "C++", "GLSL", "HLSL", "Python", "JavaScript", "SQL", "HTML", "TypeScript"]
  },
  {
    title: "Graphics Programming",
    items: ["OpenGL", "Vulkan", "DirectX", "SDL3 GPU", "bgfx", "Modern GPU pipelines", "Shader development", "Real-time rendering architecture"]
  },
  {
    title: "Engine & Systems Programming",
    items: ["Custom game engine development in C", "Multithreaded systems", "Low-level architecture", "Memory and cache-efficient design"]
  },
  {
    title: "Performance Engineering",
    items: ["SIMD optimization", "CPU and GPU profiling", "Frame time optimization", "Data-oriented design"]
  },
  {
    title: "Concurrency & Parallelism",
    items: ["Multithreaded programming", "Task-based systems", "Sync primitives", "High-performance runtime systems"]
  },
  {
    title: "Tools & Toolchains",
    items: ["RenderDoc", "Tracy", "CMake", "Premake", "Visual Studio", "VS Code", "Clang", "GCC", "MSVC", "GPU debugging and profiling"]
  },
  {
    title: "Web & Backend",
    items: ["Full-stack web development", "Database design", "Backend architecture"]
  },
  {
    title: "AI-Assisted Development",
    items: ["Code generation pipelines", "Automated tooling", "Agent-assisted workflows", "Developer productivity systems"]
  }
];

export const CONTRIBUTIONS = [
  {
    title: "SDL Ecosystem Contributions",
    description: "Contributed practical engine-oriented utilities around SDL workflows, with focus on cross-platform parity and build friction reduction."
  },
  {
    title: "Shader Packaging & Portability",
    description: "Built tooling that standardizes shader artifacts and backend targeting, reducing integration complexity for mixed graphics APIs."
  },
  {
    title: "Engine Runtime Experiments",
    description: "Iterated on custom runtime architecture patterns for deterministic loops, event pipelines, and memory-conscious scene management."
  }
];
