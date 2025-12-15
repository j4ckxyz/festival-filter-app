# Festival Filter Camera - Test Plan

## Overview
Comprehensive testing strategy for the Festival Filter Camera application covering functional, performance, compatibility, and user experience testing.

## Test Environment Setup

### Required Equipment
- **Desktop**: Windows/Mac/Linux with webcam
- **Mobile**: iOS device (iPhone), Android device
- **Tablets**: iPad, Android tablet
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Network**: Test on various speeds (Wi-Fi, 4G, 5G)

### Test Data
- Face positions: centered, off-center, multiple people
- Lighting: bright, dim, mixed
- Backgrounds: plain, complex, moving
- Orientations: portrait, landscape

---

## 1. Functional Tests

### 1.1 Camera Initialization

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-01 | Camera permission request | Open app → Allow camera | Camera feed displays | ⬜ |
| FT-02 | Camera permission denial | Open app → Deny camera | Error screen shows with retry option | ⬜ |
| FT-03 | No camera available | Open on device without camera | Error message: "No camera found" | ⬜ |
| FT-04 | Camera already in use | Open while another app uses camera | Error with helpful message | ⬜ |
| FT-05 | Loading screen display | Open app | Shows spinner and loading messages | ⬜ |

### 1.2 Filter Functionality

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-06 | No filter (default) | Start app | Video feed shows without filters | ⬜ |
| FT-07 | Santa hat filter | Click Santa hat button | Red hat appears on head | ⬜ |
| FT-08 | Antlers filter | Click antlers button | Brown antlers appear above head | ⬜ |
| FT-09 | Beard filter | Click beard button | White beard appears on face | ⬜ |
| FT-10 | Snowflakes filter | Click snowflakes button | Snowflakes fall on screen | ⬜ |
| FT-11 | Sparkles filter | Click sparkles button | Sparkles appear around face | ⬜ |
| FT-12 | Snow filter | Click snow button | Heavy snow effect appears | ⬜ |
| FT-13 | Winter BG filter | Click winter BG button | Background replaced with winter scene | ⬜ |
| FT-14 | Filter switching | Switch between filters rapidly | Filters change smoothly, no lag | ⬜ |
| FT-15 | Filter persistence | Select filter → move face | Filter tracks face movement | ⬜ |
| FT-16 | Multiple faces | Two people in frame | Filter applies to detected face | ⬜ |
| FT-17 | No face detected | Cover camera/look away | Filter doesn't appear or disappears | ⬜ |

### 1.3 Photo Capture

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-18 | Capture without filter | No filter → Click capture | Photo saved without filter | ⬜ |
| FT-19 | Capture with filter | Select filter → Click capture | Photo saved with filter applied | ⬜ |
| FT-20 | Capture flash effect | Click capture | White flash animation appears | ⬜ |
| FT-21 | Photo count update | Capture photo | Badge shows incremented count | ⬜ |
| FT-22 | Rapid captures | Click capture 5 times rapidly | All 5 photos saved | ⬜ |
| FT-23 | Photo quality | Capture → View in gallery | Photo is clear and filter applied | ⬜ |

### 1.4 Gallery Management

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-24 | Open empty gallery | Click gallery (no photos) | Shows "No photos yet" message | ⬜ |
| FT-25 | Open gallery with photos | Capture photos → Click gallery | Shows grid of captured photos | ⬜ |
| FT-26 | View photo details | Click photo in gallery | Photo displays with timestamp | ⬜ |
| FT-27 | Download photo | Click download button | Photo downloads to device | ⬜ |
| FT-28 | Delete single photo | Click delete → Confirm | Photo removed from gallery | ⬜ |
| FT-29 | Cancel delete | Click delete → Cancel | Photo remains in gallery | ⬜ |
| FT-30 | Clear all photos | Click "Clear All" → Confirm | All photos removed | ⬜ |
| FT-31 | Close gallery | Click X button | Gallery closes, camera view returns | ⬜ |
| FT-32 | Gallery scroll | Capture 20 photos → Open gallery | Gallery scrolls smoothly | ⬜ |

### 1.5 Camera Controls

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-33 | Switch camera (mobile) | Click switch button | Switches front/back camera | ⬜ |
| FT-34 | Switch camera (desktop) | Click switch button (if multiple cameras) | Switches between cameras | ⬜ |
| FT-35 | Filter after camera switch | Switch camera → Select filter | Filter works on new camera | ⬜ |

### 1.6 Storage Management

| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| FT-36 | Storage limit (50 photos) | Capture 51 photos | Oldest photo removed automatically | ⬜ |
| FT-37 | Storage quota exceeded | Fill localStorage | Error message: "Storage full!" | ⬜ |
| FT-38 | Clear storage | Clear all → Check localStorage | festivalPhotos key removed | ⬜ |
| FT-39 | Persist across sessions | Capture photos → Reload page | Photos still in gallery | ⬜ |

---

## 2. Performance Tests

### 2.1 Frame Rate (FPS)

| Test ID | Test Case | Target | Measurement | Status |
|---------|-----------|--------|-------------|--------|
| PT-01 | No filter FPS (mobile) | 30+ FPS | Use FPS counter | ⬜ |
| PT-02 | Santa hat filter FPS | 30+ FPS | Use FPS counter | ⬜ |
| PT-03 | Snowflakes filter FPS | 30+ FPS | Use FPS counter | ⬜ |
| PT-04 | Winter BG filter FPS | 25+ FPS | Use FPS counter (heavier) | ⬜ |
| PT-05 | Desktop FPS (all filters) | 60 FPS | Use FPS counter | ⬜ |
| PT-06 | FPS during filter switch | No drop >10 FPS | Monitor during switch | ⬜ |

### 2.2 Loading Performance

| Test ID | Test Case | Target | Measurement | Status |
|---------|-----------|--------|-------------|--------|
| PT-07 | Initial page load | <3s | Chrome DevTools | ⬜ |
| PT-08 | Camera initialization | <2s | Time from open to video | ⬜ |
| PT-09 | Model loading | <5s | Time to first detection | ⬜ |
| PT-10 | Filter switch time | <100ms | Visual delay | ⬜ |
| PT-11 | Photo capture speed | <500ms | Click to flash | ⬜ |
| PT-12 | Gallery open time | <300ms | Click to visible | ⬜ |

### 2.3 Memory Usage

| Test ID | Test Case | Target | Measurement | Status |
|---------|-----------|--------|-------------|--------|
| PT-13 | Initial memory | <100MB | Chrome Task Manager | ⬜ |
| PT-14 | With filters active | <150MB | Chrome Task Manager | ⬜ |
| PT-15 | After 50 photos | <200MB | Chrome Task Manager | ⬜ |
| PT-16 | Memory leak test (30min) | No continuous growth | Monitor over time | ⬜ |
| PT-17 | Gallery with 50 photos | <250MB | Chrome Task Manager | ⬜ |

### 2.4 Battery Impact (Mobile)

| Test ID | Test Case | Expected | Measurement | Status |
|---------|-----------|----------|-------------|--------|
| PT-18 | 10 min usage | <10% battery drain | Device battery monitor | ⬜ |
| PT-19 | With heavy filter | <15% battery drain | Device battery monitor | ⬜ |

---

## 3. Compatibility Tests

### 3.1 Browser Testing

| Browser | Version | OS | Camera | Filters | Capture | Gallery | Status |
|---------|---------|----|---------|---------|---------|---------| -------|
| Chrome | 120+ | Windows | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Chrome | 120+ | macOS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Chrome | 120+ | Linux | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Firefox | Latest | Windows | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Firefox | Latest | macOS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Safari | 16+ | macOS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Edge | Latest | Windows | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| iOS Safari | 15 | iPhone | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| iOS Safari | 16 | iPhone | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| iOS Safari | 17 | iPhone | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Chrome | 100+ | Android | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Chrome | Latest | Android | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### 3.2 Device Testing

| Device | OS | Browser | FPS | Load Time | Notes | Status |
|--------|----|---------|----- |-----------|-------|--------|
| iPhone 13 Pro | iOS 16 | Safari | | | | ⬜ |
| iPhone 12 | iOS 15 | Safari | | | | ⬜ |
| iPhone XR | iOS 14 | Safari | | | | ⬜ |
| Pixel 7 | Android 13 | Chrome | | | | ⬜ |
| Pixel 6 | Android 12 | Chrome | | | | ⬜ |
| Galaxy S21 | Android 13 | Chrome | | | | ⬜ |
| iPad Air | iOS 16 | Safari | | | | ⬜ |
| iPad Pro | iOS 17 | Safari | | | | ⬜ |
| Galaxy Tab | Android 12 | Chrome | | | | ⬜ |
| MacBook Pro | macOS 13 | Safari | | | | ⬜ |
| Dell Laptop | Windows 11 | Chrome | | | | ⬜ |

### 3.3 Screen Sizes

