// p5.js Flow Field Visualization
// Perlin noise flow field with particle trails

// p5.js sketch using instance mode to avoid conflicts
const p5Sketch = (p) => {
    let noiseScale = 0.01;
    let particles = [];
    
    p.setup = () => {
        // Match the container width like vanilla canvas does
        let container = document.getElementById('p5Canvas');
        let canvasWidth = container.offsetWidth;
        let canvas = p.createCanvas(canvasWidth, 400);
        canvas.parent('p5Canvas');
        p.background(20);
        
        // Create particles
        for (let i = 0; i < 300; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                prevX: 0,
                prevY: 0
            });
        }
    };
    
    p.draw = () => {
        // Fade effect for trails
        p.fill(20, 20, 20, 10);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
        
        // Draw and move particles
        for (let particle of particles) {
            particle.prevX = particle.x;
            particle.prevY = particle.y;
            
            // Get noise value
            let noiseVal = p.noise(particle.x * noiseScale, particle.y * noiseScale, p.frameCount * 0.01);
            let angle = noiseVal * p.TWO_PI * 2;
            
            // Move particle
            particle.x += p.cos(angle) * 2;
            particle.y += p.sin(angle) * 2;
            
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
};

// Create p5 instance
new p5(p5Sketch);
