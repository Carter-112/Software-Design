// Fire/Lava Mouse Trail with Dust and Smoke
// This script creates a canvas-based particle system that follows the mouse cursor

class FireMouseTrail {
  constructor() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none'; // Allow clicking through canvas
    this.canvas.style.zIndex = '999999'; // Ensure it's on top of other elements
    this.canvas.className = 'mouse-trail-canvas'; // Add class for easy identification
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Mouse position
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      speed: 0,
      lastMoved: Date.now()
    };
    
    // Particles arrays
    this.fireParticles = [];
    this.smokeParticles = [];
    this.dustParticles = [];
    
    // Configuration
    this.config = {
      maxFireParticles: 100,
      maxSmokeParticles: 30,
      maxDustParticles: 20,
      idleEmissionRate: 800, // Emit particles every 800ms when idle
      lastIdleEmission: 0,
      fireColors: [
        '#FF5722', // Fire orange
        '#FF9800', // Orange
        '#FFEB3B', // Yellow
        '#E91E63', // Pink
        '#F44336'  // Red
      ],
      lavaColors: [
        '#BF360C', // Deep orange
        '#E64A19', // Dark orange
        '#FF5722', // Bright orange
        '#FF9800', // Orange
        '#4E342E'  // Brown
      ],
      smokeColors: [
        'rgba(50, 50, 50, 0.4)',
        'rgba(50, 50, 50, 0.3)',
        'rgba(80, 80, 80, 0.3)',
        'rgba(60, 60, 60, 0.3)'
      ],
      dustColors: [
        'rgba(255, 222, 120, 0.4)',
        'rgba(255, 180, 120, 0.3)',
        'rgba(255, 140, 80, 0.2)',
        'rgba(255, 210, 160, 0.3)'
      ]
    };
    
    this.sizeFactor = 1.0;
    
    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
    
    // Initialize events
    this.setupEventListeners();
    
    // Start animation loop
    this.lastTime = 0;
    this.animate();
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
    
    // Add touch events
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }, { passive: true });
    
    window.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }, { passive: true });
  }
  
  handleMouseMove(e) {
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    // Calculate speed for particle emission rate
    const dx = this.mouse.x - this.mouse.prevX;
    const dy = this.mouse.y - this.mouse.prevY;
    this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
    this.mouse.lastMoved = Date.now();
    
    let particlesToEmit = Math.min(5, Math.floor(this.mouse.speed / 4)) + 1;
    
    for (let i = 0; i < particlesToEmit; i++) {
      this.addFireParticle();
      
      // Add smoke and dust occasionally
      if (Math.random() < 0.15) this.addSmokeParticle();
      if (Math.random() < 0.1) this.addDustParticle();
    }
  }
  
  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  addFireParticle(isIdle = false) {
    if (this.fireParticles.length >= this.config.maxFireParticles) return;
    
    // Create an offset from the mouse position for variation
    const offsetX = Math.random() * 5 - 2.5;
    const offsetY = Math.random() * 5 - 2.5;
    
    // Determine if this is fire or lava particle
    const isLava = Math.random() < 0.4; // Increased lava probability
    const colorArray = isLava ? this.config.lavaColors : this.config.fireColors;
    
    // Particles from idle emission have shorter lifespan
    const lifeMultiplier = isIdle ? 0.7 : 1.0;
    
    this.fireParticles.push({
      x: this.mouse.x + offsetX,
      y: this.mouse.y + offsetY,
      size: (Math.random() * 7 + 3) * this.sizeFactor,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * -3 - 1,
      color: colorArray[Math.floor(Math.random() * colorArray.length)],
      life: 1.0 * lifeMultiplier,
      decay: Math.random() * 0.02 + 0.01,
      isLava: isLava,
      opacity: 1.0
    });
  }
  
  addSmokeParticle(isIdle = false) {
    if (this.smokeParticles.length >= this.config.maxSmokeParticles) return;
    
    // Spawn smoke slightly above the mouse position
    const offsetX = Math.random() * 10 - 5;
    const offsetY = Math.random() * -10 - 5;
    
    // Particles from idle emission have shorter lifespan
    const lifeMultiplier = isIdle ? 0.6 : 1.0;
    
    this.smokeParticles.push({
      x: this.mouse.x + offsetX,
      y: this.mouse.y + offsetY,
      size: (Math.random() * 15 + 10) * this.sizeFactor,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * -1.5 - 0.5,
      color: this.config.smokeColors[Math.floor(Math.random() * this.config.smokeColors.length)],
      life: 1.0 * lifeMultiplier,
      decay: Math.random() * 0.01 + 0.004,
      opacity: 0.8
    });
  }
  
  addDustParticle(isIdle = false) {
    if (this.dustParticles.length >= this.config.maxDustParticles) return;
    
    // Dust particles emerge from sides of the trail
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 5 + 2;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    // Particles from idle emission have shorter lifespan
    const lifeMultiplier = isIdle ? 0.5 : 1.0;
    
    this.dustParticles.push({
      x: this.mouse.x + offsetX,
      y: this.mouse.y + offsetY,
      size: (Math.random() * 4 + 1) * this.sizeFactor,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 0.5,
      color: this.config.dustColors[Math.floor(Math.random() * this.config.dustColors.length)],
      life: 1.0 * lifeMultiplier,
      decay: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.1 - 0.05,
      opacity: 0.9
    });
  }
  
  animate(timestamp) {
    // Calculate delta time for smooth animation
    if (!timestamp) timestamp = 0;
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    // Emit particles even when idle
    const now = Date.now();
    if (now - this.mouse.lastMoved > 200 && now - this.config.lastIdleEmission > this.config.idleEmissionRate) {
      this.config.lastIdleEmission = now;
      
      // Add multiple fire particles when idle
      const idleCount = 2; 
      
      // Add multiple fire particles when idle
      for (let i = 0; i < idleCount; i++) {
        if (Math.random() < 0.8) this.addFireParticle(true);
      }
      
      // Add smoke and dust
      if (Math.random() < 0.5) this.addSmokeParticle(true);
      if (Math.random() < 0.3) this.addDustParticle(true);
    }
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw fire particles
    this.updateFireParticles(deltaTime);
    this.updateSmokeParticles(deltaTime);
    this.updateDustParticles(deltaTime);
    
    // Request next frame
    requestAnimationFrame(this.animate);
  }
  
  updateFireParticles(deltaTime) {
    for (let i = this.fireParticles.length - 1; i >= 0; i--) {
      const p = this.fireParticles[i];
      
      // Update position - gradually slow down vertical speed for lava effect
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY *= 0.99; // Gradually slow down to simulate lava viscosity
      
      // Update life
      p.life -= p.decay;
      
      // Gradually reduce opacity as life approaches end for smoother fade out
      p.opacity = p.life > 0.8 ? 1.0 : p.life * 1.25;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.fireParticles.splice(i, 1);
        continue;
      }
      
      // Draw fire particle
      this.ctx.globalAlpha = p.opacity;
      
      // Different rendering for lava particles
      if (p.isLava) {
        // Draw lava as a more natural blobby shape
        this.ctx.beginPath();
        
        // Base circle
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        
        // Add subtle glow for more realistic effect
        const glow = this.ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 1.3
        );
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'rgba(255, 100, 20, 0)');
        
        this.ctx.globalAlpha = p.opacity * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 1.3, 0, Math.PI * 2);
        this.ctx.fillStyle = glow;
        this.ctx.fill();
      } else {
        // Fire particle as irregular shape for more natural flame
        this.ctx.beginPath();
        
        // More natural flame shape with curves
        const height = p.size * 1.8;
        const halfWidth = p.size * 0.6;
        
        // Calculate control points for a curved flame shape
        const cp1x = p.x - halfWidth * 1.5;
        const cp1y = p.y - height * 0.3;
        const cp2x = p.x + halfWidth * 1.5;
        const cp2y = p.y - height * 0.3;
        
        this.ctx.moveTo(p.x, p.y - height);
        this.ctx.quadraticCurveTo(cp1x, cp1y, p.x - halfWidth, p.y);
        this.ctx.quadraticCurveTo(p.x, p.y + height * 0.2, p.x + halfWidth, p.y);
        this.ctx.quadraticCurveTo(cp2x, cp2y, p.x, p.y - height);
        
        // Create gradient for more realistic flame
        const gradient = this.ctx.createLinearGradient(
          p.x, p.y - height,
          p.x, p.y
        );
        gradient.addColorStop(0, '#FFEB3B'); // Bright yellow at top
        gradient.addColorStop(0.6, p.color); // Main color in middle
        gradient.addColorStop(1, '#BF360C'); // Dark orange/red at base
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
      
      this.ctx.globalAlpha = 1.0;
    }
  }
  
  updateSmokeParticles(deltaTime) {
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Slow down as they rise, but not too much - more natural smoke behavior
      p.speedY *= 0.995;
      
      // Update life
      p.life -= p.decay;
      
      // Gradually reduce opacity as life approaches end
      p.opacity = p.life > 0.7 ? 0.7 : p.life;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.smokeParticles.splice(i, 1);
        continue;
      }
      
      // Draw smoke particle - more natural looking smoke
      this.ctx.globalAlpha = p.opacity * 0.6;
      
      // Gradient for more realistic smoke
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      this.ctx.globalAlpha = 1.0;
    }
  }
  
  updateDustParticles(deltaTime) {
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Spin the particle
      p.angle += p.rotationSpeed;
      
      // Slow down gradually for more natural movement
      p.speedX *= 0.98;
      p.speedY *= 0.98;
      
      // Update life
      p.life -= p.decay;
      
      // Gradually reduce opacity as life approaches end
      p.opacity = p.life > 0.6 ? 0.7 : p.life * 1.2;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.dustParticles.splice(i, 1);
        continue;
      }
      
      // Draw dust particle
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity * 0.6;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      
      // Draw as small irregular shapes for more natural ember effect
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      
      this.ctx.restore();
      this.ctx.globalAlpha = 1.0;
    }
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.fireMouseTrail = new FireMouseTrail();
}); 