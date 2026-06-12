// ============================================================
//  🌾 AgroVida — O Campo que Nos Alimenta
//  Projeto p5.js — Agricultura Sustentável
//  Tema: Produção, Sustentabilidade, Conexão Campo-Cidade
// ============================================================

// ---------- ESTADOS DO JOGO ----------
const STATE_INTRO    = 0;
const STATE_MENU     = 1;
const STATE_GAME     = 2;
const STATE_INFO     = 3;

let state = STATE_INTRO;

// ---------- VARIÁVEIS GLOBAIS ----------
let introAlpha = 0;
let introPhase = 0;   // 0=fade-in logo, 1=texto, 2=botão
let introTimer = 0;
let menuPulse  = 0;
let gameFont;

// Nuvens
let clouds = [];
// Pássaros
let birds  = [];
// Partículas de sol
let sunParticles = [];
// Plantas do jogador
let plants = [];
// Personagens NPC
let npcs   = [];
// Chuva
let rainDrops = [];
let isRaining = false;
let rainTimer = 0;
// Borboletas
let butterflies = [];
// Score / recursos
let water    = 100;
let nutrient = 100;
let harvest  = 0;
let day      = 1;
let dayTimer = 0;
let season   = 0; // 0=Primavera 1=Verão 2=Outono 3=Inverno
const seasonNames  = ['🌸 Primavera','☀️ Verão','🍂 Outono','❄️ Inverno'];
const seasonColors = [
  [120,200,80],   // primavera
  [255,210,60],   // verão
  [200,120,40],   // outono
  [180,220,255],  // inverno
];

// Agricultor (jogador)
let farmer = { x:400, y:450, dir:1, moving:false, frame:0, frameTimer:0 };
let keys   = {};

// Tooltip
let tooltip = { text:'', x:0, y:0, alpha:0 };

// Info card
let infoCard = 0;
const infoCards = [
  { title:'🌱 Agricultura Sustentável',
    body:'A agricultura sustentável busca produzir alimentos\nrespeitando o meio ambiente, usando técnicas que\npreservam o solo, a água e a biodiversidade.\n\n🌍 Garante alimento para as gerações futuras!' },
  { title:'💧 Uso Consciente da Água',
    body:'A irrigação inteligente economiza até 50% de água.\nSistemas de gotejamento e reaproveitamento de chuva\nsão práticas essenciais no campo moderno.\n\n💦 Cada gota importa para o futuro!' },
  { title:'🚜 Conexão Campo e Cidade',
    body:'O agronegócio representa mais de 25% do PIB\nbrasileiro. Do campo à mesa, cada produto percorre\numa cadeia que conecta milhões de pessoas.\n\n🏙️🌾 Sem o campo, a cidade não come!' },
  { title:'♻️ Produção Circular',
    body:'Compostagem, rotação de culturas e energia solar\nsão pilares da produção circular no agro.\nResíduos viram recursos, fechando o ciclo.\n\n🔄 A natureza não produz lixo!' },
  { title:'🌻 Biodiversidade no Campo',
    body:'Manter áreas de vegetação nativa, polinizadores\ne diversidade de culturas fortalece o ecossistema\ne aumenta a resiliência da produção agrícola.\n\n🐝 As abelhas alimentam o mundo!' },
];

// Botões do menu
let menuButtons = [];
// Botões do jogo
let gameButtons = [];

// Efeitos visuais de colheita
let harvestEffects = [];

// ============================================================
//  SETUP
// ============================================================
function setup() {
  createCanvas(800, 560);
  textFont('monospace');
  initClouds();
  initBirds();
  initSunParticles();
  initNPCs();
  initButterflies();
  initMenuButtons();
  initGameButtons();
  initPlants();
  initRain();
}

// ============================================================
//  DRAW — roteador de estados
// ============================================================
function draw() {
  switch(state) {
    case STATE_INTRO: drawIntro(); break;
    case STATE_MENU:  drawMenu();  break;
    case STATE_GAME:  drawGame();  break;
    case STATE_INFO:  drawInfo();  break;
  }
}

