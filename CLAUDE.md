# CLAUDE.md - AI Assistant Guide for try-3dgs-model-viewer

## Project Overview

**Project Name:** try-3dgs-model-viewer
**Type:** 3D Gaussian Splatting (3DGS) Model Viewer
**Purpose:** A web-based viewer for displaying and interacting with 3D Gaussian Splatting models

### What is 3D Gaussian Splatting?

3D Gaussian Splatting (3DGS) is a novel 3D scene representation technique that uses 3D Gaussians to represent scenes. It enables high-quality real-time rendering of complex 3D scenes captured from photographs. This project aims to provide an interactive viewer for such models.

## Repository Status

**Current State:** Empty repository - initial setup phase
**Main Branch:** Not yet established
**Last Updated:** 2025-11-15

## Expected Technology Stack

Based on the project type, the following technologies are likely to be used:

### Core Technologies
- **Language:** JavaScript/TypeScript (TypeScript strongly recommended for type safety)
- **Framework:**
  - React (for component-based UI) OR
  - Vanilla JavaScript/TypeScript (for lighter implementation)
- **3D Graphics:**
  - Three.js (primary 3D rendering library)
  - WebGL (underlying graphics API)
- **Build Tool:**
  - Vite (recommended for fast development)
  - Webpack (alternative)
  - Parcel (alternative)

### Supporting Libraries (Expected)
- **Camera Controls:** Three.js OrbitControls or similar
- **File Loading:** Three.js loaders, custom PLY/Splat loaders
- **UI Components:** React (if using framework), vanilla HTML/CSS
- **State Management:** React Context/Redux (if using React), or custom state management

## Repository Structure

The following structure is recommended for this project:

```
try-3dgs-model-viewer/
├── src/
│   ├── components/          # UI components (if using React)
│   ├── core/               # Core viewer logic
│   │   ├── GaussianSplatRenderer.ts
│   │   ├── Scene.ts
│   │   └── Camera.ts
│   ├── loaders/            # Model loaders
│   │   └── SplatLoader.ts
│   ├── utils/              # Utility functions
│   ├── shaders/            # GLSL shader files
│   │   ├── gaussian.vert
│   │   └── gaussian.frag
│   ├── types/              # TypeScript type definitions
│   ├── index.ts            # Entry point
│   └── styles/             # CSS/styling files
├── public/                 # Static assets
│   └── models/            # Sample 3DGS models
├── tests/                 # Test files
│   ├── unit/
│   └── integration/
├── docs/                  # Documentation
├── examples/              # Usage examples
├── .github/              # GitHub workflows
│   └── workflows/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Build tool configuration
├── .gitignore
├── README.md             # User-facing documentation
└── CLAUDE.md            # This file
```

## Development Workflow

### Initial Setup (Not yet completed)
```bash
# Initialize npm project
npm init -y

# Install core dependencies
npm install three

# Install dev dependencies
npm install -D vite typescript @types/three

# Initialize TypeScript
npx tsc --init
```

### Development Commands (To be implemented)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Git Workflow

**Branch Naming Convention:**
- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`
- Claude branches: `claude/<session-id>`

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(renderer): add Gaussian splatting renderer

- Implement core rendering pipeline
- Add shader support for 3D Gaussians
- Integrate with Three.js scene

Closes #1
```

## Key Conventions

### Code Style

