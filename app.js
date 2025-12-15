// Festival Filter Camera App - Core Application Logic

class FestivalCameraApp {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorScreen = document.getElementById('error-screen');
        this.app = document.getElementById('app');
        this.fpsCounter = document.getElementById('fps-counter');
        
        // State
        this.currentFilter = 'none';
        this.facingMode = 'user'; // 'user' or 'environment'
        this.stream = null;
        this.photos = [];
        this.isCapturing = false;
        
        // Performance tracking
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        
        // Initialize
        this.init();
    }
    
    async init() {
        try {
            this.updateLoadingMessage('Requesting camera access...');
            await this.setupCamera();
            
            this.updateLoadingMessage('Loading detection models...');
            await this.setupDetection();
            
            this.updateLoadingMessage('Setting up filters...');
            this.setupUI();
            this.loadPhotos();
            
            this.hideLoading();
            this.startRendering();
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    async setupCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: this.facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
            
            // Set canvas size to match video
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            
        } catch (error) {
            // Check if desktop and show mobile recommendation
            const isDesktop = window.innerWidth >= 769 && !('ontouchstart' in window);
            
            if (error.name === 'NotAllowedError') {
                if (isDesktop) {
                    this.showMobileRecommendation();
                } else {
                    throw new Error('Camera permission denied. Please allow camera access and reload.');
                }
            } else if (error.name === 'NotFoundError') {
                if (isDesktop) {
                    this.showMobileRecommendation();
                } else {
                    throw new Error('No camera found on this device.');
                }
            } else {
                throw new Error(`Camera error: ${error.message}`);
            }
        }
    }
    
    showMobileRecommendation() {
        this.hideLoading();
        const noCameraMsg = document.getElementById('no-camera-desktop');
        if (noCameraMsg) {
            noCameraMsg.classList.remove('hidden');
        }
    }
    
    resizeCanvas() {
        const videoAspect = this.video.videoWidth / this.video.videoHeight;
        const containerWidth = this.canvas.parentElement.offsetWidth;
        const containerHeight = this.canvas.parentElement.offsetHeight;
        const containerAspect = containerWidth / containerHeight;
        
        if (videoAspect > containerAspect) {
            this.canvas.width = containerWidth;
            this.canvas.height = containerWidth / videoAspect;
        } else {
            this.canvas.height = containerHeight;
            this.canvas.width = containerHeight * videoAspect;
        }
    }
    
    async setupDetection() {
        if (typeof DetectionEngine !== 'undefined') {
            await DetectionEngine.init(this.video);
        }
    }
    
    setupUI() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Capture button
        document.getElementById('capture-btn').addEventListener('click', () => {
            this.capturePhoto();
        });
        
        // Switch camera button
        document.getElementById('switch-camera-btn').addEventListener('click', () => {
            this.switchCamera();
        });
        
        // Gallery button
        document.getElementById('gallery-btn').addEventListener('click', () => {
            this.showGallery();
        });
        
        // Close gallery
        document.getElementById('close-gallery-btn').addEventListener('click', () => {
            this.hideGallery();
        });
        
        // Clear all photos
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            if (confirm('Delete all photos? This cannot be undone.')) {
                this.clearAllPhotos();
            }
        });
        
        // Retry button
        document.getElementById('retry-button').addEventListener('click', () => {
            location.reload();
        });
    }
    
    setFilter(filterName) {
        this.currentFilter = filterName;
        if (typeof FilterEngine !== 'undefined') {
            FilterEngine.setActiveFilter(filterName);
        }
    }
    
    async switchCamera() {
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
        
        // Stop current stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        // Restart with new facing mode
        await this.setupCamera();
        if (typeof DetectionEngine !== 'undefined') {
            await DetectionEngine.init(this.video);
        }
    }
    
    startRendering() {
        const render = () => {
            // Calculate FPS
            this.frameCount++;
            const now = performance.now();
            if (now - this.lastTime >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastTime = now;
                this.fpsCounter.textContent = `FPS: ${this.fps}`;
            }
            
            // Render frame
            this.renderFrame();
            
            requestAnimationFrame(render);
        };
        
        render();
    }
    
    renderFrame() {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw video
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Update face detection indicator
            this.updateFaceIndicator();
            
            // Apply filters
            if (typeof FilterEngine !== 'undefined' && this.currentFilter !== 'none') {
                FilterEngine.render(this.canvas, this.ctx, this.video);
            }
        }
    }
    
    updateFaceIndicator() {
        const indicator = document.getElementById('face-indicator');
        const status = document.getElementById('face-status');
        
        if (!indicator || !status) return;
        
        const landmarks = DetectionEngine?.getFaceLandmarks();
        
        if (landmarks) {
            indicator.className = 'face-indicator detected';
            status.textContent = '✅ Face detected!';
        } else {
            indicator.className = 'face-indicator not-detected';
            status.textContent = '👤 Looking for face...';
        }
    }
    
    capturePhoto() {
        if (this.isCapturing) return;
        
        this.isCapturing = true;
        
        // Create a temporary canvas for high-res capture
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = this.canvas.width;
        captureCanvas.height = this.canvas.height;
        const captureCtx = captureCanvas.getContext('2d');
        
        // Draw video frame first
        captureCtx.drawImage(this.video, 0, 0, captureCanvas.width, captureCanvas.height);
        
        // Apply current filter to capture
        if (typeof FilterEngine !== 'undefined' && this.currentFilter !== 'none') {
            FilterEngine.render(captureCanvas, captureCtx, this.video);
        }
        
        // Convert to blob and save
        captureCanvas.toBlob((blob) => {
            if (!blob) {
                console.error('Failed to create blob');
                this.isCapturing = false;
                return;
            }
            
            const photo = {
                id: Date.now(),
                blob: blob,
                timestamp: new Date().toISOString(),
                filter: this.currentFilter
            };
            
            this.savePhoto(photo);
            this.showCaptureFlash();
            this.isCapturing = false;
        }, 'image/png');
    }
    
    savePhoto(photo) {
        // Store photo metadata in localStorage
        const photoData = {
            id: photo.id,
            timestamp: photo.timestamp,
            filter: photo.filter
        };
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
            photoData.data = reader.result;
            
            try {
                const photos = JSON.parse(localStorage.getItem('festivalPhotos') || '[]');
                photos.push(photoData);
                
                // Limit to 50 photos to avoid quota issues
                if (photos.length > 50) {
                    photos.shift();
                }
                
                localStorage.setItem('festivalPhotos', JSON.stringify(photos));
                this.loadPhotos();
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    alert('Storage full! Please delete some photos.');
                } else {
                    console.error('Error saving photo:', error);
                }
            }
        };
        reader.readAsDataURL(photo.blob);
    }
    
    loadPhotos() {
        try {
            this.photos = JSON.parse(localStorage.getItem('festivalPhotos') || '[]');
            document.getElementById('photo-count').textContent = this.photos.length;
        } catch (error) {
            console.error('Error loading photos:', error);
            this.photos = [];
        }
    }
    
    showGallery() {
        const modal = document.getElementById('gallery-modal');
        const grid = document.getElementById('gallery-grid');
        
        if (this.photos.length === 0) {
            grid.innerHTML = `
                <div class="empty-gallery">
                    <span class="empty-icon">📷</span>
                    <p>No photos yet!</p>
                    <p class="small">Capture some festive moments</p>
                </div>
            `;
        } else {
            grid.innerHTML = this.photos.map(photo => `
                <div class="gallery-item">
                    <img src="${photo.data}" alt="Captured photo">
                    <div class="gallery-item-actions">
                        <button class="gallery-item-btn" onclick="app.downloadPhoto(${photo.id})" title="Download">
                            ⬇️
                        </button>
                        <button class="gallery-item-btn" onclick="app.deletePhoto(${photo.id})" title="Delete">
                            🗑️
                        </button>
                    </div>
                    <div class="gallery-item-date">
                        ${new Date(photo.timestamp).toLocaleString()}
                    </div>
                </div>
            `).join('');
        }
        
        modal.classList.remove('hidden');
    }
    
    hideGallery() {
        document.getElementById('gallery-modal').classList.add('hidden');
    }
    
    downloadPhoto(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;
        
        const link = document.createElement('a');
        link.href = photo.data;
        link.download = `festival-photo-${photo.id}.png`;
        link.click();
    }
    
    deletePhoto(photoId) {
        if (!confirm('Delete this photo?')) return;
        
        this.photos = this.photos.filter(p => p.id !== photoId);
        localStorage.setItem('festivalPhotos', JSON.stringify(this.photos));
        this.loadPhotos();
        this.showGallery(); // Refresh gallery view
    }
    
    clearAllPhotos() {
        localStorage.removeItem('festivalPhotos');
        this.photos = [];
        this.loadPhotos();
        this.hideGallery();
    }
    
    showCaptureFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            pointer-events: none;
            z-index: 9999;
            animation: flash 0.3s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 300);
    }
    
    updateLoadingMessage(message) {
        document.getElementById('loading-message').textContent = message;
    }
    
    hideLoading() {
        this.loadingScreen.classList.add('hidden');
        this.app.classList.remove('hidden');
    }
    
    showError(message) {
        this.loadingScreen.classList.add('hidden');
        this.errorScreen.classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new FestivalCameraApp();
    });
} else {
    app = new FestivalCameraApp();
}