// ============================================================
//  ░░░  TELA DE INTRODUÇÃO  ░░░
// ============================================================
function drawIntro() {
  introTimer++;

  // Fundo gradiente noturno → amanhecer
  let t = constrain(introTimer / 180, 0, 1);
  let r = lerp(10,  135, t);
  let g = lerp(15,  195, t);
  let b = lerp(40,   80, t);
  background(r, g, b);

  // Estrelas (fase inicial)
  if (t < 0.6) {
    drawStars(1 - t / 0.6);
  }

  // Sol nascendo
  drawSunrise(t);

  // Silhueta do campo
  drawFieldSilhouette(t);

  // Logo principal
  if (introTimer > 40) {
    introAlpha = min(introAlpha + 4, 255);
    push();
    textAlign(CENTER, CENTER);

    // Sombra
    fill(0, 0, 0, introAlpha * 0.5);
    textSize(52);
    text('🌾 AgroVida 🌾', width/2 + 3, height/2 - 78);

    // Título
    fill(255, 240, 100, introAlpha);
    textSize(52);
    text('🌾 AgroVida 🌾', width/2, height/2 - 80);

    // Subtítulo
    if (introTimer > 90) {
      let a2 = constrain((introTimer - 90) * 5, 0, 255);
      fill(200, 255, 180, a2);
      textSize(18);
      text('O Campo que Nos Alimenta', width/2, height/2 - 30);
    }

    // Tagline
    if (introTimer > 130) {
      let a3 = constrain((introTimer - 130) * 4, 0, 255);
      fill(255, 255, 255, a3);
      textSize(13);
      text('🌱 Sustentabilidade · Produção · Conexão · Vida', width/2, height/2 + 5);
    }

    // Emojis animados
    if (introTimer > 100) {
      let a4 = constrain((introTimer - 100) * 4, 0, 255);
      textSize(32);
      fill(255, 255, 255, a4);
      let emojis = ['🌽','🥕','🍅','🌻','🐄','🚜','🐝','🌿'];
      for (let i = 0; i < emojis.length; i++) {
        let angle = (TWO_PI / emojis.length) * i + introTimer * 0.012;
        let rx = width/2  + cos(angle) * 170;
        let ry = height/2 - 35 + sin(angle) * 60;
        text(emojis[i], rx, ry);
      }
    }

    // Botão ENTRAR
    if (introTimer > 180) {
      let a5 = constrain((introTimer - 180) * 4, 0, 255);
      let pulse = sin(introTimer * 0.08) * 6;
      let bw = 220, bh = 52;
      let bx = width/2 - bw/2, by = height/2 + 90;

      // Brilho externo
      noFill();
      strokeWeight(2);
      stroke(100, 255, 100, a5 * 0.4);
      rect(bx - 6 + pulse/2, by - 6 + pulse/2, bw + 12 - pulse, bh + 12 - pulse, 14);

      // Botão
      fill(30, 140, 30, a5);
      stroke(80, 220, 80, a5);
      strokeWeight(2);
      rect(bx, by, bw, bh, 10);

      // Texto do botão
      noStroke();
      fill(255, 255, 200, a5);
      textSize(20);
      text('🌾  COMEÇAR JORNADA  🌾', width/2, by + bh/2 + 1);

      // Instrução
      fill(180, 255, 180, a5 * 0.7);
      textSize(11);
      text('Clique no botão ou pressione ENTER', width/2, by + bh + 18);
    }
    pop();
  }

  // Partículas flutuantes
  drawFloatingSeeds(t);
}

function drawStars(alpha) {
  randomSeed(42);
  fill(255, 255, 255, alpha * 200);
  noStroke();
  for (let i = 0; i < 80; i++) {
    let sx = random(width);
    let sy = random(height * 0.6);
    let ss = random(1, 3);
    ellipse(sx, sy, ss, ss);
  }
}

function drawSunrise(t) {
  // Gradiente do sol
  let sy = lerp(height + 60, height * 0.28, t);
  let sr = lerp(0, 70, t);
  for (let i = sr * 3; i > 0; i--) {
    let alpha = map(i, 0, sr * 3, 180, 0) * t;
    fill(255, 200, 50, alpha);
    noStroke();
    ellipse(width * 0.72, sy, i * 2, i * 2);
  }
  // Disco solar
  fill(255, 230, 80, min(t * 3, 1) * 255);
  noStroke();
  ellipse(width * 0.72, sy, sr * 2, sr * 2);
}

function drawFieldSilhouette(t) {
  // Colinas
  fill(20, 80, 20, 200);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height - 80 - sin(x * 0.008) * 40 - cos(x * 0.015) * 25;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Silhuetas de árvores
  fill(15, 60, 15, 220);
  let treeX = [60, 130, 220, 580, 670, 750];
  let treeH = [90, 70, 110, 80, 100, 65];
  for (let i = 0; i < treeX.length; i++) {
    let tx = treeX[i], th = treeH[i];
    let ty = height - 80 - sin(tx * 0.008) * 40 - cos(tx * 0.015) * 25;
    // Tronco
    rect(tx - 5, ty - 20, 10, 20);
    // Copa
    triangle(tx, ty - th, tx - 28, ty, tx + 28, ty);
    triangle(tx, ty - th * 0.7, tx - 22, ty + 10, tx + 22, ty + 10);
  }

  // Silo / celeiro silhueta
  fill(40, 30, 20, 200);
  rect(350, height - 130, 60, 80);
  triangle(350, height - 130, 380, height - 175, 410, height - 130);
}

