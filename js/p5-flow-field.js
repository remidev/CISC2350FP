// p5.js Flow Field Visualization
// Perlin noise flow field with particle trails

// p5.js sketch using instance mode to avoid conflicts
const p5Sketch = (p) => {
    let noiseScale = 0.01;
    let particles = [];
    const particleCount = 300;
    const repulsionRadius = 15; // Distance for particle-to-particle repulsion
    const repulsionForce = 0.3;
    let fadeAlpha = 25; // Controllable fade alpha value
    
    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                prevX: 0,
                prevY: 0
            });
        }
        p.background(20); // Clear trails on reset
    };
    
    p.setup = () => {
        // Match the container width like vanilla canvas does
        let container = document.getElementById('p5Canvas');
        let canvasWidth = container.offsetWidth;
        let canvas = p.createCanvas(canvasWidth, 400);
        canvas.parent('p5Canvas');
        
        initParticles();
    };
    
    p.draw = () => {
        // Fade effect for trails (higher alpha = faster fade)
        p.fill(20, 20, 20, fadeAlpha);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
        
        // Draw and move particles
        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            particle.prevX = particle.x;
            particle.prevY = particle.y;
            
            // Get noise value
            let noiseVal = p.noise(particle.x * noiseScale, particle.y * noiseScale, p.frameCount * 0.01);
            let angle = noiseVal * p.TWO_PI * 2;
            
            // Move particle based on flow field
            particle.x += p.cos(angle) * 2;
            particle.y += p.sin(angle) * 2;
            
            // Particle-to-particle repulsion (check nearby particles)
            for (let j = 0; j < particles.length; j++) {
                if (i !== j) {
                    let other = particles[j];
                    let dx = particle.x - other.x;
                    let dy = particle.y - other.y;
                    let distance = p.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0 && distance < repulsionRadius) {
                        // Push particles apart
                        let force = (repulsionRadius - distance) / repulsionRadius * repulsionForce;
                        let pushAngle = p.atan2(dy, dx);
                        particle.x += p.cos(pushAngle) * force;
                        particle.y += p.sin(pushAngle) * force;
                    }
                }
            }
            
            // Wrap around edges
            let wrapped = false;
            if (particle.x < 0) { particle.x = p.width; wrapped = true; }
            if (particle.x > p.width) { particle.x = 0; wrapped = true; }
            if (particle.y < 0) { particle.y = p.height; wrapped = true; }
            if (particle.y > p.height) { particle.y = 0; wrapped = true; }
            
            // Only draw trail if particle didn't wrap around
            if (!wrapped) {
                p.stroke(100, 150, 255, 150);
                p.strokeWeight(1);
                p.line(particle.prevX, particle.prevY, particle.x, particle.y);
            }
        }
    };
    
    p.windowResized = () => {
        let container = document.getElementById('p5Canvas');
        let canvasWidth = container.offsetWidth;
        p.resizeCanvas(canvasWidth, 400);
        p.background(20);
    };
    
    // Expose reset function globally
    window.resetP5Particles = () => {
        initParticles();
    };
    
    // Expose fade alpha setter
    window.setP5FadeAlpha = (value) => {
        fadeAlpha = parseFloat(value);
    };
    
    // Initialize slider on page load
    window.addEventListener('load', () => {
        const slider = document.getElementById('fadeSlider');
        const display = document.getElementById('fadeValue');
        if (slider && display) {
            slider.value = fadeAlpha;
            display.textContent = fadeAlpha;
        }
    });
};

// Create p5 instance
new p5(p5Sketch);
