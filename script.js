const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const player = {
  x: 100,
  y: 300,
  w: 30,
  h: 50,
  vx: 0,
  vy: 0,
  onGround: false
};

const gravity = 0.6;
const friction = 0.8;
const speed = 3;
const jumpForce = -12;

const platforms = [
  { x: 0, y: 400, w: 800, h: 50 },
  { x: 300, y: 320, w: 100, h: 20 },
  { x: 500, y: 260, w: 120, h: 20 }
];

function update() {
  // Movimento horizontal
  if (keys["ArrowLeft"] || keys["a"]) player.vx = -speed;
  else if (keys["ArrowRight"] || keys["d"]) player.vx = speed;
  else player.vx *= friction;

  // Pular
  if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
    player.vy = jumpForce;
    player.onGround = false;
  }

  // Aplicar gravidade
  player.vy += gravity;

  // Atualizar posição
  player.x += player.vx;
  player.y += player.vy;

  // Checar colisões
  player.onGround = false;
  for (let p of platforms) {
    if (player.x < p.x + p.w &&
        player.x + player.w > p.x &&
        player.y < p.y + p.h &&
        player.y + player.h > p.y) {
      // Está colidindo por baixo?
      if (player.vy > 0 && player.y + player.h - player.vy <= p.y) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  // Limites do mundo (scroll simples)
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > 1600) player.x = 1600 - player.w;

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Câmera segue o jogador
  const camX = Math.min(Math.max(player.x - canvas.width / 2, 0), 800);

  // Desenha plataformas
  ctx.fillStyle = "#555";
  for (let p of platforms) {
    ctx.fillRect(p.x - camX, p.y, p.w, p.h);
  }

  // Jogador
  ctx.fillStyle = "#00ff99";
  ctx.fillRect(player.x - camX, player.y, player.w, player.h);
}

update();
