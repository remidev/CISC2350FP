// Vanilla JavaScript Particle Wave Animation
// Simple noise simulation using Canvas API

console.log('vanilla-particles.js v1.1 - touch support added');

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const baselineCount = 200;
const maxCount = 350;
const particles = [];
const effectParticles = []; // For deletion effects
let time = 0;

// Mouse tracking
let mouse = {
    x: null,
    y: null,
    radius: 100 // repulsion radius
};

// Track mouse position
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// Clear mouse position when leaving canvas
canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch event handlers for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
});

canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

canvas.addEventListener('touchcancel', () => {
    mouse.x = null;
    mouse.y = null;
});

// Click to add particle burst
canvas.addEventListener('click', (e) => {
    if (particles.length >= maxCount) return; // At cap, don't add more
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const burstSize = Math.floor(rand(10, 21)); // 10-20 particles
    const actualBurst = Math.min(burstSize, maxCount - particles.length);
    
    for (let i = 0; i < actualBurst; i++) {
        particles.push({
            x: clickX + rand(-10, 10), // Small spread around click
            y: clickY + rand(-10, 10),
            radius: rand(2, 4),
            offset: rand(0, 9999)
        });
    }
});

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// --- Simple Perlin-like noise ----
function noise(x) {
    return (Math.sin(x * 1.3) + Math.sin(x * 0.7) + Math.sin(x * 3.1)) / 3;
}

// ----- Create particles -----
for (let i = 0; i < baselineCount; i++) {
    particles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        radius: rand(2, 4),
        offset: rand(0, 9999)
    });
}

function createDeletionEffect(x, y) {
    for (let i = 0; i < 4; i++) {
        effectParticles.push({
            x: x,
            y: y,
            vx: rand(-2, 2),
            vy: rand(-2, 2),
            lifetime: 60,
            maxLifetime: 60,
            radius: 1.5
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    time += 0.01;

    // Handle particle cap - remove oldest if at max
    while (particles.length > maxCount) {
        const removed = particles.shift(); // Remove oldest
        createDeletionEffect(removed.x, removed.y);
    }

    // Update and draw main particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        let n = noise(p.offset + time);

        p.y += n * 0.8;    // vertical wave
        p.x += Math.sin(n * 2) * 0.4; // small horizontal drift

        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Calculate repulsion force (stronger when closer)
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                p.x += Math.cos(angle) * force * 5;
                p.y += Math.sin(angle) * force * 5;
            }
        }

        // Check if particle is out of bounds (with margin inside canvas)
        const margin = 20; // Delete/wrap 20px inside the edge
        const outOfBounds = p.y > canvas.height - margin || p.y < margin || 
                           p.x > canvas.width - margin || p.x < margin;
        
        if (outOfBounds && particles.length > baselineCount) {
            // Over baseline - delete instead of wrap with effect
            createDeletionEffect(p.x, p.y);
            particles.splice(i, 1);
            continue;
        } else if (outOfBounds) {
            // At or below baseline - wrap around
            if (p.y > canvas.height - margin) p.y = margin;
            if (p.y < margin) p.y = canvas.height - margin;
            if (p.x > canvas.width - margin) p.x = margin;
            if (p.x < margin) p.x = canvas.width - margin;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Update and draw effect particles
    for (let i = effectParticles.length - 1; i >= 0; i--) {
        let e = effectParticles[i];
        e.x += e.vx;
        e.y += e.vy;
        e.lifetime--;
        
        // Fade opacity based on remaining lifetime
        let alpha = e.lifetime / e.maxLifetime;
        ctx.fillStyle = `rgba(255, 80, 80, ${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        
        if (e.lifetime <= 0) {
            effectParticles.splice(i, 1);
        }
    }

    // Reset fill style for main particles
    ctx.fillStyle = "white";

    requestAnimationFrame(animate);
}

animate();
