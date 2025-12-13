// Vanilla JavaScript Particle Wave Animation
// Simple noise simulation using Canvas API

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const particleCount = 200;
const particles = [];
let time = 0;

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