1. **TypeScript:** Use TypeScript for all source files
2. **Naming Conventions:**
   - Classes: PascalCase (e.g., `GaussianSplatRenderer`)
   - Functions/Methods: camelCase (e.g., `loadModel`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_GAUSSIANS`)
   - Files: PascalCase for classes, camelCase for utilities

3. **File Organization:**
   - One class per file
   - Related utilities grouped in single files
   - Barrel exports (index.ts) for modules

4. **Imports:**
   - Group imports: external libraries, internal modules, types
   - Use absolute paths from src root

### Code Quality

1. **Type Safety:**
   - Avoid `any` type
   - Define interfaces for all data structures
   - Use generics where appropriate

2. **Error Handling:**
   - Use try-catch for async operations
   - Provide meaningful error messages
   - Log errors appropriately

3. **Performance:**
   - Optimize rendering loop
   - Use requestAnimationFrame for animations
   - Implement frustum culling
   - Consider Level of Detail (LOD) systems

### Comments and Documentation

1. **JSDoc Comments:** Use for all public APIs
```typescript
/**
 * Loads a 3D Gaussian Splatting model from a file
 * @param url - URL or path to the model file
 * @param onProgress - Optional progress callback
 * @returns Promise resolving to the loaded model
 */
async function loadModel(url: string, onProgress?: (progress: number) => void): Promise<GaussianSplatModel>
```

2. **Inline Comments:** Explain complex algorithms, especially shader code
3. **README Updates:** Keep README.md synchronized with code changes

## 3D Gaussian Splatting Specifics

### Key Concepts to Understand

1. **Gaussian Representation:**
   - Each Gaussian has: position (3D), covariance (3x3 matrix), color (RGB), opacity
   - Stored efficiently in GPU buffers

2. **Rendering Pipeline:**
   - Sort Gaussians by depth
   - Render using alpha blending
   - Custom shaders for Gaussian projection

3. **File Formats:**
   - `.ply` files (common format)
   - Custom binary formats for optimization
   - Possible support for `.splat` format

4. **Performance Considerations:**
   - Models can contain millions of Gaussians
   - GPU memory management critical
   - Efficient sorting algorithms needed

### Implementation Priorities

1. **Phase 1 - Basic Viewer:**
   - Load and display simple 3DGS model
   - Basic camera controls (orbit, pan, zoom)
   - Simple UI for file loading

2. **Phase 2 - Enhanced Features:**
   - Quality settings (Gaussian count, resolution)
   - Performance metrics display
   - Multiple model support

3. **Phase 3 - Advanced Features:**
   - Model editing capabilities
   - Export functionality
   - VR/AR support

## Testing Strategy

### Unit Tests
- Test utility functions
- Test loader parsing logic
- Test mathematical computations

### Integration Tests
- Test rendering pipeline
- Test file loading
- Test camera interactions

### Performance Tests
- Frame rate benchmarks
- Memory usage monitoring
- Load time measurements

### Testing Tools (To be configured)
- Jest or Vitest for unit tests
- Testing Library for component tests (if React)
- Puppeteer for E2E tests

## Security Considerations

1. **File Upload:**
   - Validate file types and sizes
   - Sanitize file names
   - Implement file size limits

2. **WebGL:**
   - Handle WebGL context loss
   - Validate shader compilation
   - Protect against malicious shaders

3. **Dependencies:**
   - Regular dependency updates
   - Security audit with `npm audit`

## Performance Guidelines

### Rendering Performance
- Target: 60 FPS for models up to 1M Gaussians
- Use Web Workers for sorting if needed
- Implement progressive loading for large models

### Memory Management
- Monitor GPU memory usage
- Implement disposal methods for cleanup
- Use object pooling for frequently created objects

### Loading Performance
- Compress model files
- Implement streaming loading
- Show loading progress

## Common Issues and Solutions

### WebGL Context Loss
```typescript
renderer.context.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  // Handle context loss
});

renderer.context.addEventListener('webglcontextrestored', () => {
  // Reinitialize resources
});
```

### Browser Compatibility
- Test on Chrome, Firefox, Safari, Edge
- Provide fallbacks for unsupported features
- Display clear error messages for incompatible browsers

## Resources and References

### 3D Gaussian Splatting Papers
- Original Paper: "3D Gaussian Splatting for Real-Time Radiance Field Rendering"
- GitHub: https://github.com/graphdeco-inria/gaussian-splatting

### Three.js Documentation
- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/

### WebGL Resources
- WebGL Fundamentals: https://webglfundamentals.org/
- GPU Gems: https://developer.nvidia.com/gpugems/

## AI Assistant Guidelines

### When Working on This Project

1. **Always Check:**
   - Current dependencies in package.json
   - Existing code patterns and conventions
   - TypeScript configuration settings

2. **Before Making Changes:**
   - Run tests if they exist
   - Check for breaking changes
   - Review related code sections

3. **After Making Changes:**
   - Update tests
   - Update documentation
   - Check for TypeScript errors
   - Verify functionality

4. **Code Review Checklist:**
   - [ ] Type safety maintained
   - [ ] Performance implications considered
   - [ ] Error handling implemented
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] No console.log statements in production code

### Questions to Ask

Before implementing features, consider asking:
- What is the target model size (number of Gaussians)?
- What browsers need to be supported?
- Are there any specific performance requirements?
- Should the viewer support mobile devices?
- What file formats should be supported?

### Red Flags to Watch For

- Memory leaks (especially in render loop)
- Unbounded arrays or buffers
- Missing error handling in async operations
- Hardcoded paths or magic numbers
- Missing type annotations
- Synchronous operations that should be async

## Future Considerations

### Potential Features
- Model compression and optimization
- Real-time editing and manipulation
- Animation support
- Multi-scene management
- Cloud storage integration
- Collaborative viewing
- VR/AR mode

### Scalability
- Consider Web Workers for heavy computations
- Implement lazy loading for large scenes
- Consider server-side rendering for thumbnails
- Plan for API if backend needed

## Changelog

### 2025-11-15
- Initial CLAUDE.md creation
- Repository structure defined
- Core conventions established
- Technology stack recommendations made

---

**Note to AI Assistants:** This document will evolve as the project develops. Always check for updates and contribute improvements when you discover better patterns or practices.
