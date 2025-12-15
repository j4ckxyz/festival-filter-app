# Contributing to Festival Filter Camera 🎄

Thank you for your interest in contributing! This guide will help you add new filters, fix bugs, and improve the app.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding New Filters](#adding-new-filters)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of HTML, CSS, JavaScript
- Understanding of Canvas API
- Familiarity with face detection concepts (helpful but not required)

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/festival-filter-app.git
cd festival-filter-app
```

2. **Start Local Server**
```bash
# Python
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000
```

3. **Open in Browser**
Navigate to `http://localhost:8000`

4. **Enable Debug Mode**
Open browser console (F12) to see logs and errors

## 🎨 Adding New Filters

### Step 1: Update HTML (index.html)

Add a new filter button in the filter grid:

```html
<button class="filter-btn" data-filter="my-new-filter">
    <span class="filter-icon">🎃</span>
    <span class="filter-name">My Filter</span>
</button>
```

### Step 2: Implement Filter Logic (filters.js)

Add your filter rendering function to the `FilterEngine` class:

```javascript
static renderMyNewFilter(ctx, canvas, landmarks) {
    if (!landmarks) return; // No face detected
    
    const box = DetectionEngine.calculateFaceBox(landmarks);
    if (!box) return;
    
    // Your drawing code here
    ctx.save();
    
    // Example: Draw a circle on the nose
    const noseTip = landmarks.noseTip;
    const x = noseTip.x * canvas.width;
    const y = noseTip.y * canvas.height;
    const radius = box.width * canvas.width * 0.1;
    
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}
```

### Step 3: Register in Switch Statement

Add your filter to the render switch in `FilterEngine.render()`:

```javascript
static render(canvas, ctx, video) {
    const landmarks = DetectionEngine.getFaceLandmarks();
    
    switch (this.activeFilter) {
        case 'my-new-filter':
            this.renderMyNewFilter(ctx, canvas, landmarks);
            break;
        // ... other cases
    }
}
```

### Step 4: Test Your Filter

1. Refresh the page
2. Select your new filter
3. Verify it appears correctly
4. Test on mobile devices

## 🎯 Available Landmarks

MediaPipe Face Mesh provides 468 landmarks. Key ones available:

```javascript
const landmarks = DetectionEngine.getFaceLandmarks();

// Access key points:
landmarks.forehead      // Top of forehead
landmarks.noseTip       // Tip of nose
landmarks.chin          // Bottom of chin
landmarks.leftEye       // Left eye center
landmarks.rightEye      // Right eye center
landmarks.mouthTop      // Top of mouth
landmarks.mouthBottom   // Bottom of mouth
landmarks.leftCheek     // Left cheek
landmarks.rightCheek    // Right cheek

// All 468 points:
landmarks.all[index]    // Each has {x, y, z} (0-1 normalized)
```

### Helper Functions

```javascript
// Get bounding box of face
const box = DetectionEngine.calculateFaceBox(landmarks);
// Returns: { x, y, width, height, centerX, centerY }

// Convert normalized coords to canvas pixels
const pixelX = landmarks.noseTip.x * canvas.width;
const pixelY = landmarks.noseTip.y * canvas.height;
```

## 💡 Filter Ideas & Tips

### Positioning Tips
- **Hats/Headwear**: Use `forehead` or `topHead`, extend upward
- **Glasses**: Position between eyes using `leftEye` and `rightEye`
- **Masks**: Use `mouthTop`, `mouthBottom`, and face width
- **Earrings**: Use face box edges
- **Crowns**: Position above forehead

### Performance Tips
- **Keep it simple**: Complex paths slow down rendering
- **Use `ctx.save()`/`ctx.restore()`**: Isolate state changes
- **Avoid frequent allocations**: Reuse objects when possible
- **Cache calculations**: Don't recalculate every frame if static
- **Use `globalAlpha`**: For transparency effects
- **Batch operations**: Group similar draws together

### Drawing Techniques

**Basic Shapes**
```javascript
// Circle
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// Rectangle
ctx.fillRect(x, y, width, height);

// Triangle
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.lineTo(x3, y3);
ctx.closePath();
ctx.fill();
```

**Advanced Effects**
```javascript
// Gradient
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
gradient.addColorStop(0, '#FF0000');
gradient.addColorStop(1, '#0000FF');
ctx.fillStyle = gradient;

// Shadow
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

// Rotation
ctx.save();
ctx.translate(x, y);
ctx.rotate(angle);
// ... draw rotated content
ctx.restore();
```

**Particle Systems** (like sparkles/snow)
```javascript
static initParticles(count) {
    this.myParticles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: Math.random() * 0.002 - 0.001,
        vy: Math.random() * 0.002 + 0.001,
        size: Math.random() * 3 + 1
    }));
}

static updateParticles(ctx, canvas) {
    this.myParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.y > 1) p.y = 0;
        if (p.x > 1) p.x = 0;
        if (p.x < 0) p.x = 1;
        
        // Draw
        ctx.fillRect(p.x * canvas.width, p.y * canvas.height, p.size, p.size);
    });
}
```

## 📝 Code Style

### JavaScript
- Use ES6+ features (classes, arrow functions, const/let)
- camelCase for variables and functions
- PascalCase for classes
- Document complex logic with comments
- Keep functions focused and small

### CSS
- Mobile-first approach
- Use CSS custom properties for colors
- Logical naming (BEM-like)
- Organize by component

### Formatting
```javascript
// Good
static renderFilter(ctx, canvas, landmarks) {
    if (!landmarks) return;
    
    const box = DetectionEngine.calculateFaceBox(landmarks);
    ctx.save();
    // ... implementation
    ctx.restore();
}

// Bad
static renderFilter(ctx,canvas,landmarks){
if(!landmarks)return;
const box=DetectionEngine.calculateFaceBox(landmarks);
//... implementation
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Filter appears when selected
- [ ] Filter tracks face correctly
- [ ] Works at different distances
- [ ] Works in portrait and landscape
- [ ] Performs well (30+ FPS)
- [ ] No console errors
- [ ] Works on mobile device
- [ ] Photo capture includes filter

### Performance Testing
Run the performance test suite:
1. Open `tests/performance-tests.html`
2. Enable your filter
3. Record FPS, memory usage
4. Ensure FPS > 30 on target devices

### Browser Testing
Test on:
- ✅ Chrome Desktop (latest)
- ✅ Firefox Desktop (latest)
- ✅ Safari Desktop (latest)
- ✅ iOS Safari (14+)
- ✅ Chrome Android (90+)

## 🔄 Pull Request Process

### Before Submitting
1. **Test thoroughly** on multiple devices/browsers
2. **Update documentation** if adding features
3. **Check performance** - ensure no FPS drop
4. **Add yourself** to contributors list
5. **Follow code style** guidelines

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New filter
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Performance validated
- [ ] No console errors

## Screenshots/Video
(If applicable)

## Additional Notes
Any other context
```

### Review Process
1. Maintainers will review within 1 week
2. Address any requested changes
3. Once approved, changes will be merged
4. Your contribution will be credited!

## 🎁 Filter Contribution Ideas

Looking for inspiration? Try these:
- 🎩 Top hat
- 👓 Sunglasses
- 🎭 Venetian mask
- 👑 Crown
- 🦊 Animal ears (cat, fox, bunny)
- 💄 Makeup effects
- 🌈 Rainbow effects
- 🎪 Face paint patterns
- 🧙 Wizard hat and beard
- 🤡 Clown nose
- 💎 Jewelry (earrings, necklace)
- 🔥 Fire/flame effects
- 🌟 Halo
- 😈 Devil horns
- 👼 Angel wings (on sides)

## 📚 Resources

- [MediaPipe Face Mesh Guide](https://google.github.io/mediapipe/solutions/face_mesh.html)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WebRTC getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## ❓ Questions?

- Open an issue for questions
- Tag with "question" label
- Check existing issues first

## 🌟 Recognition

All contributors will be listed in:
- README.md contributors section
- Special thanks in releases
- Contributor badge on profile

Thank you for making Festival Filter Camera better! 🎅✨