function drawFloatingSeeds(t) {
  randomSeed(99);
  for (let i = 0; i < 18; i++) {
    let x = (random(width) + introTimer * (0.3 + random(0.4))) % width;
    let y = random(height * 0.8);
    let s = random(10, 22);
    let a = sin(introTimer * 0.04 + i) * 0.3 + 0.7;
    fill(255, 255, 255, a * 80 * t);
    noStroke();
    textSize(s);
    textAlign(CENTER, CENTER);
    text('✦', x, y);
  }
}

// ============================================================
//  ░░░  MENU PRINCIPAL  ░░░
// ============================================================
function initMenuButtons() {
  menuButtons = [
    { label:'🌾 Jogar — Cultivar o Campo',  action:'game',  x:400, y:260, w:340, h:52 },
    { label:'📚 Aprender — Fatos do Agro',  action:'info',  x:400, y:330, w:340, h:52 },
    { label:'🌍 Sobre o Projeto',            action:'about', x:400, y:400, w:340, h:52 },
  ];
}

function drawMenu() {
  menuPulse++;
  drawSkyBG(menuPulse);
  drawAnimatedClouds();
  drawAnimatedBirds();
  drawGameGround(0);
  drawNPCsMenu();
  drawButterflies();

  // Painel central
  push();
  fill(0, 0, 0, 140);
  noStroke();
  rect(width/2 - 210, 130, 420, 310, 18);

  textAlign(CENTER, CENTER);
  fill(255, 240, 100);
  textSize(34);
  text('🌾 AgroVida 🌾', width/2, 175);

  fill(180, 255, 160);
  textSize(13);
  text('Explore, cultive e aprenda sobre o campo!', width/2, 210);
  pop();

  // Botões
  for (let b of menuButtons) {
    drawMenuButton(b);
  }

  // Rodapé
  push();
  textAlign(CENTER, CENTER);
  fill(200, 255, 180, 160);
  textSize(11);
  text('🌱 Agricultura Sustentável · Conexão Campo e Cidade · Importância do Agro', width/2, height - 18);
  pop();
}

function drawMenuButton(b) {
  let mx = mouseX, my = mouseY;
  let over = mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
             my > b.y - b.h/2 && my < b.y + b.h/2;
  let pulse = over ? sin(menuPulse * 0.15) * 4 : 0;

  push();
  if (over) {
    fill(60, 180, 60, 230);
    stroke(120, 255, 120);
  } else {
    fill(20, 100, 20, 200);
    stroke(60, 160, 60);
  }
  strokeWeight(2);
  rect(b.x - b.w/2 - pulse/2, b.y - b.h/2 - pulse/2, b.w + pulse, b.h + pulse, 10);

  noStroke();
  fill(over ? color(255,255,200) : color(200,240,180));
  textSize(16);
  textAlign(CENTER, CENTER);
  text(b.label, b.x, b.y);
  pop();
}

// ============================================================
//  ░░░  JOGO PRINCIPAL  ░░░
// ============================================================
function initPlants() {
  plants = [];
  let slots = [
    {x:160,y:390},{x:240,y:390},{x:320,y:390},
    {x:400,y:390},{x:480,y:390},{x:560,y:390},
    {x:640,y:390},
  ];
  for (let s of slots) {
    plants.push({
      x: s.x, y: s.y,
      stage: 0,       // 0=solo, 1=broto, 2=planta, 3=madura
      timer: 0,
      growTime: int(random(200, 350)),
      type: int(random(5)),
      watered: false,
      selected: false,
    });
  }
}

function initGameButtons() {
  gameButtons = [
    { label:'💧 Regar',     action:'water',    x:100, y:520, w:130, h:38 },
    { label:'🌱 Plantar',   action:'plant',    x:250, y:520, w:130, h:38 },
    { label:'🌾 Colher',    action:'harvest',  x:400, y:520, w:130, h:38 },
    { label:'♻️ Compostar', action:'compost',  x:550, y:520, w:130, h:38 },
    { label:'🏠 Menu',      action:'menu',     x:700, y:520, w:90,  h:38 },
  ];
}

const plantEmojis  = ['🌽','🥕','🍅','🌻','🥦'];
const plantStages  = [
  ['🟫','🌱','🌿',''],
  ['🟫','🌱','🌿',''],
  ['🟫','🌱','🌿',''],
  ['🟫','🌱','🌿',''],
  ['🟫','🌱','🌿',''],
];

function drawGame() {
  updateGame();

  drawSkyBG(frameCount);
  drawSun();
  drawAnimatedClouds();
  if (isRaining) drawRain();
  drawAnimatedBirds();
  drawGameGround(1);
  drawButterflies();
  drawPlants();
  drawFarmer();
  drawNPCsGame();
  drawHarvestEffects();
  drawGameHUD();
  drawGameButtons();
  drawTooltip();
}

