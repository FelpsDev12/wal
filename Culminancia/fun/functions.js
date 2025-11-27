
export function colisaoVertical(player, plataforma) {
    
    const dentroX =
        player.x + player.w > plataforma.x &&
        player.x < plataforma.x + plataforma.w;

    if (!dentroX) return;

    
    if (player.vy > 0) {
        if (player.y + player.h > plataforma.y &&     
            player.y + player.h - player.vy <= plataforma.y) { 

            player.y = plataforma.y - player.h;
            player.vy = 0;
            player.onGround = true;
        }
    }

    
    else if (player.vy < 0) {
        if (player.y < plataforma.y + plataforma.h &&  
            player.y - player.vy >= plataforma.y + plataforma.h) { 

            player.y = plataforma.y + plataforma.h;
            player.vy = 0;
        }
    }
}


export function checkCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}



export function checarColisaoLateral(p, pl) {
    if (!pl) return;

    
    if (!(
        p.x < pl.x + pl.w &&
        p.x + p.w > pl.x &&
        p.y < pl.y + pl.h &&
        p.y + p.h > pl.y
    )) return;

    
    const penLeft   = (p.x + p.w) - pl.x;
    const penRight  = (pl.x + pl.w) - p.x;
    const penTop    = (p.y + p.h) - pl.y;
    const penBottom = (pl.y + pl.h) - p.y;

    
    if (Math.min(penTop, penBottom) < Math.min(penLeft, penRight)) {
        
        return;
    }

    
    if (penLeft < penRight) {
        p.x = pl.x - p.w - 0.1;   
    } else {
        p.x = pl.x + pl.w + 0.1; 
    }
}


export function subirObstaculo(elemento, YFinal, duracao = 500) {
    const inicio = performance.now();
    const YInicial = parseFloat(elemento.y);

    function animar(tempoAtual) {
        const progresso = Math.min((tempoAtual - inicio) / duracao, 1);
        
        const YAtual = YInicial + (YFinal - YInicial) * Math.pow(progresso, 0.3);
        elemento.y = YAtual;
        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }
    requestAnimationFrame(animar);
}

export function modificarObstaculo(elemento, WFinal, duracao = 500) {
    const inicio = performance.now();
    const WInicial = parseFloat(elemento.w);

    function animar(tempoAtual) {
        const progresso = Math.min((tempoAtual - inicio) / duracao, 1);
        
        const WAtual = WInicial + (WFinal - WInicial) * Math.pow(progresso, 0.3);
        elemento.w = WAtual;
        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }
    requestAnimationFrame(animar);   
}