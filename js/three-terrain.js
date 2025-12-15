// three.js 3D Perlin Terrain Visualization
// Uses Perlin noise to generate a dynamic 3D terrain mesh

// Wrap in IIFE to avoid global scope pollution
(function() {
    
// Improved multi-octave noise function for more natural terrain
function noise2D(x, y) {
    // Combine multiple frequencies and rotations for non-directional terrain
    const octave1 = Math.sin(x * 1.3 + y * 0.7) + Math.sin(x * 0.7 - y * 1.1);
    const octave2 = Math.sin(x * 2.7 - y * 1.9) + Math.sin(x * 1.9 + y * 2.3);
    const octave3 = Math.sin(x * 0.5 + y * 1.7) + Math.sin(x * 1.8 - y * 0.6);
    
    // Mix octaves with decreasing weights
    return (octave1 * 0.5 + octave2 * 0.3 + octave3 * 0.2) / 3;
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

// Add color attribute for topographical view
const colors = new Float32Array(geometry.attributes.position.count * 3);
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material with wireframe option
const material = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    wireframe: false,
    flatShading: true,
    side: THREE.DoubleSide,
    vertexColors: false // Will toggle this on/off
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

// Contour lines container
let contourLines = null;
let showContours = false;

// Simple mouse camera controls
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cameraRotationX = 0;
let cameraRotationY = 0;
let cameraDistance = 30; // Changed from const to let for zoom control

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

// Mouse wheel zoom control
renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent page scroll
    
    // Normalize wheel delta for cross-browser compatibility
    const delta = e.deltaY * 0.05;
    
    // Adjust camera distance (30 = min/current, 60 = max zoom out)
    cameraDistance = Math.max(30, Math.min(60, cameraDistance + delta));
});

// Animation variables
let time = 0;
let noiseScale = 0.05; // Controls detail level (lower = smoother)
let heightScale = 5; // Controls peak/valley height
let animationSpeed = 0.005; // Speed of terrain morphing
let isPaused = false;
let isTopoMode = false;

// Function to generate contour lines at specific elevation intervals
function generateContourLines() {
    // Clear existing contour lines
    if (contourLines) {
        scene.remove(contourLines);
        contourLines.geometry.dispose();
        contourLines.material.dispose();
        contourLines = null;
    }
    
    if (!showContours) return;
    
    const positions = terrain.geometry.attributes.position;
    const lineVertices = [];
    
    // Find min/max heights
    let minHeight = Infinity;
    let maxHeight = -Infinity;
    for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        minHeight = Math.min(minHeight, y);
        maxHeight = Math.max(maxHeight, y);
    }
    
    // Generate contour lines at intervals
    const numContours = 8;
    const interval = (maxHeight - minHeight) / numContours;
    
    for (let c = 1; c < numContours; c++) {
        const targetHeight = minHeight + interval * c;
        
        // Check each quad in the terrain grid
        for (let row = 0; row < gridSize - 1; row++) {
            for (let col = 0; col < gridSize - 1; col++) {
                const i0 = row * gridSize + col;
                const i1 = row * gridSize + (col + 1);
                const i2 = (row + 1) * gridSize + (col + 1);
                const i3 = (row + 1) * gridSize + col;
                
                // Get quad heights
                const h0 = positions.getY(i0);
                const h1 = positions.getY(i1);
                const h2 = positions.getY(i2);
                const h3 = positions.getY(i3);
                
                // Check edges for intersections with target height
                const edges = [
                    {a: i0, b: i1, ha: h0, hb: h1},
                    {a: i1, b: i2, ha: h1, hb: h2},
                    {a: i2, b: i3, ha: h2, hb: h3},
                    {a: i3, b: i0, ha: h3, hb: h0}
                ];
                
                const intersections = [];
                for (const edge of edges) {
                    if ((edge.ha <= targetHeight && edge.hb >= targetHeight) ||
                        (edge.ha >= targetHeight && edge.hb <= targetHeight)) {
                        // Interpolate position along edge
                        const t = (targetHeight - edge.ha) / (edge.hb - edge.ha);
                        const x = positions.getX(edge.a) * (1 - t) + positions.getX(edge.b) * t;
                        const z = positions.getZ(edge.a) * (1 - t) + positions.getZ(edge.b) * t;
                        intersections.push(new THREE.Vector3(x, targetHeight, z));
                    }
                }
                
                // Draw line segments between intersection pairs
                if (intersections.length >= 2) {
                    lineVertices.push(intersections[0], intersections[1]);
                }
            }
        }
    }
    
    // Create line geometry
    if (lineVertices.length > 0) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(lineVertices);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2,
            transparent: true,
            opacity: 0.9
        });
        contourLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(contourLines);
    }
}