function updateGame() {
  // Movimento do agricultor
  farmer.frameTimer++;
  if (farmer.frameTimer > 10) {
    farmer.frame = (farmer.frame + 1) % 2;
    farmer.frameTimer = 0;
  }
  farmer.moving = false;
  if (keys['ArrowLeft']  || keys['a']) { farmer.x -= 3; farmer.dir = -1; farmer.moving = true; }
  if (keys['ArrowRight'] || keys['d']) { farmer.x += 3; farmer.dir =  1; farmer.moving = true; }
  if (keys['ArrowUp']    || keys['w']) { farmer.y -= 2; farmer.moving = true; }
  if (keys['ArrowDown']  || keys['s']) { farmer.y += 2; farmer.moving = true; }
  farmer.x = constrain(farmer.x, 30, width - 30);
  farmer.y = constrain(farmer.y, 340, height - 70);

  // Crescimento das plantas
  for (let p of plants) {
    if (p.stage > 0 && p.stage < 3) {
      if (p.watered) p.timer += 1.5; else p.timer += 0.4;
      if (p.timer >= p.growTime) {
        p.stage = min(p.stage + 1, 3);
        p.timer = 0;
        p.growTime = int(random(200, 350));
        if (p.stage === 3) {
          harvestEffects.push({ x: p.x, y: p.y - 30, alpha: 255, dy: -1.5 });
        }
      }
    }
  }

  // Recursos
  dayTimer++;
  if (dayTimer > 600) {
    dayTimer = 0;
    day++;
    water    = max(water    - int(random(5, 15)), 0);
    nutrient = max(nutrient - int(random(3, 10)), 0);
    if (day % 4 === 0) season = (season + 1) % 4;
  }

  // Chuva aleatória
  rainTimer++;
  if (rainTimer > 900 && !isRaining) {
    if (random() < 0.008) { isRaining = true; rainTimer = 0; }
  }
  if (isRaining) {
    rainTimer++;
    if (rainTimer > 400) { isRaining = false; rainTimer = 0; water = min(water + 20, 100); }
    for (let r of rainDrops) {
      r.y += r.speed;
      r.x += 0.5;
      if (r.y > height) { r.y = -10; r.x = random(width); }
    }
  }

  // Borboletas
  for (let b of butterflies) {
    b.x += cos(b.angle) * b.speed;
    b.y += sin(b.angle) * b.speed * 0.5 + sin(frameCount * 0.05 + b.phase) * 0.8;
    b.angle += random(-0.05, 0.05);
    b.wingPhase += 0.18;
    if (b.x < -30) b.x = width + 10;
    if (b.x > width + 30) b.x = -10;
    b.y = constrain(b.y, 200, height - 100);
  }

  // Nuvens
  for (let c of clouds) {
    c.x += c.speed;
    if (c.x > width + 120) c.x = -120;
  }

  // Pássaros
  for (let b of birds) {
    b.x += b.speed;
    b.y += sin(frameCount * 0.03 + b.phase) * 0.6;
    if (b.x > width + 60) b.x = -60;
  }

  // NPCs
  for (let n of npcs) {
    n.x += n.dir * n.speed;
    n.frameTimer++;
    if (n.frameTimer > 20) { n.frame = (n.frame + 1) % 2; n.frameTimer = 0; }
    if (n.x > width - 40 || n.x < 40) n.dir *= -1;
  }

  // Efeitos de colheita
  for (let i = harvestEffects.length - 1; i >= 0; i--) {
    harvestEffects[i].y += harvestEffects[i].dy;
    harvestEffects[i].alpha -= 3;
    if (harvestEffects[i].alpha <= 0) harvestEffects.splice(i, 1);
  }

  // Tooltip fade
  if (tooltip.alpha > 0) tooltip.alpha -= 2;
}

function drawSun() {
  let sc = seasonColors[season];
  // Raios
  push();
  translate(width - 80, 70);
  noFill();
  for (let i = 0; i < 12; i++) {
    let a = (TWO_PI / 12) * i + frameCount * 0.01;
    let len = 38 + sin(frameCount * 0.05 + i) * 6;
    stroke(sc[0], sc[1], sc[2], 80);
    strokeWeight(2);
    line(cos(a) * 28, sin(a) * 28, cos(a) * len, sin(a) * len);
  }
  // Disco
  fill(sc[0], sc[1], sc[2]);
  noStroke();
  ellipse(0, 0, 52, 52);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(season === 3 ? '🌨️' : '☀️', 0, 0);
  pop();
}

