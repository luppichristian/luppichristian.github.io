export const PROFILE = {
  name: "Christian Luppi",
  role: "Systems Programmer & Graphics Tools Developer",
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
  description: "Released desktop utilities for graphics support inspection, low-level input diagnostics, and engine-adjacent workflows.",
  releasedCount: 2,
  focus: ["Cross-platform diagnostics", "Win32 input inspection", "Engine-support utilities"]
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

export const REPOSITORIES = [
  {
    name: "based-sdk",
    url: "https://github.com/luppichristian/based-sdk",
    description: "Low-level C framework for general computing, graphics, and audio work.",
    language: "C",
    stars: 1,
    homepage: "",
    updated: "2026-03-25T16:07:01Z"
  },
  {
    name: "claude_prompts",
    url: "https://github.com/luppichristian/claude_prompts",
    description: "Reusable Claude Code prompts for engineering workflows and day-to-day coding tasks.",
    language: "PowerShell",
    stars: 0,
    homepage: "",
    updated: "2026-02-04T16:03:03Z"
  },
  {
    name: "gamedev_resources",
    url: "https://github.com/luppichristian/gamedev_resources",
    description: "Collected articles, tools, and reference material for learning low-level game development in C/C++.",
    language: null,
    stars: 1,
    homepage: "",
    updated: "2026-01-30T17:16:46Z"
  },
  {
    name: "GameTest",
    url: "https://github.com/luppichristian/GameTest",
    description: "Record/replay testing framework for C/C++ games. Deterministic input capture and injection for automated testing.",
    language: "C",
    stars: 5,
    homepage: "",
    updated: "2026-03-20T17:49:00Z"
  },
  {
    name: "imgui_template_app",
    url: "https://github.com/luppichristian/imgui_template_app",
    description: "Starter template for building ImGui-based tools in C++.",
    language: "C++",
    stars: 0,
    homepage: "",
    updated: "2026-01-11T22:15:51Z"
  },
  {
    name: "libmath2",
    url: "https://github.com/luppichristian/libmath2",
    description: "C/C++ math library for common 2D and 3D operations.",
    language: "C",
    stars: 0,
    homepage: "https://luppichristian.github.io/libmath2/",
    updated: "2026-03-14T12:20:34Z"
  },
  {
    name: "luppichristian",
    url: "https://github.com/luppichristian/luppichristian",
    description: "Profile repository for notes, pinned content, and account-level GitHub presence.",
    language: null,
    stars: 0,
    homepage: "",
    updated: "2026-03-31T13:36:18Z"
  },
  {
    name: "luppichristian.github.io",
    url: "https://github.com/luppichristian/luppichristian.github.io",
    description: "Source for this portfolio site and search-friendly project directory.",
    language: "JavaScript",
    stars: 0,
    homepage: "",
    updated: "2026-04-05T15:04:41Z"
  },
  {
    name: "nshader",
    url: "https://github.com/luppichristian/nshader",
    description: "Portable shader package format built around SDL3_shadercross outputs.",
    language: "C",
    stars: 0,
    homepage: "",
    updated: "2026-02-13T22:54:22Z"
  },
  {
    name: "olib",
    url: "https://github.com/luppichristian/olib",
    description: "C library for serializing structured data across JSON, YAML, XML, binary, and related formats.",
    language: "C",
    stars: 0,
    homepage: "https://luppichristian.github.io/olib/",
    updated: "2026-02-13T14:56:40Z"
  },
  {
    name: "xccmeta",
    url: "https://github.com/luppichristian/xccmeta",
    description: "Static metadata parser for C/C++ projects, useful for preprocessing and build-time tooling.",
    language: "C++",
    stars: 3,
    homepage: "https://luppichristian.github.io/xccmeta/",
    updated: "2026-03-20T17:49:10Z"
  }
];

export const SKILL_GROUPS = [
  {
    title: "Core Languages",
    items: ["C", "C++", "GLSL", "HLSL", "Python", "JavaScript"]
  },
  {
    title: "Graphics APIs",
    items: ["OpenGL", "Vulkan", "DirectX", "SDL3 GPU", "bgfx", "Shader toolchains"]
  },
  {
    title: "Runtime & Engine Systems",
    items: ["Game-loop architecture", "Memory-conscious systems", "Multithreaded runtime code", "Developer-facing utilities"]
  },
  {
    title: "Performance & Diagnostics",
    items: ["CPU/GPU profiling", "Frame-time analysis", "SIMD optimization", "Data-oriented design"]
  },
  {
    title: "Build & Tooling",
    items: ["CMake", "Premake", "Clang", "GCC", "MSVC", "Visual Studio / VS Code"]
  },
  {
    title: "Workflow Support",
    items: ["RenderDoc", "Tracy", "Build automation", "Repo documentation"]
  }
];

export const CONTRIBUTIONS = [
  {
    title: "Cross-Platform Diagnostics",
    description: "Ship utilities that surface graphics support and low-level input behavior without requiring a full engine build."
  },
  {
    title: "Deterministic Engine Testing",
    description: "Explore record/replay workflows that make runtime behavior easier to verify as systems change."
  },
  {
    title: "Build-Time Metadata and Shader Pipelines",
    description: "Build parsers and packaging steps that move repetitive preprocessing out of the hot path."
  }
];
