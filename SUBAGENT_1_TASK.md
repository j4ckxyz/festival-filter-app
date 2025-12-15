# Subagent 1: Core App & UI Development

## Your Mission
Build the core HTML/CSS/JS structure for a mobile-first festival camera filter app.

## Requirements

### 1. HTML Structure (index.html)
- Semantic HTML5
- Mobile viewport meta tags
- Video element for camera feed
- Canvas overlay for filters
- UI controls:
  - Filter selection buttons (grid/carousel)
  - Capture photo button
  - Gallery toggle
  - Download button
- Photo gallery modal/section
- Loading states
- Error messages

### 2. CSS Styling (styles.css)
- Mobile-first responsive design
- Touch-friendly button sizes (min 44x44px)
- Full-screen camera view
- Modern UI with smooth animations
- Dark theme (works well for camera apps)
- Filter selection carousel
- Gallery grid layout
- Accessibility considerations

### 3. Core JavaScript (app.js)
- Camera access via getUserMedia
  - Request rear/front camera
  - Handle permissions
  - Error handling
- Video stream to canvas pipeline
- Photo capture:
  - Canvas snapshot
  - Convert to blob
  - Save to localStorage (with size management)
- LocalStorage management:
  - Save photos with timestamps
  - List saved photos
  - Delete photos
  - Clear all
  - Handle quota exceeded
- Download functionality:
  - Create downloadable blob
  - Trigger download with filename
- UI event handlers
- Responsive canvas sizing

### 4. Integration Points
- Export functions for filter system to hook into:
  - `drawFilterFrame(videoElement, canvasContext, detections)` 
- Event system for filter changes
- Performance monitoring hooks

## Constraints
- Pure vanilla JS (no frameworks)
- Must work on iOS Safari, Chrome Android
- Support both portrait and landscape
- Handle different screen sizes
- Graceful degradation

## Deliverables
1. index.html
2. styles.css  
3. app.js

Focus on solid foundation. Filters will be integrated later.