function drawPlants() {
  for (let p of plants) {
    // Solo
    fill(100, 60, 20);
    noStroke();
    ellipse(p.x, p.y + 12, 60, 18);

    // Indicador de seleção
    if (p.selected) {
      noFill();
      stroke(255, 255, 100, 160 + sin(frameCount * 0.1) * 80);
      strokeWeight(2);
      ellipse(p.x, p.y + 12, 68, 24);
    }

    // Planta
    push();
    textAlign(CENTER, CENTER);
    textSize(p.stage === 0 ? 18 : p.stage === 1 ? 22 : p.stage === 2 ? 28 : 34);
    noStroke();
    if (p.stage === 0) {
      text('🟫', p.x, p.y);
    } else if (p.stage === 1) {
      text('🌱', p.x, p.y);
    } else if (p.stage === 2) {
      text('🌿', p.x, p.y);
    } else {
      text(plantEmojis[p.type], p.x, p.y - 5);
    }

    // Gotinha se regada
    if (p.watered && p.stage > 0) {
      textSize(14);
      text('💧', p.x + 18, p.y - 18);
    }
    pop();

    // Barra de crescimento
    if (p.stage > 0 && p.stage < 3) {
      let prog = p.timer / p.growTime;
      fill(50, 50, 50, 160);
      noStroke();
      rect(p.x - 22, p.y + 22, 44, 6, 3);
      fill(80, 200, 80);
      rect(p.x - 22, p.y + 22, 44 * prog, 6, 3);
    }
  }
}

function drawFarmer() {
  push();
  translate(farmer.x, farmer.y);
  scale(farmer.dir, 1);
  textAlign(CENTER, CENTER);
  textSize(farmer.moving ? (farmer.frame === 0 ? 36 : 34) : 36);
  noStroke();
  text('👨‍🌾', 0, 0);
  // Ferramenta
  textSize(18);
  text('🪣', 22, 8);
  pop();

  // Nome
  push();
  textAlign(CENTER, CENTER);
  fill(255, 255, 200, 200);
  textSize(11);
  noStroke();
  text('Agricultor', farmer.x, farmer.y - 28);
  pop();
}

function drawNPCsMenu() {
  for (let n of npcs) {
    push();
    translate(n.x, n.y);
    scale(n.dir, 1);
    textAlign(CENTER, CENTER);
    textSize(30);
    noStroke();
    text(n.emoji, 0, 0);
    pop();
  }
}

function drawNPCsGame() {
  for (let n of npcs) {
    push();
    translate(n.x, n.y);
    scale(n.dir, 1);
    textAlign(CENTER, CENTER);
    textSize(28);
    noStroke();
    text(n.emoji, 0, 0);
    // Balão de fala ocasional
    if (frameCount % 300 === int(n.x) % 300) {
      fill(255, 255, 255, 200);
      rect(-40, -55, 80, 28, 8);
      fill(50, 50, 50);
      textSize(11);
      scale(n.dir, 1);
      text(n.speech, 0, -40);
    }
    pop();
  }
}

function drawHarvestEffects() {
  for (let e of harvestEffects) {
    push();
    textAlign(CENTER, CENTER);
    textSize(22);
    fill(255, 255, 100, e.alpha);
    noStroke();
    text('✨ +Colheita!', e.x, e.y);
    pop();
  }
}

function drawGameHUD() {
  // Painel superior
  push();
  fill(0, 0, 0, 160);
  noStroke();
  rect(0, 0, width, 55);

  textAlign(LEFT, CENTER);
  textSize(13);

  // Água
  fill(100, 200, 255);
  text('💧 Água:', 14, 18);
  fill(30, 30, 60);
  rect(90, 10, 80, 14, 4);
  fill(100, 180, 255);
  rect(90, 10, 80 * (water / 100), 14, 4);
  fill(200, 240, 255);
  text(int(water) + '%', 176, 18);

  // Nutrientes
  fill(180, 255, 100);
  text('🌿 Solo:', 14, 38);
  fill(30, 60, 20);
  rect(90, 30, 80, 14, 4);
  fill(100, 200, 60);
  rect(90, 30, 80 * (nutrient / 100), 14, 4);
  fill(220, 255, 180);
  text(int(nutrient) + '%', 176, 38);

  // Colheita
  fill(255, 220, 80);
  textSize(13);
  text('🌾 Colheita: ' + harvest, 270, 18);

  // Dia
  fill(200, 240, 255);
  text('📅 Dia: ' + day, 270, 38);

  // Estação
  fill(255, 255, 200);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(seasonNames[season], width/2 + 80, 28);

  // Chuva
  if (isRaining) {
    fill(100, 180, 255, 200);
    textSize(14);
    text('🌧️ Chovendo! +Água', width - 130, 28);
  }
  pop();
}

