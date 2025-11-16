# CLAUDE.md - AI Assistant Guide for try-3dgs-model-viewer

## General Guideline

Conversations must be conducted in Japanese.

## Project Overview

- **Project Name:** try-3dgs-model-viewer
- **Type:** 3D Gaussian Splatting (3DGS) Model Viewer
- **Purpose:** A web-based viewer for displaying and interacting with 3D Gaussian Splatting models
- **Reference:**
  - Please refer to the following repository for displaying 3DGS models.
    https://github.com/aktnk/try-supersplat-app-by-playcanvas-react.git
  - Please refer to the following repository for managing 3DGD models.
    https://github.com/aktnk/3D_model_manager.git

### What is 3D Gaussian Splatting?

3D Gaussian Splatting (3DGS) is a novel 3D scene representation technique that uses 3D Gaussians to represent scenes. It enables high-quality real-time rendering of complex 3D scenes captured from photographs. This project aims to provide an interactive viewer for such models.

## Tech Stack

### Frontend
- **React** 19.2.0 - UI framework with hooks
- **TypeScript** 5.9.3 - Type-safe development
- **PlayCanvas Engine** 2.13.1+ - 3D rendering engine for WebGL
- **Vite** 7.2.2 - Fast build tool with HMR
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** 18+ - Server runtime
- **Express.js** 5.1.0 - Web framework
- **SQLite3** 5.1.7 - Embedded database
- **Multer** 2.0.2 - File upload middleware

### Infrastructure
- **Docker** & **Docker Compose** - Containerization
  - Backend: `node:18-slim` (Debian-based, for sqlite3 compatibility)
  - Frontend: Multi-stage build with `node:18-alpine` and `nginx:alpine`
  - Reverse proxy: `nginx:alpine`
- **Nginx** - Reverse proxy server

## Architecture

### System Architecture
```
┌─────────────┐     ┌──────────┐     ┌──────────┐
│   Browser   │────▶│  Nginx   │────▶│ Frontend │
│  (Client)   │     │  (8080)  │     │  (5173)  │
└─────────────┘     └──────────┘     └──────────┘
                           │
                           ▼
                    ┌──────────┐
                    │ Backend  │
                    │  (3000)  │
                    └──────────┘
                           │
                    ┌──────┴──────┐
                    │   SQLite    │
                    │  Database   │
                    └─────────────┘
```

### Frontend Architecture
- **Component-based**: React functional components with hooks
- **Type Safety**: TypeScript for compile-time type checking
- **3D Rendering**: PlayCanvas engine integration
- **API Communication**: Axios for REST API calls
- **State Management**: React useState/useEffect hooks

### Backend Architecture
- **RESTful API**: Express.js routes for CRUD operations
- **Repository Pattern**: Data access abstraction in `models.repository.js`
- **File Storage**: Physical files stored in `uploads/` directory
- **Database**: SQLite for metadata storage
  - Database file location: `/uploads/3dgs_models.sqlite`
  - Stored in volume-mounted directory for persistence and write permissions
  - Automatically created on first startup

## Key Components

### Frontend Components

#### 1. `GaussianSplatViewer.tsx` (frontend/src/components/)
**Purpose**: 3D model viewer using PlayCanvas engine

**Key Features**:
- Initializes PlayCanvas application
- Loads and renders 3DGS models (.ply, .sog, .splat)
- Integrates OrbitCamera for user interaction
- Provides camera reset functionality
- Displays loading state

**Important Methods**:
- PlayCanvas app initialization in `useEffect`
- Model loading with asset management
- Camera reset via `handleResetCamera()`

**Props**:
- `modelUrl?: string` - URL of the 3DGS model to display
- `onLoadError?: (error: Error) => void` - Error callback
- `onLoadSuccess?: () => void` - Success callback

#### 2. `OrbitCamera.ts` (frontend/src/utils/)
**Purpose**: Camera controller for 3D scene navigation

**Key Features**:
- Mouse and touch event handling
- Pitch/yaw rotation control
- Pan and zoom functionality
- Camera state save/restore
- Smooth camera movements

**Important Methods**:
- `setupMouseEvents(element)` - Attach mouse event listeners
- `setupTouchEvents(element)` - Attach touch event listeners
- `saveInitialState()` - Save current camera state as initial
- `resetToInitial()` - Reset camera to saved initial state
- `reset(target, distance, pitch, yaw)` - Reset to specific state
- `updateCameraPosition()` - Apply transformations to camera

