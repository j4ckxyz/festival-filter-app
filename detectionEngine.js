// Detection Engine using MediaPipe Face Mesh and Selfie Segmentation

class DetectionEngine {
    static faceMesh = null;
    static selfieSegmentation = null;
    static videoElement = null;
    static detectionResults = null;
    static segmentationResults = null;
    static isInitialized = false;
    
    static async init(videoElement) {
        this.videoElement = videoElement;
        
        try {
            // Initialize Face Mesh
            await this.initFaceMesh();
            
            // Initialize Selfie Segmentation for background replacement
            await this.initSelfieSegmentation();
            
            this.isInitialized = true;
            console.log('✅ Detection Engine initialized');
        } catch (error) {
            console.error('Detection Engine initialization error:', error);
            throw error;
        }
    }
    
    static async initFaceMesh() {
        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });
        
        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.faceMesh.onResults((results) => {
            this.detectionResults = results;
        });
        
        // Start detection loop
        this.startFaceDetection();
    }
    
    static async initSelfieSegmentation() {
        this.selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            }
        });
        
        this.selfieSegmentation.setOptions({
            modelSelection: 1, // 0 for general, 1 for landscape
        });
        
        this.selfieSegmentation.onResults((results) => {
            this.segmentationResults = results;
        });
        
        // Start segmentation loop
        this.startSegmentation();
    }
    
    static async startFaceDetection() {
        const detectFrame = async () => {
            if (this.videoElement && this.videoElement.readyState === 4) {
                await this.faceMesh.send({ image: this.videoElement });
            }
            setTimeout(detectFrame, 100); // Run detection every 100ms (10 FPS for detection)
        };
        detectFrame();
    }
    
    static async startSegmentation() {
        const segmentFrame = async () => {
            if (this.videoElement && this.videoElement.readyState === 4) {
                await this.selfieSegmentation.send({ image: this.videoElement });
            }
            setTimeout(segmentFrame, 150); // Run segmentation every 150ms
        };
        segmentFrame();
    }
    
    static getDetections() {
        return this.detectionResults;
    }
    
    static getSegmentation() {
        return this.segmentationResults;
    }
    
    static getFaceLandmarks() {
        if (!this.detectionResults || !this.detectionResults.multiFaceLandmarks) {
            return null;
        }
        
        const landmarks = this.detectionResults.multiFaceLandmarks[0];
        if (!landmarks) return null;
        
        // Key landmark indices for MediaPipe Face Mesh (468 landmarks)
        return {
            all: landmarks,
            // Face outline
            forehead: landmarks[10],
            // Eyes
            leftEye: landmarks[33],
            rightEye: landmarks[263],
            leftEyeInner: landmarks[133],
            rightEyeInner: landmarks[362],
            leftEyeOuter: landmarks[33],
            rightEyeOuter: landmarks[263],
            // Nose
            noseTip: landmarks[1],
            noseTop: landmarks[168],
            noseBottom: landmarks[2],
            // Mouth
            mouthLeft: landmarks[61],
            mouthRight: landmarks[291],
            mouthTop: landmarks[13],
            mouthBottom: landmarks[14],
            // Chin
            chin: landmarks[152],
            // Cheeks
            leftCheek: landmarks[234],
            rightCheek: landmarks[454],
            // Head top/sides for positioning
            topHead: landmarks[10],
            leftTemple: landmarks[234],
            rightTemple: landmarks[454]
        };
    }
    
    static calculateFaceBox(landmarks) {
        if (!landmarks || !landmarks.all) return null;
        
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        
        landmarks.all.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
        };
    }
}

// Make globally available
window.DetectionEngine = DetectionEngine;