function drawGameButtons() {
  for (let b of gameButtons) {
    let mx = mouseX, my = mouseY;
    let over = mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
               my > b.y - b.h/2 && my < b.y + b.h/2;
    push();
    if (over) {
      fill(60, 180, 60, 230);
      stroke(120, 255, 120);
    } else {
      fill(20, 80, 20, 200);
      stroke(60, 140, 60);
    }
    strokeWeight(1.5);
    rect(b.x - b.w/2, b.y - b.h/2, b.w, b.h, 8);
    noStroke();
    fill(over ? color(255,255,200) : color(200,240,180));
    textSize(13);
    textAlign(CENTER, CENTER);
    text(b.label, b.x, b.y);
    pop();
  }
}

function drawTooltip() {
  if (tooltip.alpha <= 0) return;
  push();
  fill(0, 0, 0, tooltip.alpha * 0.8);
  noStroke();
  rect(tooltip.x - 80, tooltip.y - 28, 160, 30, 8);
  fill(255, 255, 200, tooltip.alpha);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(tooltip.text, tooltip.x, tooltip.y - 13);
  pop();
}

function showTooltip(txt, x, y) {
  tooltip.text  = txt;
  tooltip.x     = x;
  tooltip.y     = y;
  tooltip.alpha = 255;
}

// ============================================================
//  ░░░  TELA DE INFORMAÇÕES  ░░░
// ============================================================
function drawInfo() {
  drawSkyBG(frameCount);
  drawAnimatedClouds();
  drawGameGround(0);

  // Painel
  push();
  fill(0, 0, 0, 190);
  noStroke();
  rect(60, 50, width - 120, height - 120, 18);

  let card = infoCards[infoCard];

  // Título
  textAlign(CENTER, CENTER);
  fill(255, 240, 100);
  textSize(22);
  text(card.title, width/2, 95);

  // Corpo
  fill(220, 255, 200);
  textSize(14);
  textAlign(LEFT, TOP);
  let lines = card.body.split('\n');
  let ly = 130;
  for (let l of lines) {
    text(l, 100, ly);
    ly += 24;
  }

  // Navegação
  textAlign(CENTER, CENTER);
  fill(200, 255, 180);
  textSize(13);
  text('◀ Anterior  |  Próximo ▶', width/2, height - 100);
  text('Cartão ' + (infoCard + 1) + ' de ' + infoCards.length, width/2, height - 78);

  // Botão voltar
  let bx = width/2, by = height - 50;
  let over = dist(mouseX, mouseY, bx, by) < 60;
  fill(over ? color(60,180,60,230) : color(20,100,20,200));
  stroke(80, 200, 80);
  strokeWeight(2);
  rect(bx - 80, by - 20, 160, 40, 10);
  noStroke();
  fill(255, 255, 200);
  textSize(15);
  text('🏠 Voltar ao Menu', bx, by);
  pop();

  // Ícone decorativo
  push();
  textSize(60);
  textAlign(CENTER, CENTER);
  noStroke();
  let icons = ['🌱','💧','🚜','♻️','🌻'];
  text(icons[infoCard], width - 120, 110);
  pop();
}

// ============================================================
//  ░░░  ELEMENTOS COMPARTILHADOS  ░░░
// ============================================================
function drawSkyBG(t) {
  let sc = seasonColors[season];
  // Gradiente céu
  for (let y = 0; y < height * 0.65; y++) {
    let inter = map(y, 0, height * 0.65, 0, 1);
    let r = lerp(sc[0] * 0.4 + 20, sc[0] * 0.9 + 30, inter);
    let g = lerp(sc[1] * 0.5 + 60, sc[1] * 0.6 + 80, inter);
    let b = lerp(sc[2] * 0.3 + 80, sc[2] * 0.2 + 40, inter);
    stroke(r, g, b);
    line(0, y, width, y);
  }
  noStroke();
}

