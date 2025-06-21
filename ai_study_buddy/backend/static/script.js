async function askAI() {
  const question = document.getElementById("question").value;
  const answerBox = document.getElementById("answer");
  const typing = document.getElementById("typing-indicator");

  if (!question) return;

  typing.classList.remove("hidden");
  answerBox.textContent = "";

  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, user_id: 1 })
  });

  const data = await response.json();

  typing.classList.add("hidden");

  if (data.answer) {
    answerBox.textContent = data.answer;
  } else {
    answerBox.textContent = "Error: " + data.error;
  }

  document.getElementById("question").value = "";
}

// Particle animation background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const dots = Array(80).fill().map(() => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 2 + 1,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5
}));

function animate() {
  ctx.clearRect(0, 0, w, h);
  for (let dot of dots) {
    dot.x += dot.dx;
    dot.y += dot.dy;

    if (dot.x < 0 || dot.x > w) dot.dx *= -1;
    if (dot.y < 0 || dot.y > h) dot.dy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(144,202,249,0.5)";
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();
