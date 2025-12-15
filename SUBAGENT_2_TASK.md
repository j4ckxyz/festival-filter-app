# Subagent 2: Filter Technology & Detection

## Your Mission
Build the real-time face detection and filter rendering system.

## Requirements

### 1. Detection Engine (detectionEngine.js)
Choose and implement ONE solution:

**Option A: MediaPipe (RECOMMENDED)**
- Lighter weight for mobile
- Face Mesh for landmarks
- Selfie Segmentation for background
- Better performance on mobile devices
- CDN: https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619
- CDN: https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1632777926

**Option B: face-api.js**
- More established
- Good face detection
- May be heavier for mobile
- CDN: https://cdn.jsdelivr.net/npm/face-api.js

Implement:
- Face detection initialization
- Real-time landmark detection (eyes, nose, mouth position)
- Head pose estimation (for positioning hats/antlers)
- Background segmentation
- Performance optimization (model size, detection frequency)

### 2. Filter System (filters.js)
Create modular filter classes/functions:

#### Filter 1: Santa Hat
- Position on top of head
- Scale with head size
- Rotate with head tilt
- Use Canvas drawImage with transform

#### Filter 2: Antlers
- Position above head
- Scale appropriately
- Follow head movement

#### Filter 3: Beard
- Position on lower face (chin area)
- Scale with face size
- Multiple beard styles

#### Filter 4: Snowflakes
- Particle system overlay
- Random positions, sizes, fall speeds
- Accumulation effect optional

#### Filter 5: Sparkles
- Particle effects around face
- Random twinkle animation
- Fade in/out

#### Filter 6: Snow Effect
- Full-screen snow overlay
- Parallax layers
- Realistic falling animation

#### Filter 7: Background Replacement
- Use segmentation mask
- Winter/snowy backgrounds
- Smooth edges (blur mask)
- Multiple background options

### 3. Rendering Pipeline
- requestAnimationFrame loop
- Detection throttling (every N frames)
- Canvas compositing
- Layer management:
  1. Background (if replaced)
  2. Video (or segmented person)
  3. Face filters
  4. Screen effects (snow, sparkles)

### 4. Performance Optimization
- Model loading strategy
- Detection frequency tuning
- Canvas size optimization
- Offscreen canvas for complex effects
- WebGL acceleration if beneficial

### 5. Filter Assets
Create or source simple SVG/PNG assets:
- Santa hat
- Antlers
- Beards (3 variations)
- Snowflake shapes
- Sparkle graphics

Or use Canvas drawing for simple shapes.

## Integration Points
- Expose `initDetection(videoElement, onDetection)` 
- Expose `renderFilter(filterName, canvas, ctx, video, detections)`
- Expose `setActiveFilter(filterName)`
- Expose `setBackgroundImage(imageUrl)`

## Performance Targets
- 30+ FPS on mobile
- <200ms detection latency
- Smooth filter transitions

## Deliverables
1. detectionEngine.js
2. filters.js
3. assets/filters/ (SVG/PNG filter graphics)

Make it smooth and real-time!