| Test ID | Screen Size | Orientation | Expected | Status |
|---------|-------------|-------------|----------|--------|
| CT-01 | 320x568 (iPhone SE) | Portrait | UI fits, readable | ⬜ |
| CT-02 | 375x667 (iPhone 8) | Portrait | UI fits, readable | ⬜ |
| CT-03 | 414x896 (iPhone 11) | Portrait | UI fits, readable | ⬜ |
| CT-04 | 768x1024 (iPad) | Portrait | UI scales appropriately | ⬜ |
| CT-05 | 1024x768 (iPad) | Landscape | Controls repositioned | ⬜ |
| CT-06 | 1920x1080 (Desktop) | Landscape | Desktop layout active | ⬜ |
| CT-07 | 2560x1440 (2K) | Landscape | High resolution support | ⬜ |

---

## 4. User Experience Tests

### 4.1 Usability

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| UX-01 | First-time user flow | User can take photo within 30 seconds | ⬜ |
| UX-02 | Filter discovery | User finds and tries 3 filters easily | ⬜ |
| UX-03 | Photo download | User can download photo intuitively | ⬜ |
| UX-04 | Error recovery | Clear error messages with action steps | ⬜ |
| UX-05 | Touch targets | All buttons >44x44px on mobile | ⬜ |

### 4.2 Accessibility

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| AX-01 | Keyboard navigation | Can tab through all controls | ⬜ |
| AX-02 | Screen reader | Buttons have descriptive labels | ⬜ |
| AX-03 | Color contrast | Text readable on backgrounds | ⬜ |
| AX-04 | Focus indicators | Clear focus states visible | ⬜ |

---

## 5. Edge Cases & Error Handling

| Test ID | Scenario | Expected Behavior | Status |
|---------|----------|-------------------|--------|
| EC-01 | Network disconnect | App continues working (all local) | ⬜ |
| EC-02 | Browser back button | Returns to previous page | ⬜ |
| EC-03 | Page reload during capture | Graceful restart | ⬜ |
| EC-04 | Incognito mode | Works but warns storage won't persist | ⬜ |
| EC-05 | Multiple tabs open | Each tab has independent camera | ⬜ |
| EC-06 | Device rotation | Canvas resizes, filters continue | ⬜ |
| EC-07 | App in background | Camera pauses, resumes on return | ⬜ |
| EC-08 | Low storage | Warning before quota exceeded | ⬜ |
| EC-09 | Face out of frame | Filter disappears smoothly | ⬜ |
| EC-10 | Poor lighting | Continues working, may reduce accuracy | ⬜ |

---

## 6. Security & Privacy Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| SP-01 | HTTPS requirement | Camera works on HTTPS/localhost only | ⬜ |
| SP-02 | Data storage | Only stores in localStorage, no server | ⬜ |
| SP-03 | Photo privacy | Photos not sent anywhere | ⬜ |
| SP-04 | Camera permissions | Requests minimum necessary permissions | ⬜ |

---

## 7. Regression Tests

Run after any code changes:

- [ ] All filters still work
- [ ] Photo capture functional
- [ ] Gallery CRUD operations
- [ ] Camera switching
- [ ] Performance metrics maintained
- [ ] No console errors
- [ ] Mobile responsiveness intact

---

## Test Execution Notes

### Priority Levels
- **P0 (Critical)**: Camera, filters, capture - must work
- **P1 (High)**: Gallery, storage, switching
- **P2 (Medium)**: Performance optimization
- **P3 (Low)**: Nice-to-have features

### Test Frequency
- **Per Commit**: Functional smoke test (P0)
- **Before PR**: Full functional + P1 performance
- **Before Release**: Complete test suite
- **Monthly**: Full device matrix

### Reporting Issues
Use this template:
```
**Test ID**: FT-XX
**Device**: iPhone 12, iOS 15.5, Safari
**Steps**: 1. Open app 2. Select filter 3. ...
**Expected**: Filter appears on face
**Actual**: No filter visible
**Screenshots**: [attach]
**Console Errors**: [paste]
```

---

## Automated Testing (Future)

### Potential Automation
- Visual regression testing (screenshots)
- Performance benchmarks
- Memory leak detection
- Cross-browser testing (Selenium)

### Manual Testing Required
- Face detection accuracy
- Filter positioning/tracking
- User experience flow
- Accessibility

---

## Sign-Off

| Test Phase | Tester | Date | Pass/Fail | Notes |
|------------|--------|------|-----------|-------|
| Functional | | | | |
| Performance | | | | |
| Compatibility | | | | |
| UX/Accessibility | | | | |
| Security | | | | |

**Release Approval**: _____________________ Date: __________
