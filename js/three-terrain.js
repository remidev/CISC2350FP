// three.js 3D Perlin Terrain Visualization
// Uses Perlin noise to generate a dynamic 3D terrain mesh

// Wrap in IIFE to avoid global scope pollution
(function() {
    
// Simple Perlin-like noise function (same as vanilla demo)
function noise2D(x, y) {
    return (Math.sin(x * 1.3 + y * 0.7) + Math.sin(x * 0.7 - y * 1.1) + Math.sin(x * 2.1 + y * 1.3)) / 3;
}

// Scene setup
const container = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / 400,
    0.1,
    1000
);
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.offsetWidth, 400);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Create terrain mesh
const gridSize = 30; // Reduced for cleaner wireframe
const spacing = 2; // Increased spacing for smoother look
const geometry = new THREE.PlaneGeometry(
    gridSize * spacing,
    gridSize * spacing,
    gridSize - 1,
    gridSize - 1
);

// Rotate to be horizontal
geometry.rotateX(-Math.PI / 2);

// Material with wireframe option
const material = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    wireframe: false,
    flatShading: true,
    side: THREE.DoubleSide
});

const terrain = new THREE.Mesh(geometry, material);
scene.add(terrain);

// Add wireframe overlay
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff, 
    linewidth: 1,
    opacity: 0.3,
    transparent: true
});
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
scene.add(wireframe);

// Simple mouse camera controls
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cameraRotationX = 0;
let cameraRotationY = 0;
const cameraDistance = 30;

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        
        cameraRotationY += deltaX * 0.005;
        cameraRotationX += deltaY * 0.005;
        
        // Limit vertical rotation
        cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationX));
        
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Animation variables
let time = 0;
const noiseScale = 0.05; // Reduced for smoother terrain
const heightScale = 4; // Slightly reduced height variation
let isPaused = false;

// Pause toggle function
window.toggleThreePause = function() {
    isPaused = !isPaused;
    const btn = document.getElementById('pauseThreeBtn');
    btn.textContent = isPaused ? 'Resume Animation' : 'Pause Animation';
};

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Only update terrain animation if not paused
    if (!isPaused) {
        time += 0.005; // Slower animation for smoother appearance
        
        // Update terrain vertices based on Perlin noise
        const positions = terrain.geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Calculate height using noise function
            const height = noise2D(x * noiseScale, z * noiseScale + time) * heightScale;
            positions.setY(i, height);
        }
        
        positions.needsUpdate = true;
        terrain.geometry.computeVertexNormals();
        
        // Update wireframe to match terrain
        wireframe.geometry.dispose();
        wireframe.geometry = new THREE.WireframeGeometry(terrain.geometry);
    }
    
    // Update camera position based on mouse rotation
    camera.position.x = Math.sin(cameraRotationY) * Math.cos(cameraRotationX) * cameraDistance;
    camera.position.y = Math.sin(cameraRotationX) * cameraDistance + 15;
    camera.position.z = Math.cos(cameraRotationY) * Math.cos(cameraRotationX) * cameraDistance;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = container.offsetWidth;
    camera.aspect = newWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, 400);
});

// Start animation
animate();

})(); // End IIFE
