// index.js (arquivo principal do jogo)

// Importa funções e dados de outros módulos
import { fase1 } from "./fase1.js";

let isPaused = false
// Importa funções de utilidade para colisão e modificação de objetos
import { colisaoVertical, checarColisaoLateral, checkCollision, modificarObstaculo } from "./fun/functions.js";

// Seleciona elementos do DOM (Document Object Model)
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const teladerrota = document.querySelector(".teladerrota"); // Tela de Game Over
const restart = document.getElementById("restart");       // Botão de reiniciar
const dica = document.querySelector('.dica')             // Elemento HTML para mostrar a dica

// Configurações iniciais do Canvas
canvas.width = 800;
canvas.height = 480;

// Variáveis de física global
let GRAVITY = 0.6;
let GROUND_Y = 400; // Coordenada Y do "chão" visual/físico

// Objeto que representa o jogador e seu estado
let player = {
    x: 50, y: 260, w: 40, h: 40, // Posição e tamanho
    speed: 5, vy: 0,             // Velocidade horizontal e vertical (vy)
    onGround: false, morto: false // Status do jogador
};

// Objeto para rastrear quais teclas estão pressionadas
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// --- INPUT (Captura de Eventos do Teclado) ---
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") keys.Space = true;
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") keys.Space = false;
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

// --- UPDATE (Lógica do Jogo e Física por Frame) ---
function update() {
    if (player.morto || isPaused) return; // Para de atualizar se o jogador estiver morto

    // --- PULO ---
    if (keys.Space && player.onGround) {
        player.vy = -14;            // Aplica força de pulo (velocidade vertical negativa = para cima)
        player.onGround = false;    
        keys.Space = false;         // Impede pulos múltiplos seguidos (duplo pulo)
    }

    // ----------- 1) GRAVIDADE -----------
    player.vy += GRAVITY;           // Aumenta a velocidade de queda a cada frame

    // ----------- 2) MOVER VERTICAL (Y) -----------
    player.y += player.vy;          // Move o jogador verticalmente

    // ----------- 3) COLISÃO VERTICAL (chão + plataformas) -----------
    player.onGround = false;        // Assume que o jogador está no ar até provar o contrário

    // Colisão com o chão fixo
    if (player.y + player.h >= GROUND_Y) {
        player.y = GROUND_Y - player.h; // Posiciona o jogador exatamente no chão
        player.vy = 0;                  // Zera a velocidade vertical (para de cair)
        player.onGround = true;         // Define o estado onGround
    }

    // Loop de colisão com plataformas dinâmicas
    fase1.plataformas.forEach(pl => {
        if (pl.visible !== false)
            colisaoVertical(player, pl); // Usa a função externa para gerenciar a física de pouso

        // ERRO LÓGICO/DESEMPENHO AQUI:
        // Você está chamando fase1.updateFase() DENTRO de um loop forEach de plataformas.
        // Isso faz a lógica da fase rodar múltiplas vezes por frame, o que é redundante e pode causar bugs.
        fase1.updateFase(player, ctx); 
    });

    // ERRO DE SINTAXE/LÓGICA AQUI:
    // 'fase1.dicaImg' é apenas um objeto Image, não tem x, y, w, h. 
    // Esta checagem de colisão falha ou usa valores indefinidos.
    if (checkCollision(fase1.dicaImg, player)) {
        console.log('detectado')
        // Chamar updateFase novamente aqui é redundante
        fase1.updateFase(player, ctx)
    }
    
    // ----------- 4) MOVER HORIZONTAL (X) -----------
    // Reduz a velocidade horizontal se o jogador estiver no ar
    let velocidade = player.onGround ? player.speed : player.speed * 0.5;

    if (keys.ArrowLeft)  player.x -= velocidade;
    if (keys.ArrowRight) player.x += velocidade;

    // ----------- 5) COLISÃO LATERAL -----------
    // Loop de colisão lateral com plataformas
    fase1.plataformas.forEach(pl => {
        if (pl.visible !== false)
            checarColisaoLateral(player, pl); // Usa a função externa para gerenciar a colisão lateral
    });

    // ----------- 6) COLISÃO COM OBSTÁCULOS MORTAIS -----------
    if (checkCollision(player, fase1.obstaculo)) {
        player.morto = true;
        telaDerrota(); // Mostra a tela de game over
    }
}


// --- DRAW (Renderização Visual por Frame) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Desenha o chão
    ctx.fillStyle = "#333";
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    // Desenha as plataformas
    fase1.plataformas.forEach(p => {
        if (p.visible !== false) {
            ctx.fillStyle = p.color || "#333";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    });

    // Desenha o obstáculo (se a imagem estiver carregada)
    if (fase1.obstaculo.img.complete) {
        ctx.drawImage(fase1.obstaculo.img, fase1.obstaculo.x, fase1.obstaculo.y, fase1.obstaculo.w, fase1.obstaculo.h);
    }

    // Carrega a imagem do player a CADA FRAME. Isso é extremamente ineficiente.
    // playerImage deveria ser carregada UMA VEZ na inicialização, assim como fase1.obstaculo.img.
    const playerImage = new Image()
    playerImage.src = 'assets/stickman.png'

    // Desenha o player
    if (!player.morto) {
        ctx.fillStyle = "orange";
        // Usa drawImage para desenhar a imagem do stickman
        ctx.drawImage(playerImage ,Math.round(player.x), Math.round(player.y), player.w, player.h);
    }

    // LÓGICA DE FASE: Deve ser chamada UMA VEZ por frame, geralmente no final do update.
    // Aqui está na função draw(), o que funciona, mas é menos comum.
    fase1.updateFase(player, ctx);
}


// --- LOOP PRINCIPAL DO JOGO ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Pede ao navegador para chamar gameLoop novamente no próximo frame
}

// --- FUNÇÕES DE REINICIALIZAÇÃO E UI ---
restart.onclick = () => reset(); // Atacha a função reset ao clique do botão restart

function reset() {
    // Reseta as variáveis do player e do obstáculo para o estado inicial
    player.x = 50;
    player.y = 360;
    player.vy = 0;
    player.morto = false;

    fase1.obstaculo.y = 500;
    fase1.obstaculo.h = 40;
    // Reseta os flags de estado do obstáculo
    fase1.obstaculo.subiu = false;
    fase1.obstaculo.subiu1 = false;
    fase1.obstaculo.aumentou = false;
    fase1.obstaculo.sumiu = false;
    fase1.dica3.visible = false


    telaDerrota(false); // Esconde a tela de derrota
}

function telaDerrota(show = true) {
    teladerrota.style.visibility = show ? "visible" : "hidden";
    canvas.style.background = show ? "red" : "white";
}

setInterval(() => {
    if (player.onGround == true) {
        console.log('No chao')
    } else {
        console.log('No Ar')
    }
}, 1000);

// Inicia o loop do jogo
gameLoop();
