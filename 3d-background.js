// خلفية ثلاثية الأبعاد متطورة مع جسيمات نارية
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.FogExp2(0x050505, 0.0008);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// جسيمات نارية متحركة
const particleCount = 2500;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 200;
    positions[i*3+1] = (Math.random() - 0.5) * 100;
    positions[i*3+2] = (Math.random() - 0.5) * 80 - 40;
    
    // ألوان بين الأحمر والبرتقالي
    colors[i*3] = 1;
    colors[i*3+1] = Math.random() * 0.3;
    colors[i*3+2] = Math.random() * 0.2;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// كرة شبكية حمراء دوارة (لإضافة بعد احترافي)
const wireframeGeometry = new THREE.IcosahedronGeometry(8, 0);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xff1a1a, wireframe: true, transparent: true, opacity: 0.12 });
const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
scene.add(wireframeSphere);

// حلقات دوارة
const ringGeometry = new THREE.TorusGeometry(12, 0.08, 64, 1000);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xff1a1a, emissive: 0x330000 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(ring);

const ring2Geometry = new THREE.TorusGeometry(16, 0.05, 64, 1000);
const ring2 = new THREE.Mesh(ring2Geometry, ringMaterial);
scene.add(ring2);

// إضاءة متحركة
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff1a1a, 1, 50);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xff4444, 0.5);
pointLight2.position.set(-10, -5, 10);
scene.add(pointLight2);

// متغيرات للحركة
let time = 0;

// دالة التحريك
function animate() {
    requestAnimationFrame(animate);
    time += 0.002;
    
    // تحريك الجسيمات
    particlesMesh.rotation.y = time * 0.1;
    particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
    
    // تدوير الكرة الشبكية
    wireframeSphere.rotation.x = time * 0.2;
    wireframeSphere.rotation.y = time * 0.3;
    
    // تدوير الحلقات
    ring.rotation.x = Math.sin(time * 0.5) * 0.3;
    ring.rotation.z = Math.cos(time * 0.3) * 0.2;
    ring.rotation.y = time * 0.2;
    
    ring2.rotation.x = Math.cos(time * 0.4) * 0.2;
    ring2.rotation.z = Math.sin(time * 0.6) * 0.3;
    ring2.rotation.y = -time * 0.15;
    
    // تحريك الإضاءة
    pointLight.position.x = Math.sin(time) * 12;
    pointLight.position.z = Math.cos(time * 0.7) * 12;
    
    // تدوير الكاميرا بشكل بسيط
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.y = Math.cos(time * 0.15) * 1.5;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// تكييف الحجم مع تغيير نافذة المتصفح
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
