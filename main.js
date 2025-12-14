const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleArray = [];
const snowParticles = []; // Массив для снега
let hue = 0;

const mous = { x: undefined, y: undefined };

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.addEventListener("mousemove", (even) => {
  mous.x = even.x;
  mous.y = even.y;
  for (let i = 0; i < 3; i++) {
    particleArray.push(new Particle());
  }
});

// Класс твоих цветных частиц
class Particle {
  constructor() {
    this.x = mous.x;
    this.y = mous.y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = "hsl(" + hue + ", 100%, 50%)";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Класс снежинок
class Snowflake {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Инициализация снега
for (let i = 0; i < 100; i++) {
  snowParticles.push(new Snowflake());
}

function handleParticles() {
  // Отрисовка снега (на заднем плане)
  snowParticles.forEach((snow) => {
    snow.update();
    snow.draw();
  });

  // Отрисовка твоих интерактивных частиц
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();

    for (let j = i; j < particleArray.length; j++) {
      const dx = particleArray[i].x - particleArray[j].x;
      const dy = particleArray[i].y - particleArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particleArray[i].color;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particleArray[i].x, particleArray[i].y);
        ctx.lineTo(particleArray[j].x, particleArray[j].y);
        ctx.stroke();
      }
    }

    if (particleArray[i].size <= 0.3) {
      particleArray.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Небольшой шлейф
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 1;
  requestAnimationFrame(animate);
}

// Дата
const options = { year: "numeric", month: "long", day: "numeric" };
document.getElementById("current-date").innerText =
  new Date().toLocaleDateString("ru-RU", options);

animate();
