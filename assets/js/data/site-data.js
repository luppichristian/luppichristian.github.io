export const PROFILE = {
  name: "Christian Luppi",
  role: "Systems Programmer & Creative Developer",
  location: "Italy",
  email: "business.luppichristian@gmail.com",
  github: "https://github.com/luppichristian",
  x: "https://x.com/luppi_christian",
  youtube: "https://www.youtube.com/@christianluppi",
  kofi: "https://ko-fi.com/christianluppi"
};

export const SKILL_GROUPS = [
  {
    title: "Low-Level Systems",
    items: ["C", "C++", "Memory Ownership", "Multithreading", "Data-Oriented Design"]
  },
  {
    title: "Graphics & GPU",
    items: ["OpenGL", "Vulkan", "SDL3 GPU", "GLSL", "HLSL", "Shader Tooling"]
  },
  {
    title: "Toolchains & Quality",
    items: ["CMake", "Premake", "Tracy", "RenderDoc", "CI Scripts", "Deterministic Testing"]
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

export const PROJECTS = [
  {
    slug: "sdl-contributions",
    title: "SDL Contributions & Tooling",
    size: "lg",
    repo: "https://github.com/luppichristian",
    label: "Open Source",
    stack: ["C", "SDL3", "Build Systems"],
    summary: "Improving integration quality for SDL-driven projects with predictable cross-platform behavior and cleaner toolchain ergonomics.",
    challenge:
      "The challenge was to keep low-level control while reducing setup friction for teams that need reliable builds and rendering behavior on multiple targets.",
    stackDetails: ["C", "SDL3", "CMake", "Premake", "GitHub Actions"],
    implementation:
      "Implemented layered adapters for platform abstraction, deterministic smoke checks for runtime initialization, and strict capability reporting before main loop entry.",
    code: `// Startup validation before window / GPU init\nint app_bootstrap(const AppConfig* cfg) {\n    if (!cfg || !cfg->title || cfg->width <= 0 || cfg->height <= 0) {\n        return APP_ERR_CONFIG;\n    }\n\n    if (!gpu_runtime_probe()) {\n        return APP_ERR_GPU_UNAVAILABLE;\n    }\n\n    return app_init_platform(cfg);\n}`,
    results: [
      { text: "GitHub Profile", href: "https://github.com/luppichristian" },
      { text: "Reach out on X", href: "https://x.com/luppi_christian" }
    ],
    diagram: "sdl"
  },
  {
    slug: "gpu-workflows",
    title: "GPU Workflows & Shader Pipelines",
    size: "md",
    repo: "https://github.com/luppichristian/nshader",
    label: "Rendering",
    stack: ["GLSL", "HLSL", "SDL3 GPU"],
    summary: "Packaging and validating shader variants for multiple graphics backends with a repeatable asset pipeline.",
    challenge:
      "Different backends require different binary formats and feature constraints. The objective was one authoring flow with deterministic outputs.",
    stackDetails: ["GLSL", "HLSL", "Shadercross", "Python", "C"],
    implementation:
      "Designed a metadata-driven compile stage that emits backend-specific binaries plus shared reflection data used by runtime binding validation.",
    code: `struct ShaderPackageHeader {\n    uint32_t magic;\n    uint16_t version;\n    uint16_t stage_count;\n    uint32_t reflection_offset;\n};\n\nbool validate_package(const ShaderPackageHeader* h) {\n    return h && h->magic == 0x4E534844 && h->version >= 2;\n}`,
    results: [
      { text: "nshader Repository", href: "https://github.com/luppichristian/nshader" },
      { text: "YouTube", href: "https://www.youtube.com/@christianluppi" }
    ],
    diagram: "gpu"
  },
  {
    slug: "custom-engine",
    title: "Custom Engine Runtime",
    size: "sm",
    repo: "https://github.com/luppichristian",
    label: "Architecture",
    stack: ["C++", "Task Graph", "Profiling"],
    summary: "A lean runtime architecture focused on deterministic systems, frame budgeting, and explicit data flow.",
    challenge:
      "Balancing flexibility with strict frame timing constraints while keeping system ownership clear and debuggable under load.",
    stackDetails: ["C++", "Task Scheduler", "SIMD", "Tracy"],
    implementation:
      "Built a schedule graph with explicit phase barriers and thread-local command buffers, then merged work on synchronization-safe boundaries.",
    code: `for (FramePhase phase : frame_schedule) {\n    task_graph_begin(phase);\n    submit_phase_jobs(world, phase);\n    task_graph_wait(phase);\n    profiler_mark_phase(phase);\n}`,
    results: [
      { text: "GitHub Profile", href: "https://github.com/luppichristian" },
      { text: "Ko-fi", href: "https://ko-fi.com/christianluppi" }
    ],
    diagram: "engine"
  }
];
