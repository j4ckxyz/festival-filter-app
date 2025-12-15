# Festival Filter App - Project Brief

## Overview
A mobile-first web application that applies real-time festive AR filters to camera feed with face detection and background replacement capabilities.

## Key Requirements

### Core Functionality
- Real-time camera access and video preview
- Face detection using face-api.js or MediaPipe
- Multiple festive filters: snowflakes, antlers, beards, sparkles, snow, santa hat
- Background segmentation and replacement (snowy/winter backgrounds)
- Photo capture functionality
- LocalStorage for saved photos
- Download capability for captured photos
- Filter switching UI

### Technical Constraints
- Pure HTML/CSS/JavaScript (no build tools initially)
- All processing on-device (client-side)
- Mobile-first responsive design
- Optimized for smooth real-time performance
- Cross-device compatibility

### Performance Targets
- 30+ FPS on mid-range mobile devices
- <2s initial load time
- Minimal battery drain

## Team Structure

### Subagent 1: Core App & UI
**Responsibilities:**
- HTML structure with semantic markup
- Mobile-responsive CSS (flexbox/grid)
- Camera API integration
- Video preview setup
- Canvas overlay system
- Photo capture mechanism
- LocalStorage management
- Download functionality
- UI controls for filter selection
- Loading states and error handling

**Deliverables:**
- index.html
- styles.css
- app.js (core application logic)

### Subagent 2: Filter Technology
**Responsibilities:**
- Evaluate and choose: face-api.js vs MediaPipe
- Face detection implementation
- Face landmark tracking
- Filter rendering system:
  - Snowflakes (particle system)
  - Antlers (positioned on head)
  - Beards (positioned on face)
  - Sparkles (particle effects)
  - Snow (screen overlay)
  - Santa hat (positioned on head)
- Background segmentation (MediaPipe Person Segmentation)
- Background replacement
- Performance optimization
- Real-time rendering pipeline

**Deliverables:**
- filters.js (filter engine)
- detectionEngine.js (face/body detection)
- Filter asset coordination

### Subagent 3: Testing & Documentation
**Responsibilities:**
- Comprehensive README with:
  - Installation instructions
  - Usage guide
  - Architecture overview
  - Browser compatibility
  - Troubleshooting guide
- Testing strategy:
  - Manual test cases
  - Performance benchmarks
  - Cross-browser testing plan
  - Mobile device testing matrix
- Create demo/example content
- Code documentation

**Deliverables:**
- README.md
- tests/test-plan.md
- tests/performance-tests.html
- CONTRIBUTING.md

## Technology Stack

### Libraries to Consider
1. **face-api.js** - Face detection (TensorFlow.js based)
2. **MediaPipe** - Face mesh & person segmentation (Google)
3. **Canvas API** - Real-time rendering

### Browser APIs
- getUserMedia (Camera access)
- Canvas API
- LocalStorage
- Blob/File API

## Timeline
- Phase 1: Setup & Core (Parallel development)
- Phase 2: Integration
- Phase 3: Testing & Optimization
- Phase 4: Documentation finalization

## Success Criteria
- ✅ Works on iOS Safari, Chrome Android, Desktop Chrome/Firefox
- ✅ Smooth 30+ FPS on iPhone 12 / Pixel 5 equivalent
- ✅ All 6+ filters working
- ✅ Background replacement functional
- ✅ Photos saveable and downloadable
- ✅ Intuitive mobile UI