function drawGameGround(detail) {
  // Chão base
  fill(60, 120, 40);
  noStroke();
  rect(0, height * 0.62, width, height * 0.38);

  // Faixa de terra cultivada
  fill(100, 65, 30);
  rect(0, height * 0.68, width, height * 0.12);

  // Linhas de sulco
  stroke(80, 50, 20, 120);
  strokeWeight(1);
  for (let x = 0; x < width; x += 80) {
    line(x, height * 0.68, x + 20, height * 0.80);
  }
  noStroke();

  // Grama
  fill(50, 160, 50);
  for (let x = 0; x < width; x += 18) {
    let h = 8 + sin(x * 0.3 + frameCount * 0.02) * 4;
    triangle(x, height * 0.62, x + 9, height * 0.62 - h, x + 18, height * 0.62);
  }

  if (detail === 1) {
    // Cerca
    stroke(120, 80, 40);
    strokeWeight(3);
    for (let x = 20; x < width; x += 60) {
      line(x, height * 0.60, x, height * 0.68);
    }
    strokeWeight(2);
    line(0, height * 0.63, width, height * 0.63);
    line(0, height * 0.66, width, height * 0.66);
    noStroke();

    // Celeiro
    fill(160, 60, 40);
    rect(680, height * 0.46, 90, 80);
    fill(120, 40, 20);
    triangle(680, height * 0.46, 725, height * 0.38, 770, height * 0.46);
    fill(80, 40, 20);
    rect(710, height * 0.50, 30, 40);
    // Janela
    fill(255, 220, 100, 180);
    rect(688, height * 0.50, 18, 18, 3);
    rect(742, height * 0.50, 18, 18, 3);
    // Silo
    fill(180, 160, 100);
    rect(620, height * 0.52, 40, 65);
    ellipse(640, height * 0.52, 40, 20);
    fill(160, 140, 80);
    ellipse(640, height * 0.52 + 65, 40, 14);

    // Trator decorativo
    push();
    textSize(36);
    textAlign(CENTER, CENTER);
    noStroke();
    text('🚜', 80, height * 0.56);
    pop();
  }
}

function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: random(width),
      y: random(40, 130),
      w: random(80, 160),
      h: random(30, 55),
      speed: random(0.2, 0.6),
      alpha: random(180, 240),
    });
  }
}

function drawAnimatedClouds() {
  for (let c of clouds) {
    push();
    fill(255, 255, 255, isRaining ? c.alpha * 0.5 : c.alpha);
    noStroke();
    ellipse(c.x,        c.y,        c.w,        c.h);
    ellipse(c.x + 28,   c.y - 14,   c.w * 0.65, c.h * 0.8);
    ellipse(c.x - 28,   c.y - 8,    c.w * 0.55, c.h * 0.7);
    if (isRaining) {
      fill(150, 150, 180, c.alpha * 0.6);
      ellipse(c.x, c.y, c.w * 1.1, c.h * 1.2);
    }
    pop();
  }
}

function initBirds() {
  birds = [];
  for (let i = 0; i < 5; i++) {
    birds.push({
      x: random(width),
      y: random(60, 160),
      speed: random(0.8, 2.0),
      phase: random(TWO_PI),
      size: random(14, 22),
    });
  }
}

function drawAnimatedBirds() {
  for (let b of birds) {
    push();
    textAlign(CENTER, CENTER);
    textSize(b.size);
    noStroke();
    text('🐦', b.x, b.y);
    pop();
  }
}

function initSunParticles() {
  sunParticles = [];
  for (let i = 0; i < 20; i++) {
    sunParticles.push({
      angle: random(TWO_PI),
      r: random(30, 60),
      speed: random(0.01, 0.03),
      size: random(3, 7),
    });
  }
}

function initNPCs() {
  npcs = [
    { x:200, y:460, dir:1, speed:0.6, emoji:'👩‍🌾', frame:0, frameTimer:0,
      speech:'Vamos plantar! 🌱' },
    { x:500, y:465, dir:-1, speed:0.5, emoji:'👨‍🔬', frame:0, frameTimer:0,
      speech:'Solo saudável! 🌿' },
    { x:350, y:455, dir:1, speed:0.4, emoji:'🧑‍🍳', frame:0, frameTimer:0,
      speech:'Da roça pra mesa! 🍽️' },
  ];
}

function initButterflies() {
  butterflies = [];
  for (let i = 0; i < 6; i++) {
    butterflies.push({
      x: random(width),
      y: random(200, 400),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      phase: random(TWO_PI),
      wingPhase: random(TWO_PI),
      color: [random(100,255), random(100,255), random(100,255)],
    });
  }
}

function drawButterflies() {
  for (let b of butterflies) {
    push();
    textAlign(CENTER, CENTER);
    textSize(16);
    noStroke();
    let emojis = ['🦋','🐝','🦗','🐛'];
    text(emojis[int(b.phase * 2) % emojis.length], b.x, b.y);
    pop();
  }
}

function initRain() {
  rainDrops = [];
  for (let i = 0; i < 120; i++) {
    rainDrops.push({
      x: random(width),
      y: random(height),
      speed: random(6, 12),
      len: random(8, 18),
    });
  }
}

function drawRain() {
  push();
  stroke(150, 180, 255, 160);
  strokeWeight(1);
  for (let r of rainDrops) {
    line(r.x, r.y, r.x + 2, r.y + r.len);
  }
  pop();
}

