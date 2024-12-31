const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Particle class for ink simulation
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.color = color;
        this.size = Math.random() * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.life *= 0.99;
        this.vy += 0.1;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(${this.color.join(',')},${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 2, Math.PI * 2);
        ctx.fill();
    }
}

// Store particles and mouse position
const particles = [];
let mouseX = 0;
let mouseY = 0;
let lastX = 0;
let lastY = 0;

// Track mouse movement
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create particles along the mouse path
    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(distance / 5));

    const x = lastX + (dx / steps);
    const y = lastY + (dy / steps);    
    createInkBurst(x, y);

    lastX = mouseX;
    lastY = mouseY;
});

// Create burst of ink particles
function createInkBurst(x, y) {
    const color = [
        Math.random() * 100 + 55, // R
        Math.random() * 100 + 55, // G
        255, // B
    ];
    
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, 5, -5, color));
    }
}

// Animation loop
function animate() {
    if (!isRunning) {
        return;
    }

    // Apply semi-transparent black to create trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw(ctx);
        
        // Remove dead particles
        if (particle.life < 0.01) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

let isRunning = true;

function startSim() {
    isRunning = true;
    animate();
}

function stopSim() {
    isRunning = false;
}

startSim();