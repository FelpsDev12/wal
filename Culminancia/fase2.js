
import { checkCollision, subirObstaculo, modificarObstaculo, checarColisaoLateral } from "./fun/functions.js";

const dica = document.querySelector('.dica')
const canvas = document.getElementById('game-canvas');

export const fase2 = {
    
    plataformas: [
        
    ],

    game: {
        isPaused: false
    },
    
     dica1: {
    x: 715,
    y: 160,
    w: 40, 
    h: 40,
    hidden: false,
    },

    dica2: {
        x: 115,
        y: 80,
        w: 40,
        h: 40,
        hidden: false,
    },

    dica3: {
        x: 350,
        y: 160,
        w: 40,
        h: 40,
        visible: false,
        hidden: false,
    },
    
    obstaculo: {
        x: 300,
        y: 500, 
        w: 25,
        h: 40,
        subiu: false,
        subiu1: false,
        aumentou: false,
        andou: false,
        sumiu: false,
        src: "assets/espinhos.png",
        
        img: (() => {
            const im = new Image();
            im.src = "assets/espinhos.png";
            return im;
        })()
    },

    
    dicaImg: (() => {
        const img = new Image();
        img.src = "assets/dica.png";
        return img;
    })(),

    
    updateFase(player, ctx) {
        
        
        this.plataformas[5].visible = player.x > 300;

        
        if (player.x > 220 && this.obstaculo.subiu1 == false) {
            subirObstaculo(this.obstaculo, 360, 80);
            this.obstaculo.subiu1 = true
        }

        if (player.x > 190 && player.onGround == false && this.obstaculo.subiu == false) {
           subirObstaculo(this.obstaculo, 250, 80)
           this.obstaculo.subiu = true
        }

        
        if (checkCollision(this.plataformas[3], player)) {
            
            modificarObstaculo(this.plataformas[3], 0, 200)
            
            setTimeout(() => {
                modificarObstaculo(this.plataformas[3], 70, 200)
            }, 2000);
        }

        if (this.dica1.hidden == false) {
        ctx.drawImage(
            this.dicaImg,
             this.dica1.x,
             this.dica1.y,
             this.dica1.w,
             this.dica1.h
        );
    }

        if (this.dica2.hidden == false) {
        ctx.drawImage(
            this.dicaImg,
            this.dica2.x,
            this.dica2.y,
            this.dica2.w,
            this.dica2.h
        );
    }

        if (checkCollision(player, this.dica1) && this.game.isPaused == false && this.dica1.hidden == false) {
            this.dica1.hidden = true
            this.game.isPaused = true
            dica.style.display = ''
            dica.innerHTML = `
        <h3>Dica</h3>
        <p>dica 1</p>
        <button id='okay'>Okay</button>
        `

        okay.onclick = () => {
            this.game.isPaused = false
            dica.style.display = 'none'
        }
        }

        if (checkCollision(player, this.dica2) && this.game.isPaused == false && this.dica2.hidden == false) {
            this.dica2.hidden = true
            this.plataformas[1].visible = true
            this.obstaculo.subiu = false
            this.obstaculo.subiu1 = false
            this.obstaculo.y = 500
            this.dica3.visible = true

                
                
            this.game.isPaused = true

            dica.style.display = ''
        dica.innerHTML = `
        <h3>Dica</h3>
        <p>dica 2</p>
        <button id='okay'>Okay</button>
        `

        okay.onclick = () => {
            this.game.isPaused = false
            dica.style.display = 'none'
        }
        }

        if (this.plataformas[1].visible == true) {
            ctx.fillStyle = '#333'
            ctx.fillRect(this.plataformasx, this.plataformas.y, this.plataformas.w, this.plataformas.h)            
        } 

        if (this.dica3.visible == true) {
            ctx.drawImage(
                this.dicaImg,
                this.dica3.x + 15,
                this.plataformas[1].y - 40,
                this.dica3.w,
                this.dica3.h
            );

        } else {
            this.dica3.visible = false
        }
    }
};

setInterval(() => {
    if (fase1.obstaculo.subiu == false) {
        console.log('obstaculo nao subiu')
    } else {
        console.log('obstaculo subiu')
    }
    }, 1000);