// ============================================================
//  ░░░  INTERAÇÕES  ░░░
// ============================================================
function mousePressed() {
  // --- INTRO ---
  if (state === STATE_INTRO && introTimer > 180) {
    let bw = 220, bh = 52;
    let bx = width/2 - bw/2, by = height/2 + 90;
    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
      state = STATE_MENU;
    }
  }

  // --- MENU ---
  if (state === STATE_MENU) {
    for (let b of menuButtons) {
      if (mouseX > b.x - b.w/2 && mouseX < b.x + b.w/2 &&
          mouseY > b.y - b.h/2 && mouseY < b.y + b.h/2) {
        if (b.action === 'game')  { initPlants(); state = STATE_GAME; }
        if (b.action === 'info')  { infoCard = 0; state = STATE_INFO; }
        if (b.action === 'about') { infoCard = 0; state = STATE_INFO; }
      }
    }
  }

  // --- JOGO ---
  if (state === STATE_GAME) {
    // Selecionar planta
    for (let p of plants) {
      if (dist(mouseX, mouseY, p.x, p.y + 12) < 30) {
        p.selected = !p.selected;
      }
    }

    // Botões
    for (let b of gameButtons) {
      if (mouseX > b.x - b.w/2 && mouseX < b.x + b.w/2 &&
          mouseY > b.y - b.h/2 && mouseY < b.y + b.h/2) {
        handleGameButton(b.action);
      }
    }
  }

  // --- INFO ---
  if (state === STATE_INFO) {
    // Próximo / anterior
    if (mouseX > width/2 + 20 && mouseY > height - 115 && mouseY < height - 85) {
      infoCard = (infoCard + 1) % infoCards.length;
    }
    if (mouseX < width/2 - 20 && mouseY > height - 115 && mouseY < height - 85) {
      infoCard = (infoCard - 1 + infoCards.length) % infoCards.length;
    }
    // Voltar
    let bx = width/2, by = height - 50;
    if (dist(mouseX, mouseY, bx, by) < 80) {
      state = STATE_MENU;
    }
  }
}

function handleGameButton(action) {
  let selected = plants.filter(p => p.selected);
  if (selected.length === 0 && action !== 'menu') {
    showTooltip('Selecione uma planta primeiro!', mouseX, mouseY);
    return;
  }

  if (action === 'water') {
    if (water < 10) { showTooltip('💧 Sem água!', mouseX, mouseY); return; }
    for (let p of selected) {
      if (p.stage > 0) { p.watered = true; water -= 5; }
    }
    showTooltip('💧 Regado!', mouseX, mouseY);
  }

  if (action === 'plant') {
    for (let p of selected) {
      if (p.stage === 0) {
        p.stage = 1;
        p.timer = 0;
        p.type  = int(random(5));
        p.watered = false;
        showTooltip('🌱 Plantado!', mouseX, mouseY);
      }
    }
  }

  if (action === 'harvest') {
    let count = 0;
    for (let p of selected) {
      if (p.stage === 3) {
        harvest += 1;
        p.stage  = 0;
        p.timer  = 0;
        p.watered = false;
        p.selected = false;
        count++;
        harvestEffects.push({ x: p.x, y: p.y - 30, alpha: 255, dy: -2 });
      }
    }
    if (count > 0) showTooltip('🌾 +' + count + ' colhido!', mouseX, mouseY);
    else showTooltip('Planta não está madura!', mouseX, mouseY);
  }

  if (action === 'compost') {
    if (harvest >= 2) {
      harvest   -= 2;
      nutrient   = min(nutrient + 20, 100);
      showTooltip('♻️ Solo nutrido! +20%', mouseX, mouseY);
    } else {
      showTooltip('Precisa de 2 colheitas!', mouseX, mouseY);
    }
  }

  if (action === 'menu') {
    state = STATE_MENU;
  }
}

function keyPressed() {
  keys[key] = true;
  keys[keyCode] = true;

  // ENTER na intro
  if ((key === 'Enter' || keyCode === ENTER) && state === STATE_INTRO && introTimer > 180) {
    state = STATE_MENU;
  }

  // ESC volta ao menu
  if (keyCode === ESCAPE) {
    if (state === STATE_GAME || state === STATE_INFO) state = STATE_MENU;
  }

  // Setas na tela de info
  if (state === STATE_INFO) {
    if (keyCode === RIGHT_ARROW) infoCard = (infoCard + 1) % infoCards.length;
    if (keyCode === LEFT_ARROW)  infoCard = (infoCard - 1 + infoCards.length) % infoCards.length;
  }

  // Atalhos no jogo
  if (state === STATE_GAME) {
    if (key === 'r' || key === 'R') handleGameButton('water');
    if (key === 'p' || key === 'P') handleGameButton('plant');
    if (key === 'c' || key === 'C') handleGameButton('harvest');
    if (key === 'x' || key === 'X') handleGameButton('compost');
  }
}

function keyReleased() {
  keys[key] = false;
  keys[keyCode] = false;
}
