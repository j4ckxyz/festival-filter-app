// Detection Engine using face-api.js (more reliable than MediaPipe)

class DetectionEngine {
    static isInitialized = false;
    static detectionResults = null;
    static videoElement = null;
    static isDetecting = false;
    
    static async init(videoElement) {
        this.videoElement = videoElement;
        
        try {
            console.log('Loading face-api.js models...');
            
            // Load face-api.js models from CDN
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
            
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            
            this.isInitialized = true;
            console.log('✅ Face detection models loaded');
            
            // Start detection loop
            this.startDetection();
        } catch (error) {
            console.error('Detection Engine initialization error:', error);
            throw error;
        }
    }
    
    static async startDetection() {
        if (this.isDetecting) return;
        this.isDetecting = true;
        
        const detectFrame = async () => {
            if (!this.isDetecting) return;
            
            if (this.videoElement && this.videoElement.readyState === 4) {
                try {
                    // Detect face with landmarks
                    const detection = await faceapi
                        .detectSingleFace(this.videoElement, new faceapi.TinyFaceDetectorOptions({
                            inputSize: 224,
                            scoreThreshold: 0.5
                        }))
                        .withFaceLandmarks();
                    
                    this.detectionResults = detection;
                } catch (error) {
                    console.error('Detection error:', error);
                }
            }
            
            // Run detection every 100ms (10 FPS)
            setTimeout(detectFrame, 100);
        };
        
        detectFrame();
    }
    
    static stopDetection() {
        this.isDetecting = false;
    }
    
    static getFaceLandmarks() {
        if (!this.detectionResults || !this.detectionResults.landmarks) {
            return null;
        }
        
        const landmarks = this.detectionResults.landmarks;
        const positions = landmarks.positions;
        
        // Face-api.js has 68 landmarks
        // Key indices:
        // 0-16: Jaw line
        // 17-21: Left eyebrow
        // 22-26: Right eyebrow
        // 27-35: Nose
        // 36-41: Left eye
        // 42-47: Right eye
        // 48-67: Mouth
        
        return {
            all: positions,
            // Face outline
            forehead: positions[27], // Nose top (approximate forehead)
            // Eyes
            leftEye: this.getCenter(positions.slice(36, 42)),
            rightEye: this.getCenter(positions.slice(42, 48)),
            // Nose
            noseTip: positions[30],
            noseTop: positions[27],
            noseBottom: positions[33],
            // Mouth
            mouthLeft: positions[48],
            mouthRight: positions[54],
            mouthTop: positions[51],
            mouthBottom: positions[57],
            // Chin
            chin: positions[8],
            // Cheeks
            leftCheek: positions[2],
            rightCheek: positions[14],
            // Head top/sides for positioning
            topHead: positions[27], // Approximate
            leftTemple: positions[0],
            rightTemple: positions[16]
        };
    }
    
    static getCenter(points) {
        const sum = points.reduce((acc, p) => ({
            x: acc.x + p.x,
            y: acc.y + p.y
        }), { x: 0, y: 0 });
        
        return {
            x: sum.x / points.length,
            y: sum.y / points.length
        };
    }
    
    static calculateFaceBox(landmarks) {
        if (!landmarks || !landmarks.all) return null;
        
        const positions = landmarks.all;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        positions.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
        
        // Normalize to 0-1 range based on video dimensions
        const videoWidth = this.videoElement.videoWidth;
        const videoHeight = this.videoElement.videoHeight;
        
        return {
            x: minX / videoWidth,
            y: minY / videoHeight,
            width: (maxX - minX) / videoWidth,
            height: (maxY - minY) / videoHeight,
            centerX: (minX + maxX) / 2 / videoWidth,
            centerY: (minY + maxY) / 2 / videoHeight
        };
    }
    
    static getDetections() {
        return this.detectionResults;
    }
}

// Make globally available
window.DetectionEngine = DetectionEngine;
