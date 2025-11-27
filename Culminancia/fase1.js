
import { checkCollision, subirObstaculo, modificarObstaculo, checarColisaoLateral } from "./fun/functions.js";

const dica = document.querySelector('.dica')
const canvas = document.getElementById('game-canvas');

export const fase1 = {
    
    plataformas: [
        { x: 560, y: 200, w: 70, h: 25, color: "#333", class: 'dica'},
        { x: 350, y: 400, w: 70, h: 10, color: "#333", visible: false, class: 'dica'},
        { x: 100, y: 120, w: 70, h: 20, color: "#333", class: 'dica'},
        { x: 170, y: 170, w: 70, h: 20, color: "#333" }, 
        { x: 350, y: 200, w: 70, h: 20, color: "#333" },
        { x: 510, y: 320, w: 70, h: 20, color: "#333", visible: true },
    ],

    
    
     dica1: {
    x: 575,
    y: 160,
    w: 40, 
    h: 40
    },

    dica2: {
        x: 115,
        y: 80,
        w: 40,
        h: 40
    },

    dica3: {
        x: 375,
        y: 160,
        w: 40,
        h: 40,
        visible: false,
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
            
            modificarObstaculo(this.plataformas[3], 0, 300)
            
            setTimeout(() => {
                modificarObstaculo(this.plataformas[3], 70, 300)
            }, 2000);
        }

        
        ctx.drawImage(
            this.dicaImg,
             this.dica1.x,
             this.dica1.y,
             this.dica1.w,
             this.dica1.h
        );

        
        ctx.drawImage(
            this.dicaImg,
            this.dica2.x,
            this.dica2.y,
            this.dica2.w,
            this.dica2.h
        );

        if (checkCollision(player, this.dica2)) {
            this.plataformas[1].visible = true
            this.obstaculo.subiu = false
            this.obstaculo.subiu1 = false
            this.obstaculo.y = 500
            this.dica3.visible = true

            dica.style.display = ''
            dica.innerHTML = `
            <h3 id='title'>Dica</h3>
            <p id='dica'>é o aristoteles</p>
            `         
        }

        if (this.plataformas[1].visible == true) {
            ctx.fillStyle = '#333'
            ctx.fillRect(this.plataformasx, this.plataformas.y, this.plataformas.w, this.plataformas.h)            
        } 

        if (this.dica3.visible == true) {
            ctx.drawImage(
                this.dicaImg,
                this.plataformas[1].x + 15,
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
