// Filter Engine - Festive AR Filters

class FilterEngine {
    static activeFilter = 'none';
    static particles = [];
    static snowflakes = [];
    static backgroundImage = null;
    static assetCache = {};
    static assetsLoaded = false;
    
    static async loadAssets() {
        if (this.assetsLoaded) return;
        
        console.log('Loading filter assets...');
        
        // Load images
        const assets = {
            santaHat: 'assets/filters/santa_hat_PNG63.png',
            antlers: 'assets/filters/reinder-antlers.png',
            beard: 'assets/filters/santa-beard.png'
        };
        
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };
        
        try {
            this.assetCache.santaHat = await loadImage(assets.santaHat);
            this.assetCache.antlers = await loadImage(assets.antlers);
            this.assetCache.beard = await loadImage(assets.beard);
            this.assetsLoaded = true;
            console.log('✅ Filter assets loaded successfully');
        } catch (error) {
            console.error('Failed to load filter assets:', error);
        }
    }
    
    static setActiveFilter(filterName) {
        this.activeFilter = filterName;
        
        // Initialize filter-specific setup
        if (filterName === 'snowflakes' || filterName === 'snow') {
            this.initSnowflakes(filterName === 'snow' ? 100 : 50);
        } else if (filterName === 'sparkles') {
            this.particles = [];
        }
    }
    
    static render(canvas, ctx, video) {
        const landmarks = DetectionEngine.getFaceLandmarks();
        
        // Debug: log if landmarks detected (only occasionally to avoid spam)
        if (Math.random() < 0.01) {
            console.log('Filter:', this.activeFilter, 'Landmarks:', landmarks ? 'detected' : 'none');
        }
        
        switch (this.activeFilter) {
            case 'santa-hat':
                this.renderSantaHat(ctx, canvas, landmarks);
                break;
            case 'antlers':
                this.renderAntlers(ctx, canvas, landmarks);
                break;
            case 'beard':
                this.renderBeard(ctx, canvas, landmarks);
                break;
            case 'snowflakes':
                this.renderSnowflakes(ctx, canvas);
                break;
            case 'sparkles':
                this.renderSparkles(ctx, canvas, landmarks);
                break;
            case 'snow':
                this.renderSnow(ctx, canvas);
                break;
            case 'winter-bg':
                this.renderWinterBackground(ctx, canvas, video);
                break;
        }
    }
    
    static renderSantaHat(ctx, canvas, landmarks) {
        if (!landmarks || !this.assetCache.santaHat) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const img = this.assetCache.santaHat;
        
        // Calculate hat dimensions based on face width
        const hatWidth = box.width * canvas.width * 1.8;
        const aspectRatio = img.height / img.width;
        const hatHeight = hatWidth * aspectRatio;
        
        // Position hat on top of head, slightly overlapping
        const hatX = box.centerX * canvas.width - hatWidth / 2;
        const hatY = box.y * canvas.height - hatHeight * 0.75;
        
        ctx.save();
        ctx.drawImage(img, hatX, hatY, hatWidth, hatHeight);
        ctx.restore();
    }
    
    static renderAntlers(ctx, canvas, landmarks) {
        if (!landmarks || !this.assetCache.antlers) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const img = this.assetCache.antlers;
        
        // Calculate antler dimensions based on face width
        const antlerWidth = box.width * canvas.width * 2.0;
        const aspectRatio = img.height / img.width;
        const antlerHeight = antlerWidth * aspectRatio;
        
        // Position antlers on top of head
        const antlerX = box.centerX * canvas.width - antlerWidth / 2;
        const antlerY = box.y * canvas.height - antlerHeight * 0.6;
        
        ctx.save();
        ctx.drawImage(img, antlerX, antlerY, antlerWidth, antlerHeight);
        ctx.restore();
    }
    
    static renderBeard(ctx, canvas, landmarks) {
        if (!landmarks || !this.assetCache.beard) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const img = this.assetCache.beard;
        
        // Calculate beard dimensions based on face width
        const beardWidth = box.width * canvas.width * 1.6;
        const aspectRatio = img.height / img.width;
        const beardHeight = beardWidth * aspectRatio;
        
        // Position beard on lower face/chin area
        const beardX = box.centerX * canvas.width - beardWidth / 2;
        const beardY = landmarks.mouthBottom.y * canvas.height - beardHeight * 0.2;
        
        ctx.save();
        ctx.drawImage(img, beardX, beardY, beardWidth, beardHeight);
        ctx.restore();
    }
    
    static initSnowflakes(count) {
        this.snowflakes = [];
        for (let i = 0; i < count; i++) {
            this.snowflakes.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 3 + 2,
                speed: Math.random() * 0.002 + 0.001,
                drift: Math.random() * 0.001 - 0.0005
            });
        }
    }
    
    static renderSnowflakes(ctx, canvas) {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        
        this.snowflakes.forEach(flake => {
            // Update position
            flake.y += flake.speed;
            flake.x += flake.drift;
            
            // Wrap around
            if (flake.y > 1) flake.y = 0;
            if (flake.x > 1) flake.x = 0;
            if (flake.x < 0) flake.x = 1;
            
            // Draw snowflake
            const x = flake.x * canvas.width;
            const y = flake.y * canvas.height;
            
            this.drawSnowflake(ctx, x, y, flake.size);
        });
        
        ctx.restore();
    }
    
    static drawSnowflake(ctx, x, y, size) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * size,
                y + Math.sin(angle) * size
            );
        }
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static renderSnow(ctx, canvas) {
        // Heavy snow effect
        this.renderSnowflakes(ctx, canvas);
        
        // Add blur effect overlay
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    
    static renderSparkles(ctx, canvas, landmarks) {
        if (!landmarks) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        // Add new sparkles randomly
        if (Math.random() < 0.3) {
            const angle = Math.random() * Math.PI * 2;
            const distance = (Math.random() * 0.3 + 0.2) * box.width;
            
            this.particles.push({
                x: box.centerX + Math.cos(angle) * distance,
                y: box.centerY + Math.sin(angle) * distance,
                size: Math.random() * 3 + 2,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                rotation: Math.random() * Math.PI * 2
            });
        }
        
        // Update and render particles
        ctx.save();
        this.particles = this.particles.filter(p => {
            p.life -= p.decay;
            if (p.life <= 0) return false;
            
            ctx.save();
            ctx.translate(p.x * canvas.width, p.y * canvas.height);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.life;
            
            // Draw sparkle as a star
            ctx.fillStyle = '#FFD700';
            this.drawStar(ctx, 0, 0, 4, p.size * 2, p.size);
            
            // Add white center
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            p.rotation += 0.1;
            return true;
        });
        ctx.restore();
    }
    
    static drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    static renderWinterBackground(ctx, canvas, video) {
        const segmentation = DetectionEngine.getSegmentation();
        
        if (!segmentation || !segmentation.segmentationMask) {
            // Fallback: just draw video
            return;
        }
        
        ctx.save();
        
        // Create winter gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.7, '#B0E0E6'); // Powder blue
        gradient.addColorStop(1, '#FFFFFF'); // White (snow)
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some simple mountains
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.6);
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.4);
        ctx.lineTo(canvas.width * 0.6, canvas.height * 0.5);
        ctx.lineTo(canvas.width, canvas.height * 0.6);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        
        // Draw the person (using segmentation mask)
        // This is a simplified approach - for production, use WebGL for better performance
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        ctx.restore();
    }
}

// Make globally available
window.FilterEngine = FilterEngine;
