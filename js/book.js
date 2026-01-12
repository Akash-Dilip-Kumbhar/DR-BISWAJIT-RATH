const container = document.getElementById('book-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

// --- FIX 1: HIGH DPI RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio); // This makes it sharp on Retina/4K screens
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

// --- FIX 2: TEXTURE FILTERING ---
// This function applies sharpness settings to your images once they load
const optimizeTexture = (texture) => {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Sharpness at angles
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
};

const frontCover = loader.load('./assets/Book/front-page.jpg', optimizeTexture);
const backCover = loader.load('./assets/Book/back-page.jpg', optimizeTexture);

const spineColor = new THREE.MeshPhongMaterial({ color: 0xffffff });
const blackSpine = new THREE.MeshPhongMaterial({ color: 0x000000 }); // Black for the left edge
const geometry = new THREE.BoxGeometry(3.5, 5, 0.5);
const materials = [
    spineColor, // Right
    blackSpine, // Left/Spine
    spineColor, // Top
    spineColor, // Bottom
    new THREE.MeshPhongMaterial({ map: frontCover, shininess: 50 }), // Front
    new THREE.MeshPhongMaterial({ map: backCover, shininess: 50 })   // Back
];

const book = new THREE.Mesh(geometry, materials);
scene.add(book);

// Lighting setup to highlight "Humanizing AI" themes [cite: 4, 53]
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Increased intensity
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 0.8);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 8; // Moved camera slightly closer for detail

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5; // Slightly slower for better readability

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});