**Camera Controls**:
- **Mouse**: Left-drag (rotate), Shift+Left-drag (pan), Wheel (zoom)
- **Touch**: 1-finger (rotate), 2-finger pinch (zoom)

#### 3. `ModelList.tsx` (frontend/src/components/)
**Purpose**: Display grid of model cards

**Features**:
- Responsive grid layout
- Handles empty state
- Integrates with ModelCard and UploadForm

#### 4. `ModelCard.tsx` (frontend/src/components/)
**Purpose**: Individual model card display

**Features**:
- Displays model metadata (title, description, file info)
- Shows thumbnail if available
- Provides view and delete actions

#### 5. `SearchBar.tsx` (frontend/src/components/)
**Purpose**: Search interface for filtering models

**Features**:
- Search by title or description
- Debounced search input
- Clear search functionality

#### 6. `UploadForm.tsx` (frontend/src/components/)
**Purpose**: Model upload interface

**Features**:
- File selection and validation
- Metadata input (title, description, point count)
- Progress tracking
- Error handling

### Backend Structure

#### 1. `server.js` (backend/)
**Purpose**: Express server entry point

**Key Features**:
- CORS configuration
- Static file serving
- API route mounting
- Error handling middleware

#### 2. `models.repository.js` (backend/data/)
**Purpose**: Database abstraction layer

**Key Methods**:
- `getAllModels()` - Retrieve all models
- `getModelById(id)` - Get single model
- `searchModels(query)` - Search by title/description
- `createModel(data)` - Insert new model
- `updateModel(id, data)` - Update model metadata
- `deleteModel(id)` - Soft delete model

#### 3. `models.js` (backend/routes/)
**Purpose**: REST API endpoints for model management

**Endpoints**:
- `GET /api/models` - List all models (with search)
- `GET /api/models/:id` - Get specific model
- `POST /api/models` - Upload new model
- `PUT /api/models/:id` - Update model
- `POST /api/models/:id/thumbnail` - Update thumbnail
- `DELETE /api/models/:id` - Delete model (soft delete)

## File Structure

