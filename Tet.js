/**
 * File: Tet.js
 * Hiệu ứng: Pháo hoa, cánh hoa rơi cho Tiệc Tất Niên
 * Mục tiêu: Tạo trải nghiệm Tết theo mẫu thiết kế
 * Cải tiến: Animation mượt mà, hiệu ứng sinh động hơn
 */

// Khởi tạo sau khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  setupFireworks();
  setupPetals();
  setupEnhancedEffects();
});

/**
 * Pháo hoa bằng Canvas: hạt nổ, trọng lực, mờ dần
 * Cải tiến: Thêm trail, sparkle, particle đa dạng
 */
function setupFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Điều chỉnh kích thước khi thay đổi viewport
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Bảng màu Tết truyền thống mở rộng
  const palette = [
    "#FFD700", // gold
    "#DAA520", // gold-soft
    "#DC143C", // vivid-red
    "#8B0000", // deep-red
    "#FF6347", // tomato
    "#FFA500", // orange
    "#FF1493", // deep-pink
    "#00CED1", // dark-turquoise
    "#9370DB", // medium-purple
    "#32CD32", // lime-green
    "#FF69B4", // hot-pink
    "#1E90FF", // dodger-blue
    "#FFB6C1", // light-pink
    "#F0E68C", // khaki
    "#DDA0DD", // plum
  ];

  // Danh sách hạt pháo hoa
  const particles = [];
  const gravity = 0.08;
  const drag = 0.98;

  // Tạo vụ nổ tại (x, y) với hiệu ứng cải tiến
  function burst(x, y, count = 100, power = 6) {
    const color = palette[Math.floor(Math.random() * palette.length)];
    
    // Tạo nhiều lớp particle cho hiệu ứng sâu
    for (let layer = 0; layer < 3; layer++) {
      const layerCount = count * (1 - layer * 0.3);
      const layerPower = power * (1 - layer * 0.2);
      
      for (let i = 0; i < layerCount; i++) {
        const angle = (Math.PI * 2 * i) / layerCount + Math.random() * 0.3;
        const speed = layerPower + Math.random() * layerPower * 0.8;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 120 + Math.random() * 60,
          alpha: 1,
          color: layer === 0 ? color : adjustColor(color, layer * 20),
          sparkle: Math.random() < 0.5,
          size: (3 - layer) + Math.random() * 2,
          trail: [],
          maxTrailLength: 8 - layer * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }
    }
    
    // Thêm sparkles đặc biệt
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 80 + Math.random() * 40,
        alpha: 1,
        color: Math.random() > 0.5 ? "#FFFFFF" : "#FFD700",
        sparkle: true,
        size: Math.random() * 2 + 0.5,
        trail: [],
        maxTrailLength: 5,
        rotation: 0,
        rotationSpeed: 0,
        special: true,
      });
    }
  }

  // Điều chỉnh màu sáng/tối
  function adjustColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 255) + amount);
    const g = Math.min(255, ((num >> 8) & 255) + amount);
    const b = Math.min(255, (num & 255) + amount);
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  // Vẽ hạt với trail và rotation
  function drawParticle(p) {
    // Vẽ trail
    p.trail.forEach((point, index) => {
      ctx.save();
      ctx.globalAlpha = point.alpha * (index / p.trail.length) * 0.4;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, p.size * (index / p.trail.length), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Vẽ particle chính
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    
    // Thêm rotation cho particle đặc biệt
    if (p.rotation) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.translate(-p.x, -p.y);
    }
    
    // Shadow và glow
    ctx.shadowBlur = p.special ? 15 : 10;
    ctx.shadowColor = p.color;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Hiệu ứng lóe sáng (sparkle) cải tiến
    if (p.sparkle && Math.random() < 0.3) {
      ctx.globalAlpha = p.alpha * 0.9;
      ctx.fillStyle = p.special ? "#FFFFFF" : "#FFD700";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(p.x + (Math.random() - 0.5) * 8, p.y + (Math.random() - 0.5) * 8, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Vòng lặp animation mượt mà hơn
  function tick() {
    // Clear với hiệu ứng mờ dần
    ctx.fillStyle = "rgba(10, 14, 39, 0.08)";
    ctx.fillRect(0, 0, width, height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Cập nhật trail
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
      if (p.trail.length > p.maxTrailLength) {
        p.trail.shift();
      }
      
      // Physics
      p.vx *= drag;
      p.vy *= drag;
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.alpha = Math.max(0, p.life / 150);
      
      // Rotation
      if (p.rotationSpeed) {
        p.rotation += p.rotationSpeed;
      }
      
      drawParticle(p);
      
      // Remove particle chết
      if (p.life <= 0 || p.alpha <= 0 || p.y > height + 50) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(tick);
  }

  // Tạo pháo hoa ngẫu nhiên định kỳ với biến thể
  const autoTimer = setInterval(() => {
    const x = 100 + Math.random() * (width - 200);
    const y = 100 + Math.random() * (height * 0.4);
    const count = 80 + Math.floor(Math.random() * 80);
    const power = 5 + Math.random() * 4;
    burst(x, y, count, power);
  }, 1800);

  // Lưu tham chiếu vào element để dùng ở handler bên ngoài
  canvas._burst = burst;
  tick();
}

/**
 * Tạo cánh hoa rơi: sinh phần tử và gán animation CSS
 * Cải tiến: Animation đa dạng, hover effect, responsive
 */
function setupPetals() {
  const petalsContainer = document.querySelector(".petals");
  if (!petalsContainer) return;

  // Thiết lập animation cho mỗi cánh hoa
  const petals = petalsContainer.querySelectorAll("span");
  petals.forEach((petal, index) => {
    // Thiết lập thời gian rơi ngẫu nhiên
    const duration = 12 + Math.random() * 18;
    const delay = Math.random() * 5;
    
    petal.style.setProperty("--duration", `${duration}s`);
    petal.style.setProperty("--delay", `${delay}s`);
    
    // Thêm hiệu ứng xoay và scale ngẫu nhiên
    const rotation = Math.random() * 360;
    const scale = 0.7 + Math.random() * 0.6;
    const swayAmount = 15 + Math.random() * 25;
    
    petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    petal.style.setProperty("--sway-amount", `${swayAmount}px`);
    
    // Thêm hiệu ứng hover cho desktop
    petal.addEventListener('mouseenter', () => {
      petal.style.transform = `rotate(${rotation + 180}deg) scale(${scale * 1.3})`;
      petal.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      petal.style.filter = 'brightness(1.3) drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))';
    });
    
    petal.addEventListener('mouseleave', () => {
      petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      petal.style.filter = '';
    });
    
    // Touch effect cho mobile
    petal.addEventListener('touchstart', (e) => {
      e.preventDefault();
      petal.style.transform = `rotate(${rotation + 180}deg) scale(${scale * 1.3})`;
      petal.style.transition = 'transform 0.3s ease-out';
    });
    
    petal.addEventListener('touchend', () => {
      petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });
  });
}

/**
 * Thiết lập hiệu ứng nâng cao
 */
function setupEnhancedEffects() {
  // Click anywhere để bắn pháo hoa
  document.addEventListener('click', (e) => {
    if (e.target.closest('.petals') || e.target.closest('.frame')) return;
    
    const canvas = document.getElementById("fireworks");
    if (canvas && canvas._burst) {
      canvas._burst(e.clientX, e.clientY, 120, 7);
    }
  });
  
  // Touch support cho mobile
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.petals') || e.target.closest('.frame')) return;
    
    const canvas = document.getElementById("fireworks");
    if (canvas && canvas._burst) {
      const touch = e.touches[0];
      canvas._burst(touch.clientX, touch.clientY, 120, 7);
    }
  });
}

// Thêm hiệu ứng âm thanh mô phỏng (visual feedback)
function createVisualFeedback(x, y) {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, #ff5e00ff 0%, transparent 70%);
    pointer-events: none;
    z-index: 1000;
    animation: feedbackPulse 0.6s ease-out forwards;
  `;
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 600);
}

// Thêm CSS animation cho feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes feedbackPulse {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);
