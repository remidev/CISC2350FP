// Vanilla JavaScript Particle Wave Animation
// Simple noise simulation using Canvas API

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const particleCount = 200;
const particles = [];
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

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// --- Simple Perlin-like noise ----
function noise(x) {
    return (Math.sin(x * 1.3) + Math.sin(x * 0.7) + Math.sin(x * 3.1)) / 3;
}

// ----- Create particles -----
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        radius: rand(2, 4),
        offset: rand(0, 9999)
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    time += 0.01;

    for (let p of particles) {
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

        // wrap-around
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

animate();