```
try-3dgs-model-viewer/
├── backend/
│   ├── data/
│   │   ├── database.js           # SQLite connection
│   │   └── models.repository.js  # Data access layer
│   ├── routes/
│   │   └── models.js             # API routes
│   ├── server.js                 # Express server
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GaussianSplatViewer.tsx  # 3D viewer
│   │   │   ├── ModelList.tsx            # Model grid
│   │   │   ├── ModelCard.tsx            # Model card
│   │   │   ├── SearchBar.tsx            # Search UI
│   │   │   └── UploadForm.tsx           # Upload UI
│   │   ├── utils/
│   │   │   └── OrbitCamera.ts           # Camera controller
│   │   ├── services/
│   │   │   └── api.ts                   # API client
│   │   ├── types/
│   │   │   └── model.ts                 # TypeScript types
│   │   ├── App.tsx                      # Root component
│   │   ├── App.css                      # Global styles
│   │   └── main.tsx                     # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── nginx/
│   └── nginx.conf                # Reverse proxy config
├── uploads/                      # Volume-mounted directory
│   ├── models/                   # 3DGS model files
│   ├── thumbnails/               # Thumbnail images
│   └── 3dgs_models.sqlite        # SQLite database (persistent)
├── docker-compose.yml            # Container orchestration
├── CLAUDE.md                     # This file
└── README.md                     # User documentation
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components (no class components)
- Implement proper error handling
- Add comments for complex logic

### PlayCanvas Best Practices
- Always cleanup resources in useEffect cleanup
- Use ref for PlayCanvas app instance
- Handle asset loading errors gracefully
- Optimize rendering performance

### API Development
- Use RESTful conventions
- Implement proper HTTP status codes
- Validate input data
- Handle file uploads securely
- Use repository pattern for data access

### Database
- Use SQLite for local development
- Implement soft deletes (deleted_at field)
- Store file paths, not file content
- Maintain referential integrity
- **Important**: Database file is stored in `/uploads/3dgs_models.sqlite`
  - Uses `UPLOADS_DIR` environment variable (defaults to `uploads/`)
  - Ensures write permissions in Docker environment
  - Located in volume-mounted directory for data persistence

## Common Tasks

### Adding a New Feature
1. Update database schema if needed (backend/data/database.js)
2. Add repository methods (backend/data/models.repository.js)
3. Create API endpoints (backend/routes/)
4. Create TypeScript types (frontend/src/types/)
5. Implement UI components (frontend/src/components/)
6. Update API client (frontend/src/services/api.ts)
7. Update documentation (README.md)

### Debugging PlayCanvas Issues
- Check browser console for WebGL errors
- Verify asset loading in Network tab
- Inspect PlayCanvas app instance state
- Check camera position and target
- Verify model file format (.ply, .sog, .splat)

### Testing Camera Controls
- Test mouse drag in all directions
- Test touch gestures on mobile devices
- Verify camera reset functionality
- Check zoom limits
- Test pan functionality

## Recent Updates

### Docker Environment Fixes (Latest)
- **Fixed backend container crash issue** (Exit code 139)
  - Changed base image from `node:18-alpine` to `node:18-slim` (Debian-based)
  - Alpine Linux musl library caused sqlite3 native module to crash
  - Debian glibc provides better compatibility for native Node.js modules
- **Database file relocation**
  - Moved database from `backend/data/` to `/uploads/` directory
  - Ensures write permissions in Docker environment
  - Enables data persistence through volume mounting
- **Uploads directory structure**
  - Automatically created on container startup
  - Includes `.gitkeep` files for version control
  - Setup script (`setup.sh`) for initial directory creation

### Camera Reset Feature
- Added reset button in GaussianSplatViewer component
- Implemented `saveInitialState()` and `resetToInitial()` in OrbitCamera
- Button positioned at bottom-right of viewer
- Resets camera to initial pitch, yaw, distance, and target

### Camera Control Improvements
- Fixed pitch direction rotation
- Made mouse/touch drag rotation more intuitive
- Improved responsiveness of camera movements

## Docker Troubleshooting

### Backend Container Keeps Restarting

**Symptoms**:
- Container status shows `Restarting` in `docker compose ps`
- Exit code 139 (segmentation fault)
- Server logs show successful startup but then crash

**Common Causes**:
1. **sqlite3 native module crash on Alpine Linux**
   - Alpine uses musl libc instead of glibc
   - Native Node.js modules may not be compatible
   - **Solution**: Use `node:18-slim` (Debian-based) instead of `node:18-alpine`

2. **File permission issues**
   - Cannot write to database file
   - Cannot create files in uploads directory
   - **Solution**: Ensure database is in volume-mounted `/uploads` directory

3. **Old Docker image cache**
   - Docker using outdated image despite code changes
   - **Solution**:
     ```bash
     docker compose down
     docker rmi try-3dgs-model-viewer-backend
     docker compose build --no-cache backend
     docker compose up -d
     ```

### Database Connection Issues

**Symptoms**:
- "Database connection error" in logs
- "SQLITE_CANTOPEN" errors

**Solutions**:
- Verify database path: Should be `/uploads/3dgs_models.sqlite`
- Check volume mounting in `docker-compose.yml`
- Ensure uploads directory exists with proper permissions
- Run `./setup.sh` to create directory structure

### File Upload Failures

**Symptoms**:
- "Failed to upload model" errors
- API returns 500 errors on upload

**Solutions**:
- Check uploads directory permissions: `chmod -R 777 uploads`
- Verify multer configuration in `backend/routes/models.js`
- Check available disk space
- Review backend logs: `docker compose logs backend`

### Important Docker Best Practices

1. **Base Image Selection**
   - Use Debian-based images (`node:18-slim`) for backends with native modules
   - Alpine Linux is suitable for pure JavaScript applications
   - Consider image size vs compatibility tradeoffs

2. **Volume Mounting**
   - Always mount persistent data directories as volumes
   - Database files should be in volume-mounted locations
   - Use `.gitkeep` to maintain directory structure in Git

3. **Build Cache**
   - Use `--no-cache` flag when troubleshooting build issues
   - Layer ordering matters: put frequently changing code last
   - Leverage multi-stage builds for smaller production images

## Notes for AI Assistants

- Always maintain type safety when modifying TypeScript code
- Test 3D viewer changes in browser (PlayCanvas requires WebGL)
- When modifying camera controls, consider both mouse and touch input
- Verify file upload security when changing upload logic
- Check database migrations when modifying schema
- Update both README.md and CLAUDE.md when adding features
- Follow the repository pattern for database operations
- Use proper error handling for async operations
- **Docker-specific considerations**:
  - Backend uses `node:18-slim` (Debian) for sqlite3 compatibility
  - Do not change to Alpine-based images without testing sqlite3
  - Database file must remain in `/uploads/` directory for write permissions
  - Always test Docker builds after changing Dockerfile or dependencies
  - Use `docker compose build --no-cache` when troubleshooting build issues
