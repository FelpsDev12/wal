


import { fase1 } from "./fase1.js";

let isPaused = false

import { colisaoVertical, checarColisaoLateral, checkCollision, modificarObstaculo } from "./fun/functions.js";


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const teladerrota = document.querySelector(".teladerrota"); 
const restart = document.getElementById("restart");       
const dica = document.querySelector('.dica')             


let GRAVITY = 0.6;
let GROUND_Y = 400; 


let player = {
    x: 50, y: 260, w: 40, h: 40, 
    speed: 6, vy: 0,             
    onGround: false, morto: false 
};


let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};


document.addEventListener("keydown", (e) => {
    if (e.code === "Space") keys.Space = true;
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") keys.Space = false;
    if (keys[e.key] !== undefined) keys[e.key] = false;
});


function update() {
    if (player.morto) return; 

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.w > canvas.width) {
        player.x = canvas.width - player.w; 
    }
    
    if (!fase1.game.isPaused) {
    if (keys.Space && player.onGround) {
        player.vy = -14;            
        player.onGround = false;    
        keys.Space = false;         
    }
}

    
    player.vy += GRAVITY;           

    
    player.y += player.vy;          

    
    player.onGround = false;        

    
    if (player.y + player.h >= GROUND_Y) {
        player.y = GROUND_Y - player.h; 
        player.vy = 0;                  
        player.onGround = true;         
    }

    
    fase1.plataformas.forEach(pl => {
        if (pl.visible !== false)
            colisaoVertical(player, pl); 

        
        
        
        fase1.updateFase(player, ctx); 
    });
    
    if (checkCollision(fase1.dicaImg, player)) {
        console.log('detectado')
        
        fase1.updateFase(player, ctx)
    }
    
    
    
    let velocidade = player.onGround ? player.speed : player.speed * 0.5;

    if (!fase1.game.isPaused) {
    if (keys.ArrowLeft)  player.x -= velocidade;
    if (keys.ArrowRight) player.x += velocidade;
    }

    
    fase1.plataformas.forEach(pl => {
        if (pl.visible !== false)
            checarColisaoLateral(player, pl); 
    });

    
    if (checkCollision(player, fase1.obstaculo)) {
        player.morto = true;
        telaDerrota(); 
    }
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    
    ctx.fillStyle = "#333";
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    
    fase1.plataformas.forEach(p => {
        if (p.visible !== false) {
            ctx.fillStyle = p.color || "#333";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    });


        ctx.drawImage(fase1.obstaculo.img, fase1.obstaculo.x, fase1.obstaculo.y, fase1.obstaculo.w, fase1.obstaculo.h);

    
    const playerImage = new Image()
    playerImage.src = 'assets/stickman.png'

    
    if (!player.morto) {
        ctx.fillStyle = "orange";
        
        ctx.drawImage(playerImage ,Math.round(player.x), Math.round(player.y), player.w, player.h);
    }

    
    
    fase1.updateFase(player, ctx);
}



function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); 
}


restart.onclick = () => reset(); 

function reset() {
    
    player.x = 50;
    player.y = 360;
    player.vy = 0;
    player.morto = false;

    fase1.obstaculo.y = 500;
    fase1.obstaculo.h = 40;
    
    fase1.obstaculo.subiu = false;
    fase1.obstaculo.subiu1 = false;
    fase1.obstaculo.aumentou = false;
    fase1.obstaculo.sumiu = false;
    fase1.dica3.visible = false
    fase1.plataformas[3].modificou = false

    fase1.dica1.hidden = false
    fase1.dica2.hidden = false
    fase1.dica3.hidden = false


    telaDerrota(false); 
}

function telaDerrota(show = true) {
    teladerrota.style.visibility = show ? "visible" : "hidden";
    canvas.style.background = show ? "red" : "white";
}

setInterval(() => {
    if (fase1.game.isPaused == true) {
        console.log('pausado')
    } else {
        console.log('despausado')
    }
}, 1000);


gameLoop();