// Helper function to convert height to color (blue -> green -> yellow -> red)
function heightToColor(height, minHeight, maxHeight) {
    const normalized = (height - minHeight) / (maxHeight - minHeight);
    const color = new THREE.Color();
    
    if (normalized < 0.25) {
        // Blue to cyan (water to shallow)
        color.lerpColors(
            new THREE.Color(0x0066cc),
            new THREE.Color(0x00cccc),
            normalized * 4
        );
    } else if (normalized < 0.5) {
        // Cyan to green (shallow to land)
        color.lerpColors(
            new THREE.Color(0x00cccc),
            new THREE.Color(0x00cc00),
            (normalized - 0.25) * 4
        );
    } else if (normalized < 0.75) {
        // Green to yellow (land to hills)
        color.lerpColors(
            new THREE.Color(0x00cc00),
            new THREE.Color(0xcccc00),
            (normalized - 0.5) * 4
        );
    } else {
        // Yellow to red (hills to peaks)
        color.lerpColors(
            new THREE.Color(0xcccc00),
            new THREE.Color(0xcc0000),
            (normalized - 0.75) * 4
        );
    }
    
    return color;
}

// Control functions
window.setThreeHeight = function(value) {
    heightScale = parseFloat(value);
    document.getElementById('heightValue').textContent = value;
};

window.setThreeSmoothness = function(value) {
    noiseScale = parseFloat(value);
    document.getElementById('smoothnessValue').textContent = value;
};

window.setThreeSpeed = function(value) {
    animationSpeed = parseFloat(value);
    document.getElementById('speedValue').textContent = value;
};

// Pause toggle function
window.toggleThreePause = function() {
    isPaused = !isPaused;
    const btn = document.getElementById('pauseThreeBtn');
    btn.textContent = isPaused ? 'Resume Animation' : 'Pause Animation';
    
    // Hide contours when resuming animation
    if (!isPaused && showContours) {
        showContours = false;
        generateContourLines();
        material.opacity = 1.0;
        material.transparent = false;
        material.needsUpdate = true;
    }
};

// Topographical toggle function
window.toggleThreeTopo = function() {
    isTopoMode = !isTopoMode;
    material.vertexColors = isTopoMode;
    material.needsUpdate = true;
};

// Contour lines toggle function
window.toggleThreeContours = function() {
    // Auto-pause animation if not already paused
    if (!isPaused) {
        isPaused = true;
        const pauseBtn = document.getElementById('pauseThreeBtn');
        pauseBtn.textContent = 'Resume Animation';
    }
    
    showContours = !showContours;
    
    // Make terrain more transparent when contours are shown
    if (showContours) {
        material.opacity = 0.4;
        material.transparent = true;
    } else {
        material.opacity = 1.0;
        material.transparent = false;
    }
    material.needsUpdate = true;
    
    generateContourLines();
};

// Wireframe toggle function
window.toggleThreeWireframe = function() {
    wireframe.visible = !wireframe.visible;
};

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Only update terrain animation if not paused
    if (!isPaused) {
        time += animationSpeed;
        
        // Update terrain vertices based on Perlin noise
        const positions = terrain.geometry.attributes.position;
        const colors = terrain.geometry.attributes.color;
        
        // Find min/max heights for color normalization
        let minHeight = Infinity;
        let maxHeight = -Infinity;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Calculate height using noise function
            const height = noise2D(x * noiseScale, z * noiseScale + time) * heightScale;
            positions.setY(i, height);
            
            minHeight = Math.min(minHeight, height);
            maxHeight = Math.max(maxHeight, height);
        }
        
        // Update vertex colors if in topographical mode
        if (isTopoMode) {
            for (let i = 0; i < positions.count; i++) {
                const height = positions.getY(i);
                const color = heightToColor(height, minHeight, maxHeight);
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            colors.needsUpdate = true;
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
