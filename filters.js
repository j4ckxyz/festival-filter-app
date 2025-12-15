// Filter Engine - Festive AR Filters

class FilterEngine {
    static activeFilter = 'none';
    static particles = [];
    static snowflakes = [];
    static backgroundImage = null;
    static assetCache = {};
    
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
        if (!landmarks) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const hatWidth = box.width * canvas.width * 1.5;
        const hatHeight = hatWidth * 0.8;
        const hatX = box.centerX * canvas.width - hatWidth / 2;
        const hatY = box.y * canvas.height - hatHeight * 0.85;
        
        // Draw Santa Hat using canvas shapes
        ctx.save();
        
        // Main red part (triangle)
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.moveTo(hatX + hatWidth * 0.1, hatY + hatHeight * 0.7);
        ctx.lineTo(hatX + hatWidth * 0.9, hatY + hatHeight * 0.7);
        ctx.lineTo(hatX + hatWidth * 0.7, hatY);
        ctx.closePath();
        ctx.fill();
        
        // White trim at bottom
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(hatX + hatWidth * 0.1, hatY + hatHeight * 0.7, hatWidth * 0.8, hatHeight * 0.1);
        
        // White pom-pom at top
        ctx.beginPath();
        ctx.arc(hatX + hatWidth * 0.7, hatY, hatWidth * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some texture with lighter red
        ctx.fillStyle = '#E63946';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(hatX + hatWidth * 0.1, hatY + hatHeight * 0.7);
        ctx.lineTo(hatX + hatWidth * 0.5, hatY + hatHeight * 0.4);
        ctx.lineTo(hatX + hatWidth * 0.7, hatY);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    static renderAntlers(ctx, canvas, landmarks) {
        if (!landmarks) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const antlerSize = box.width * canvas.width * 0.6;
        const centerX = box.centerX * canvas.width;
        const topY = box.y * canvas.height - antlerSize * 0.3;
        
        ctx.save();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = canvas.width * 0.01;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Left antler
        this.drawAntler(ctx, centerX - antlerSize * 0.3, topY, antlerSize, -1);
        
        // Right antler
        this.drawAntler(ctx, centerX + antlerSize * 0.3, topY, antlerSize, 1);
        
        ctx.restore();
    }
    
    static drawAntler(ctx, x, y, size, direction) {
        // Main branch
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + direction * size * 0.1, y - size * 0.4);
        ctx.stroke();
        
        // Side branches
        ctx.beginPath();
        ctx.moveTo(x + direction * size * 0.05, y - size * 0.2);
        ctx.lineTo(x + direction * size * 0.2, y - size * 0.25);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + direction * size * 0.08, y - size * 0.3);
        ctx.lineTo(x + direction * size * 0.15, y - size * 0.4);
        ctx.stroke();
    }
    
    static renderBeard(ctx, canvas, landmarks) {
        if (!landmarks) return;
        
        const box = DetectionEngine.calculateFaceBox(landmarks);
        if (!box) return;
        
        const beardWidth = box.width * canvas.width * 1.2;
        const beardHeight = beardWidth * 0.8;
        const beardX = box.centerX * canvas.width;
        const beardY = landmarks.chin.y * canvas.height;
        
        ctx.save();
        
        // Create fluffy beard effect
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.9;
        
        // Main beard shape (rounded bottom)
        ctx.beginPath();
        ctx.ellipse(
            beardX,
            beardY + beardHeight * 0.2,
            beardWidth * 0.5,
            beardHeight * 0.4,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Upper beard parts
        ctx.beginPath();
        ctx.ellipse(
            beardX - beardWidth * 0.2,
            beardY,
            beardWidth * 0.25,
            beardHeight * 0.25,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(
            beardX + beardWidth * 0.2,
            beardY,
            beardWidth * 0.25,
            beardHeight * 0.25,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add texture with semi-transparent circles
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI / 20) * i;
            const radius = beardWidth * 0.4;
            const fluffX = beardX + Math.cos(angle - Math.PI / 2) * radius * 0.8;
            const fluffY = beardY + beardHeight * 0.2 + Math.sin(angle - Math.PI / 2) * radius * 0.6;
            
            ctx.beginPath();
            ctx.arc(fluffX, fluffY, beardWidth * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }
        
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
